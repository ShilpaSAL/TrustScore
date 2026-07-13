import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  MapPin,
  CalendarDays,
  Briefcase,
} from "lucide-react";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        "/application/my"
      );

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Applied jobs error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load applied jobs."
      );
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white text-lg">
          Loading applied jobs...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Applied Jobs
        </h1>

        <p className="text-slate-400 mt-2">
          Track your job applications and
          their current status.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-[#111827] border border-slate-700 rounded-3xl p-12 text-center">

          <Briefcase
            size={45}
            className="mx-auto text-slate-500 mb-4"
          />

          <h2 className="text-2xl font-bold text-white">
            No Applied Jobs
          </h2>

          <p className="text-slate-400 mt-2">
            You have not applied for any
            jobs yet.
          </p>

        </div>
      ) : (
        <div className="grid gap-5">

          {applications.map(
            (application) => {
              const job =
                application.jobId;

              return (
                <div
                  key={application._id}
                  className="bg-[#111827] border border-slate-700 hover:border-indigo-500 rounded-3xl p-6 transition-all duration-300"
                >

                  <div className="flex justify-between items-start flex-wrap gap-5">

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {job?.jobTitle ||
                          "Job No Longer Available"}
                      </h2>

                      {job && (
                        <>
                          <p className="text-indigo-400 font-medium mt-1">
                            {job.companyName ||
                              "Company Not Available"}
                          </p>

                          <div className="flex items-center gap-2 text-slate-400 mt-3">
                            <MapPin
                              size={17}
                            />

                            <span>
                              {job.location ||
                                "Location Not Specified"}
                            </span>
                          </div>

                          <p className="text-green-400 font-semibold mt-3">
                            {job.salary ||
                              "Salary Not Disclosed"}
                          </p>
                        </>
                      )}
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>

                  </div>

                  <div className="mt-6 border-t border-slate-700 pt-4 flex items-center gap-2 text-sm text-slate-400">

                    <CalendarDays
                      size={16}
                    />

                    <span>
                      Applied On:{" "}
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "Date Not Available"}
                    </span>

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