import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  UserCircle,
  Shield,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Briefcase,
  Search,
  ClipboardList,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const recruiterLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/company-profile", icon: UserCircle, label: "Company Profile" },
    { to: "/Post-Job", icon: Briefcase, label: "Post Jobs" },
    { to: "/applicants", icon: Users, label: "View Applicants" },
    { to: "/profile", icon: UserCircle, label: "Profile" },
  ];

  const jobSeekerLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/browse-jobs", icon: Search, label: "Browse Jobs" },
    { to: "/applied-jobs", icon: ClipboardList, label: "Applied Jobs" },
    { to: "/profile", icon: UserCircle, label: "Profile" },
  ];

  const links =
    user?.role === "recruiter"
      ? recruiterLinks
      : jobSeekerLinks;

  return (
    <aside className="w-[290px] bg-[#0B1120] border-r border-slate-800 flex flex-col justify-between">

      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            {user?.role === "recruiter"
              ? "Recruiter Portal"
              : "Job Seeker Portal"}
          </h1>
        </div>

        {/* Menu */}
        <nav className="px-4 space-y-3">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-700/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span className="flex-1">{label}</span>

              <ChevronRight size={18} />
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-amber-500 text-white"
                    : "text-amber-400 hover:bg-slate-800"
                }`
              }
            >
              <ShieldCheck size={20} />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="p-5">

        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-white font-semibold">
                {user?.name}
              </h3>

              <p className="text-slate-400 text-sm capitalize">
                {user?.role}
              </p>
            </div>

          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border border-red-500 py-3 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
}