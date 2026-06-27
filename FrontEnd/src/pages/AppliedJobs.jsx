import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const { data } = await api.get("/application/my");
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        Applied Jobs
      </h1>

      {applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
          <h2 className="text-xl text-white mb-2">
            No Applied Jobs
          </h2>

          <p className="text-slate-400">
            You haven't applied for any jobs yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-slate-900 border border-slate-700 rounded-xl p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {application.jobId?.jobTitle}
                  </h2>

                  <p className="text-indigo-400">
                    {application.jobId?.companyName}
                  </p>

                  <p className="text-slate-400 mt-1">
                    📍 {application.jobId?.location}
                  </p>

                  <p className="text-green-400 mt-2">
                    {application.jobId?.salary}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-white text-sm ${
                    application.status === "Accepted"
                      ? "bg-green-600"
                      : application.status === "Rejected"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {application.status}
                </span>
              </div>

              <div className="mt-5 border-t border-slate-700 pt-4 text-sm text-slate-400">
                Applied On :{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}