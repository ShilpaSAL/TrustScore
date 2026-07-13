import { Bell, Search, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-700 px-8 py-6">

      {/* Left */}
      <div>

        <h1 className="text-4xl font-bold text-white">
          Recruiter Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back, {user?.name || "Recruiter"} 👋
        </p>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* Search */}
        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search jobs or applicants..."
            className="w-72 md:w-80 bg-[#111827] border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
          />

        </div>

        {/* Notification */}
        <button className="relative w-12 h-12 rounded-xl bg-[#111827] border border-slate-700 flex items-center justify-center hover:border-indigo-500 hover:bg-slate-800 transition">

          <Bell
            size={20}
            className="text-slate-300"
          />

          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>

        </button>

        {/* User */}
        <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 rounded-xl px-4 py-2">

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center">

            <UserCircle
              size={24}
              className="text-white"
            />

          </div>

          <div>

            <p className="text-sm font-semibold text-white">
              {user?.name || "Recruiter"}
            </p>

            <p className="text-xs text-slate-400">
              Recruiter
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}