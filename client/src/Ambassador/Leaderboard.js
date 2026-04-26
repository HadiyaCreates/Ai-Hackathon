import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/leaderboard")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Leaderboard</h1>
          <p className="text-slate-500 mt-1">
            Top performing ambassadors ranked by points
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <table className="w-full text-left">

            <thead className="bg-slate-50 border-b">
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Points</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b last:border-0 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    #{index + 1}
                  </td>

                  <td className="px-6 py-4 text-slate-800">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-indigo-600">
                    {user.points || 0}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {users.length === 0 && (
            <div className="p-6 text-center text-slate-500">
              No users yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;