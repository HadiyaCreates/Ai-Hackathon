import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, CheckSquare, Users, Send, Bell
} from 'lucide-react';
import Swal from "sweetalert2";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {

  const [view, setView] = useState("dashboard");

  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);

  const [chartData, setChartData] = useState([]);

  const [title, setTitle] = useState("");
  const [points, setPoints] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // ================= FIXED TASK FETCH =================
  const fetchTasks = async () => {
    try {
      const usersRes = await fetch("http://localhost:8000/users");
      const usersData = await usersRes.json();

      let allTasks = [];

      for (let user of usersData) {
        const res = await fetch(`http://localhost:8000/tasks/${user._id}`);
        const data = await res.json();
        allTasks = [...allTasks, ...data];
      }

      // remove duplicates
      const unique = Array.from(
        new Map(allTasks.map(t => [t._id, t])).values()
      );

      setTasks(unique);

    } catch (err) {
      console.log("Tasks fetch error:", err);
    }
  };

  const fetchSubmissions = async () => {
    const res = await fetch("http://localhost:8000/admin/submissions");
    const data = await res.json();
    setSubmissions(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:8000/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchSubmissions();
    fetchUsers();
  }, []);

  // ================= CHART =================
  useEffect(() => {
    const last7 = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const subCount = submissions.filter(s =>
        new Date(s.createdAt).toDateString() === day.toDateString()
      ).length;

      const taskCount = tasks.filter(t =>
        new Date(t.createdAt).toDateString() === day.toDateString()
      ).length;

      last7.push({
        name: day.toLocaleDateString(),
        submissions: subCount,
        tasks: taskCount
      });
    }

    setChartData(last7);
  }, [tasks, submissions]);

  // ================= CREATE =================
  const handleCreateTask = async () => {
    if (!title || !points || selectedUsers.length === 0) {
      Swal.fire("Error", "Fill all fields", "error");
      return;
    }

    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        points,
        deadline,
        assignedTo: selectedUsers
      })
    });

    Swal.fire("Success", "Task Created", "success");

    setTitle("");
    setDescription("");
    setPoints(1);
    setDeadline("");
    setSelectedUsers([]);

    fetchTasks();
  };

  const approveSubmission = async (id) => {
    await fetch(`http://localhost:8000/approve/${id}`, { method: "PATCH" });
    fetchSubmissions();
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE"
    });
    fetchUsers();
  };

  const pendingCount = submissions.filter(s => s.status === "pending").length;

  // ================= ACTIVITY =================
  const activity = [
    ...submissions.slice(0, 5).map(s => ({
      text: `${s.userId?.name} submitted "${s.taskId?.title}"`,
      time: new Date(s.createdAt).toLocaleTimeString()
    })),
    ...tasks.slice(0, 3).map(t => ({
      text: `New task "${t.title}" created`,
      time: new Date(t.createdAt).toLocaleTimeString()
    }))
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white hidden md:flex flex-col">
        <div className="p-6 font-bold text-lg">Admin</div>

        <nav className="px-4 space-y-2">
          <NavItem label="Dashboard" icon={<LayoutDashboard size={18}/>} onClick={()=>setView("dashboard")} />
          <NavItem label="Tasks" icon={<CheckSquare size={18}/>} onClick={()=>setView("tasks")} />
          <NavItem label="Users" icon={<Users size={18}/>} onClick={()=>setView("users")} />
          <NavItem label="Submissions" icon={<Send size={18}/>} badge={pendingCount} onClick={()=>setView("submissions")} />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1">

        <header className="bg-white p-4 flex justify-between border-b">
          <h2 className="capitalize font-semibold">{view}</h2>
          <Bell />
        </header>

        <div className="p-6">

          {/* DASHBOARD */}
          {view === "dashboard" && (
            <>
              {/* ACTIONS */}
              <div className="flex gap-4 mb-6">
                <button onClick={()=>setView("tasks")} className="bg-green-500 text-white px-4 py-2 rounded">+ Create Task</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Broadcast</button>
                <button onClick={()=>setView("submissions")} className="bg-yellow-400 px-4 py-2 rounded">
                  Review {pendingCount}
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard title="Tasks" value={tasks.length} />
                <StatCard title="Users" value={users.length} />
                <StatCard title="Pending" value={pendingCount} />
                <StatCard title="Submissions" value={submissions.length} />
              </div>

              {/* FEED + GRAPH */}
              <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white p-4 rounded shadow h-72 overflow-y-auto">
                  <h3 className="font-semibold mb-3">Activity Feed</h3>
                  {activity.map((a, i) => (
                    <div key={i} className="border-b py-2 text-sm">
                      <p>{a.text}</p>
                      <span className="text-gray-400 text-xs">{a.time}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-4 rounded shadow h-72">
                  <h3 className="font-semibold mb-3">Last 7 Days</h3>

                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="submissions" strokeWidth={2} />
                      <Line type="monotone" dataKey="tasks" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>

                </div>
              </div>
            </>
          )}

          {/* TASKS */}
          {view === "tasks" && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Create Task</h3>

              <input className="border p-2 w-full mb-2" placeholder="Title"
                value={title} onChange={(e)=>setTitle(e.target.value)} />

              <textarea className="border p-2 w-full mb-2" placeholder="Description"
                value={description} onChange={(e)=>setDescription(e.target.value)} />

              <input type="number" className="border p-2 w-full mb-2"
                value={points} onChange={(e)=>setPoints(e.target.value)} />

              <input type="date" className="border p-2 w-full mb-2"
                value={deadline} onChange={(e)=>setDeadline(e.target.value)} />

              <div className="mb-3">
                <p className="text-sm mb-1">Assign Users</p>
                {users.map(u => (
                  <label key={u._id} className="block text-sm">
                    <input type="checkbox"
                      onChange={(e)=>{
                        if (e.target.checked)
                          setSelectedUsers([...selectedUsers, u._id]);
                        else
                          setSelectedUsers(selectedUsers.filter(id=>id!==u._id));
                      }}
                    /> {u.name}
                  </label>
                ))}
              </div>

              <button onClick={handleCreateTask}
                className="bg-green-600 text-white px-4 py-2 rounded">
                Create Task
              </button>

              <h3 className="mt-6 font-semibold">All Tasks</h3>
              {tasks.map(t => (
                <div key={t._id} className="border-b py-2">
                  <p>{t.title}</p>
                  <p className="text-sm text-gray-500">{t.points} pts</p>
                </div>
              ))}
            </div>
          )}

          {/* USERS */}
          {view === "users" && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Users</h3>

              {users.map(u => (
                <div key={u._id} className="flex justify-between border-b py-2">
                  <div>
                    <p>{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>

                  <button onClick={()=>deleteUser(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUBMISSIONS */}
          {view === "submissions" && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Submissions</h3>

              {submissions.map(s => (
                <div key={s._id} className="border-b py-3">
                  <p className="font-semibold">{s.userId?.name}</p>
                  <p className="text-sm text-gray-500">{s.taskId?.title}</p>

                  <a href={s.proof} target="_blank"
                    className="text-blue-600 text-sm underline">
                    View
                  </a>

                  <p className="text-sm">{s.status}</p>

                  {s.status === "pending" && (
                    <button onClick={()=>approveSubmission(s._id)}
                      className="bg-green-500 text-white px-3 py-1 mt-2 rounded">
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

const NavItem = ({ label, icon, onClick, badge }) => (
  <div onClick={onClick}
    className="flex justify-between p-3 cursor-pointer hover:bg-slate-800 rounded">
    <div className="flex gap-2">{icon} {label}</div>
    {badge && <span className="bg-yellow-500 text-xs px-2 rounded">{badge}</span>}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;