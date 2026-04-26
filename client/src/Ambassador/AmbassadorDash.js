import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  ClipboardList,
  Trophy,
  User,
} from "lucide-react";

const AmbassadorDash = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [proofs, setProofs] = useState({});
  const [view, setView] = useState("dashboard");

  // ================= LOAD USER =================
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser && storedUser._id) {
        setUser(storedUser);
      }
    } catch (err) {
      console.log("User parse error", err);
    }
  }, []);

  // ================= FETCH STATS =================
  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:8000/user/stats/${user._id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Stats fetch failed");
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => console.log(err));
  }, [user]);

  // ================= FETCH TASKS =================
useEffect(() => {
  if (!user?._id) return;

  fetch(`http://localhost:8000/tasks/${user._id}`)
    .then(res => {
      if (!res.ok) throw new Error("Tasks API not found");
      return res.json();
    })
    .then(data => setTasks(data))
    .catch(err => console.log("Tasks error:", err));

}, [user]);
  // ================= FETCH SUBMISSIONS =================
  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:8000/submissions/${user._id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Submissions API not found");
        return res.json();
      })
      .then(data => setSubmissions(data))
      .catch(err => {
        console.log("Submission error:", err);
        setSubmissions([]);
      });
  }, [user]);

  // ================= SUBMIT =================
  const handleSubmit = async (taskId) => {
    const proof = proofs[taskId];

    if (!proof) {
      Swal.fire("Error", "Enter proof link", "error");
      return;
    }

    if (!user?._id) {
      Swal.fire("Error", "User not loaded", "error");
      return;
    }

    setLoadingTaskId(taskId);

    try {
      const res = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          taskId,
          proof
        })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Submitted 🎉", data.message, "success");

        // refresh submissions
        fetch(`http://localhost:8000/submissions/${user._id}`)
          .then(res => res.json())
          .then(data => setSubmissions(data));

        // refresh stats
        fetch(`http://localhost:8000/user/stats/${user._id}`)
          .then(res => res.json())
          .then(data => setStats(data));
      } else {
        Swal.fire("Error", data.message, "error");
      }

    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Server error", "error");
    }

    setLoadingTaskId(null);
  };

  // ================= SAFE FILTER =================
  const submittedIds = submissions
    .filter(s => s?.taskId?._id)
    .map(s => s.taskId._id);

  const availableTasks = tasks.filter(
    t => t?._id && !submittedIds.includes(t._id)
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold">CampusPulse</h1>
        </div>

        <nav className="px-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20}/>}
            label="Dashboard"
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          />

          <NavItem
            icon={<ClipboardList size={20}/>}
            label="Tasks"
            active={view === "tasks"}
            onClick={() => setView("tasks")}
          />

          <NavItem
            icon={<Trophy size={20}/>}
            label="Leaderboard"
            onClick={() => navigate("/leaderboard")}
          />

          {/* <NavItem icon={<User size={20}/>} label="Profile" /> */}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <section className="bg-gradient-to-r from-[#1a1a4d] to-[#3b3b8f] text-white p-6 rounded-xl mb-6">
              <h3 className="text-2xl">Welcome, {user?.name}</h3>
              <p className="mt-2">Points: {stats.points || 0}</p>
            </section>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl mb-4">Your Tasks</h3>

              {availableTasks.length === 0 ? (
                <p>No tasks available</p>
              ) : (
                availableTasks.map(task => (
                  <div key={task._id} className="border-b py-4">

                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">
                          {task.points} points
                        </p>

                        <p className="text-red-500 text-sm font-semibold">
                          Deadline: {task.deadline}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSubmit(task._id)}
                        disabled={loadingTaskId === task._id}
                        className="bg-indigo-600 text-white px-3 py-1 rounded"
                      >
                        {loadingTaskId === task._id
                          ? "Submitting..."
                          : "Submit"}
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Paste proof link..."
                      className="w-full mt-2 p-2 border rounded"
                      value={proofs[task._id] || ""}
                      onChange={(e) =>
                        setProofs({
                          ...proofs,
                          [task._id]: e.target.value
                        })
                      }
                    />

                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* TASK STATUS */}
        {view === "tasks" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl mb-4">My Submissions</h3>

            {submissions.length === 0 ? (
              <p>No submissions yet</p>
            ) : (
              submissions.map(s => {
                if (!s?.taskId) return null;

                const deadlinePassed =
                  new Date(s.taskId.deadline) < new Date();

                return (
                  <div key={s._id} className="border-b py-3">

                    <p className="font-medium">
                      {s.taskId.title}
                    </p>

                    <p className="text-sm mt-1">
                      Status:{" "}

                      {s.status === "approved" && (
                        <span className="text-green-600 font-semibold">
                          Approved ✅
                        </span>
                      )}

                      {s.status === "pending" && !deadlinePassed && (
                        <span className="text-yellow-600 font-semibold">
                          Pending ⏳
                        </span>
                      )}

                      {deadlinePassed && s.status !== "approved" && (
                        <span className="text-red-600 font-semibold">
                          Deadline Missed ❌
                        </span>
                      )}
                    </p>

                    <a
                      href={s.proof}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View Proof
                    </a>

                  </div>
                );
              })
            )}
          </div>
        )}

      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 p-3 rounded cursor-pointer ${
      active ? "bg-indigo-100" : "hover:bg-gray-100"
    }`}
  >
    {icon}
    {label}
  </div>
);

export default AmbassadorDash;