import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [msg, setMsg]   = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/me", form);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("Update failed.");
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-700 flex items-center justify-center text-xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-100">{user?.name}</p>
            <p className="text-sm text-indigo-400 capitalize">{user?.role}</p>
          </div>
        </div>

        {msg && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${msg.includes("failed") ? "bg-red-900/40 text-red-300" : "bg-emerald-900/40 text-emerald-300"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Name</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;