import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  UserCircle,
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

    { to: "/Post-Job", icon: Briefcase, label: "Job Posters" },

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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-4 shrink-0">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-white">
          {user?.role === "recruiter"
            ? "Recruiter Portal"
            : "Job Seeker Portal"}
        </h2>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            <Icon size={18} />
            {label}
            <ChevronRight
              size={14}
              className="ml-auto opacity-40"
            />
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive
                ? "bg-amber-600 text-white"
                : "text-amber-400 hover:bg-slate-800"
              }`
            }
          >
            <ShieldCheck size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="border-t border-slate-800 pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200">
              {user?.name}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/30"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}