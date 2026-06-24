import { useEffect, useState } from "react";
import api from "../api/axios";

export function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [preds, setPreds] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then(r => setStats(r.data)).catch(() => {});
    api.get("/admin/users").then(r => setUsers(r.data)).catch(() => {});
    api.get("/admin/predictions").then(r => setPreds(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-xs">Total Users</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-xs">Total Predictions</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalPredictions}</p>
          </div>
          {stats.labelCounts.map(l => (
            <div key={l._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-xs">{l._id}</p>
              <p className="text-3xl font-bold text-white mt-1">{l.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Users Table */}
      <h2 className="text-sm font-semibold text-slate-400 mb-3">
        Registered Users ({users.length})
      </h2>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
            <tr>
              {["Name", "Email", "Role", "Joined"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">No users found.</td></tr>
            ) : users.map(u => (
              <tr key={u._id} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 text-slate-200">{u.name}</td>
                <td className="px-4 py-3 text-slate-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-amber-900/50 text-amber-300" : "bg-indigo-900/50 text-indigo-300"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Predictions Table */}
      <h2 className="text-sm font-semibold text-slate-400 mb-3">
        All Predictions ({preds.length})
      </h2>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
            <tr>
              {["User", "Trust Label", "Confidence", "Date"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preds.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">No predictions yet.</td></tr>
            ) : preds.map(p => (
              <tr key={p._id} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 text-slate-200">{p.recruiterId?.name || "N/A"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p.trust_label === "High Trust"   ? "bg-emerald-900/50 text-emerald-300" :
                    p.trust_label === "Medium Trust" ? "bg-amber-900/50 text-amber-300" :
                    "bg-red-900/50 text-red-300"
                  }`}>
                    {p.trust_label}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 font-semibold">{p.confidence_score}%</td>
                <td className="px-4 py-3 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;