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
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>

      <div>
        <p className="text-slate-400 text-xs font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
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

  useEffect(() => {
    if (user?.role === "jobseeker") {
      api
        .get("/job/all")
        .then((res) => setJobs(res.data))
        .catch((err) => console.log(err));
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
        .catch((err) => console.log(err));
    }
  }, [user]);

  // JOB SEEKER DASHBOARD
  if (user?.role === "jobseeker") {
    return (
      <div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 p-10 mb-8 shadow-xl">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative flex justify-between items-center">

            <div>

              <h1 className="text-5xl font-bold text-white">
                Welcome back, {user?.name} 👋
              </h1>

              <p className="text-lg text-white/80 mt-3">
                Here are the latest job postings from verified recruiters.
              </p>

            </div>

            <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/20">
              🛡 Trust-Verified Portal
            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        <h2 className="text-2xl font-bold text-white mb-5">
          Latest Job Posts
        </h2>

        <div className="grid gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onView={setSelectedJob}
            />
          ))}
        </div>

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