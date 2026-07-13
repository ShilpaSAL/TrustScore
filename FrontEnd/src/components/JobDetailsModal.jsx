import { useState } from "react";
import api from "../api/axios";

import {
  X,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

export default function JobDetailsModal({
  job,
  isOpen,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !job) {
    return null;
  }

  // ==========================================================
  // Real Recruiter Credibility Information
  // ==========================================================

  const trustLabel =
    job.trustLabel || "Not Assessed";

  const confidenceScore =
    job.confidenceScore;

  const profileCompletion =
    job.profileCompletion ?? 0;

  // Stored as 0–1 in MongoDB
  const approvalRate = Math.round(
    (job.approval_rate ?? 0) * 100
  );

  const complaintsCount =
    job.complaints_count ?? 0;

  const responseTime =
    job.response_time_hours;

  const getTrustStyle = () => {
    switch (trustLabel) {
      case "High Trust":
        return "bg-green-600/20 border-green-500 text-green-400";

      case "Medium Trust":
        return "bg-yellow-500/20 border-yellow-500 text-yellow-400";

      case "Low Trust":
        return "bg-red-600/20 border-red-500 text-red-400";

      default:
        return "bg-slate-700 border-slate-600 text-slate-400";
    }
  };

  // ==========================================================
  // Apply for Job
  // ==========================================================

  const applyJob = async () => {
    try {
      setLoading(true);

      const { data } = await api.post(
        `/application/apply/${job._id}`
      );

      alert(data.message);

      onClose();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to apply for this job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">

        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b border-slate-700">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
              {job.companyName
                ? job.companyName
                    .charAt(0)
                    .toUpperCase()
                : "C"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                {job.jobTitle}
              </h2>

              <p className="text-indigo-400">
                {job.companyName ||
                  "Company Not Available"}
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={30} />
          </button>

        </div>


        {/* Body */}

        <div className="p-6 space-y-6">

          {/* Basic Job Details */}

          <div className="grid md:grid-cols-2 gap-4">

            <Detail
              icon={MapPin}
              value={
                job.location ||
                "Location Not Specified"
              }
            />

            <Detail
              icon={IndianRupee}
              value={
                job.salary ||
                "Salary Not Disclosed"
              }
            />

            <Detail
              icon={Briefcase}
              value={
                job.experience ||
                "Experience Not Specified"
              }
            />

            <Detail
              icon={GraduationCap}
              value={
                job.qualification ||
                "Qualification Not Specified"
              }
            />

            <Detail
              icon={Building2}
              value={
                job.jobType ||
                "Job Type Not Specified"
              }
            />

            <Detail
              icon={Briefcase}
              value={`Vacancies: ${
                job.vacancies || "N/A"
              }`}
            />

          </div>


          {/* Skills */}

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Skills Required
            </h3>

            {job.skills ? (
              <div className="flex flex-wrap gap-2">
                {job.skills
                  .split(",")
                  .filter(
                    (skill) =>
                      skill.trim() !== ""
                  )
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-700 px-3 py-1 rounded-full text-white text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            ) : (
              <p className="text-slate-400">
                No skills specified.
              </p>
            )}
          </div>


          {/* Job Description */}

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Job Description
            </h3>

            <p className="text-slate-300 leading-7 whitespace-pre-line">
              {job.jobDescription ||
                "No description available."}
            </p>
          </div>


          {/* Recruiter Credibility */}

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">

            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck
                size={25}
                className="text-indigo-400"
              />

              <div>
                <h3 className="text-xl font-bold text-white">
                  Recruiter Credibility Assessment
                </h3>

                <p className="text-sm text-slate-400">
                  Machine learning-based recruiter
                  behavioural evaluation
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Trust Prediction */}

              <div
                className={`border rounded-2xl p-6 text-center ${getTrustStyle()}`}
              >
                <p className="text-sm mb-2">
                  Predicted Trust Level
                </p>

                <h2 className="text-3xl font-bold">
                  {trustLabel}
                </h2>

                {confidenceScore !== undefined &&
                  confidenceScore !== null && (
                    <p className="mt-3">
                      Prediction Confidence:{" "}
                      <strong>
                        {Math.round(
                          confidenceScore
                        )}
                        %
                      </strong>
                    </p>
                  )}
              </div>


              {/* Real Behavioural Metrics */}

              <div className="space-y-3 text-slate-300">

                <p>
                  <strong className="text-white">
                    Profile Completion:
                  </strong>{" "}
                  {profileCompletion}%
                </p>

                <p>
                  <strong className="text-white">
                    Approval Rate:
                  </strong>{" "}
                  {approvalRate}%
                </p>

                <p>
                  <strong className="text-white">
                    Average Response Time:
                  </strong>{" "}
                  {responseTime !== undefined &&
                  responseTime !== null
                    ? `${responseTime} hours`
                    : "Not Available"}
                </p>

                <p>
                  <strong className="text-white">
                    Complaints:
                  </strong>{" "}
                  {complaintsCount}
                </p>

              </div>
            </div>
          </div>


          {/* Apply Button */}

          <div className="flex justify-end">
            <button
              onClick={applyJob}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl text-white font-semibold"
            >
              {loading
                ? "Applying..."
                : "Apply Now"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}


// ============================================================
// Reusable Detail Component
// ============================================================

function Detail({
  icon: Icon,
  value,
}) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <Icon size={18} />
      <span>{value}</span>
    </div>
  );
}