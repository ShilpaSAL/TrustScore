import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  User,
  Mail,
  MapPin,
  Briefcase,
  CalendarDays,
} from "lucide-react";

export default function Applicants() {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchApplicants();
  }, []);

  // ==========================================================
  // Fetch Recruiter's Applicants
  // ==========================================================

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        "/application/recruiter"
      );

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Fetch applicants error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load applicants."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Accept / Reject Application
  // ==========================================================

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      setUpdatingId(id);

      const { data } = await api.put(
        `/application/${id}`,
        {
          status,
        }
      );

      // Update directly in the UI
      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id === id
                ? {
                    ...application,
                    status:
                      data.status ||
                      status,
                    respondedAt:
                      data.respondedAt ||
                      new Date().toISOString(),
                  }
                : application
          )
      );

      alert(
        `Application ${status.toLowerCase()} successfully.`
      );
    } catch (error) {
      console.error(
        "Update application error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update application."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================================
  // Status Style
  // ==========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-600/20 text-green-400 border border-green-500/40";

      case "Rejected":
        return "bg-red-600/20 text-red-400 border border-red-500/40";

      default:
        return "bg-yellow-600/20 text-yellow-400 border border-yellow-500/40";
    }
  };

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white text-lg">
          Loading applicants...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          View Applicants
        </h1>

        <p className="text-slate-400 mt-2">
          Review applicants and manage their
          application status.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* No Applicants */}

      {applications.length === 0 ? (
        <div className="bg-[#111827] border border-slate-700 rounded-3xl p-12 text-center">

          <User
            size={45}
            className="mx-auto text-slate-500 mb-4"
          />

          <h2 className="text-2xl font-bold text-white">
            No Applicants Yet
          </h2>

          <p className="text-slate-400 mt-2">
            Applicants will appear here when
            job seekers apply for your jobs.
          </p>

        </div>
      ) : (
        <div className="grid gap-5">

          {applications.map(
            (application) => {
              const job =
                application.jobId;

              const applicant =
                application.applicantId;

              return (
                <div
                  key={application._id}
                  className="bg-[#111827] border border-slate-700 hover:border-indigo-500 rounded-3xl p-6 transition-all duration-300"
                >

                  <div className="flex justify-between items-start flex-wrap gap-6">

                    {/* Job and Applicant Details */}

                    <div className="flex-1">

                      <h2 className="text-2xl font-bold text-white">
                        {job?.jobTitle ||
                          "Job Not Available"}
                      </h2>

                      <p className="text-indigo-400 font-medium mt-1">
                        {job?.companyName ||
                          "Company Not Available"}
                      </p>

                      <div className="flex flex-wrap gap-5 mt-4 text-slate-400">

                        <div className="flex items-center gap-2">
                          <MapPin size={17} />

                          <span>
                            {job?.location ||
                              "Not Specified"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Briefcase size={17} />

                          <span>
                            {job?.jobType ||
                              "Not Specified"}
                          </span>
                        </div>

                      </div>

                      {/* Applicant Information */}

                      <div className="mt-6 bg-slate-800 border border-slate-700 rounded-2xl p-5">

                        <p className="text-sm text-slate-400 mb-4">
                          Applicant Information
                        </p>

                        <div className="space-y-3">

                          <div className="flex items-center gap-3 text-white">
                            <User
                              size={18}
                              className="text-indigo-400"
                            />

                            <span>
                              {applicant?.name ||
                                "Name Not Available"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-slate-300">
                            <Mail
                              size={18}
                              className="text-indigo-400"
                            />

                            <span>
                              {applicant?.email ||
                                "Email Not Available"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-slate-400">
                            <CalendarDays
                              size={18}
                            />

                            <span>
                              Applied:{" "}
                              {application.createdAt
                                ? new Date(
                                    application.createdAt
                                  ).toLocaleDateString()
                                : "Date Not Available"}
                            </span>
                          </div>

                        </div>
                      </div>

                    </div>


                    {/* Application Status */}

                    <div className="flex flex-col items-end gap-5">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                      {application.status ===
                        "Pending" && (
                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              updateStatus(
                                application._id,
                                "Accepted"
                              )
                            }
                            disabled={
                              updatingId ===
                              application._id
                            }
                            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 px-5 py-2 rounded-xl text-white font-semibold"
                          >
                            {updatingId ===
                            application._id
                              ? "Updating..."
                              : "Accept"}
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(
                                application._id,
                                "Rejected"
                              )
                            }
                            disabled={
                              updatingId ===
                              application._id
                            }
                            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 px-5 py-2 rounded-xl text-white font-semibold"
                          >
                            Reject
                          </button>

                        </div>
                      )}

                    </div>

                  </div>
                </div>
              );
            }
          )}

        </div>
      )}
    </div>
  );
}