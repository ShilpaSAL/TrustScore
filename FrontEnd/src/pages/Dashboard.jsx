import { useEffect, useMemo, useState } from "react";
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


// ============================================================
// Dashboard Statistics Card
// ============================================================

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-3xl p-6 flex items-center gap-5 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon
          size={26}
          className="text-white"
        />
      </div>

      <div>
        <p className="text-sm text-slate-400 font-medium">
          {label}
        </p>

        <p className="text-3xl font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}


// ============================================================
// Main Dashboard
// ============================================================

export default function Dashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] =
    useState([]);

  const [selectedJob, setSelectedJob] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  // ==========================================================
  // Load Job Seeker Dashboard Data
  // ==========================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    // Recruiter dashboard loads its own data
    if (user.role !== "jobseeker") {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          jobsResponse,
          applicationsResponse,
        ] = await Promise.all([
          api.get("/job/all"),
          api.get("/application/my"),
        ]);

        setJobs(
          Array.isArray(jobsResponse.data)
            ? jobsResponse.data
            : []
        );

        setApplications(
          Array.isArray(
            applicationsResponse.data
          )
            ? applicationsResponse.data
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error.response?.data ||
            error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);


  // ==========================================================
  // Search Jobs
  // ==========================================================

  const filteredJobs = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return jobs;
    }

    return jobs.filter((job) => {
      return [
        job.jobTitle,
        job.companyName,
        job.location,
        job.skills,
        job.jobType,
        job.qualification,
      ].some((value) =>
        value
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [jobs, searchTerm]);


  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white text-xl">
        Loading dashboard...
      </div>
    );
  }


  // ==========================================================
  // Recruiter Dashboard
  // ==========================================================

  if (user?.role === "recruiter") {
    return <RecruiterDashboard />;
  }


  // ==========================================================
  // Job Seeker Dashboard
  // ==========================================================

  return (
    <div>
      {/* Welcome Banner */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-12 mb-10 shadow-2xl">

        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

        <div className="relative flex justify-between items-center flex-wrap gap-6">

          <div>
            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
              Welcome back, {user?.name} 👋
            </h1>

            <p className="text-xl leading-relaxed text-white/80 mt-3">
              Explore available job opportunities
              and review recruiter credibility
              information before applying.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-semibold">
            <ShieldCheck size={20} />

            <span>
              Recruiter Credibility Portal
            </span>
          </div>

        </div>
      </div>


      {/* Statistics */}

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
          value={applications.length}
          color="bg-emerald-600"
        />

        <StatCard
          icon={TrendingUp}
          label="Accepted Applications"
          value={
            applications.filter(
              (application) =>
                application.status ===
                "Accepted"
            ).length
          }
          color="bg-amber-600"
        />

        <StatCard
          icon={BrainCircuit}
          label="Pending Applications"
          value={
            applications.filter(
              (application) =>
                application.status ===
                "Pending"
            ).length
          }
          color="bg-violet-600"
        />

      </div>


      {/* Search */}

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by job title, company, location, skills, or job type..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full bg-[#111827] border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
        />
      </div>


      {/* Latest Jobs Header */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-white">
            Latest Job Posts
          </h2>

          <p className="text-slate-400 mt-1">
            Browse available jobs and review
            recruiter information before applying.
          </p>
        </div>
      </div>


      {/* Job List */}

      {filteredJobs.length === 0 ? (
        <div className="bg-[#111827] border border-slate-700 rounded-3xl p-12 text-center">

          <h3 className="text-2xl font-bold text-white">
            {jobs.length === 0
              ? "No Jobs Available"
              : "No Matching Jobs Found"}
          </h3>

          <p className="text-slate-400 mt-2">
            {jobs.length === 0
              ? "Please check back later for new opportunities."
              : "Try searching with different keywords."}
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onView={setSelectedJob}
            />
          ))}
        </div>
      )}


      {/* Job Details Modal */}

      <JobDetailsModal
        job={selectedJob}
        isOpen={selectedJob !== null}
        onClose={() =>
          setSelectedJob(null)
        }
      />
    </div>
  );
}