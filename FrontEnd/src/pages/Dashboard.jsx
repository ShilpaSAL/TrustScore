import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import JobDetailsModal from "../components/JobDetailsModal";
import RecruiterDashboard from "../components/recruiter/RecruiterDashboard";
import {
  BrainCircuit,
  ClipboardList,
  TrendingUp,
  Award,
  ShieldCheck,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color }

) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-3xl p-6 flex items-center gap-5 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={26} className="text-white" />      </div>

      <div>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role === "jobseeker") {
      api
        .get("/job/all")
        .then((res) => setJobs(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      Promise.all([
        api.get("/company"),
        api.get("/job"),
        api.get("/application/recruiter"),
      ])
        .then(([companyRes, jobsRes, appRes]) => {
          setCompany(companyRes.data);
          setJobs(jobsRes.data);
          setApplications(appRes.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // JOB SEEKER DASHBOARD
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading...
      </div>
    );
  }

  if (user?.role === "jobseeker") {
    return (
      <div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-12 mb-10 shadow-2xl">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative flex justify-between items-center flex-wrap gap-6">
            <div>

              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
                Welcome back, {user?.name} 👋
              </h1>

              <p className="text-xl leading-relaxed text-white/80 mt-3">
                Here are the latest job postings from verified recruiters.
              </p>

            </div>

            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-semibold">
              <ShieldCheck size={20} />
              <span>Trust Verified Portal</span>
            </div>

          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <StatCard
            icon={ClipboardList}
            label="Available Jobs"
            value={jobs.length}
            color="bg-indigo-600"
          />

          <StatCard
            icon={Award}
            label="Applied Jobs"
            value="0"
            color="bg-emerald-600"
          />

          <StatCard
            icon={TrendingUp}
            label="Profile Views"
            value="0"
            color="bg-amber-600"
          />

          <StatCard
            icon={BrainCircuit}
            label="Low Trust Alerts"
            value="0"
            color="bg-red-600"
          />

        </div>
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full bg-[#111827] border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Latest Job Posts
            </h2>

            <p className="text-slate-400 mt-1">
              Browse jobs from verified recruiters.
            </p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-[#111827] border border-slate-700 rounded-3xl p-12 text-center">

            <h3 className="text-2xl font-bold text-white">
              No Jobs Available
            </h3>

            <p className="text-slate-400 mt-2">
              Please check back later for new opportunities.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onView={setSelectedJob}
              />
            ))}
          </div>
        )}

        <JobDetailsModal
          job={selectedJob}
          isOpen={selectedJob !== null}
          onClose={() => setSelectedJob(null)}
        />
      </div>
    );
  }

  // RECRUITER DASHBOARD
  return <RecruiterDashboard />;
}