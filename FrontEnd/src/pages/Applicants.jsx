import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Applicants() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const { data } = await api.get("/application/recruiter");
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/application/${id}`, {
        status,
      });

      fetchApplicants();
    } catch (error) {
      console.error(error);
      alert("Failed to update application.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        View Applicants
      </h1>

      {applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
          <h2 className="text-2xl text-white">
            No Applicants Yet
          </h2>

          <p className="text-slate-400 mt-2">
            Applicants will appear here when someone applies for your jobs.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-slate-900 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex justify-between">

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {application.jobId?.jobTitle}
                  </h2>

                  <p className="text-indigo-400">
                    {application.jobId?.companyName}
                  </p>

                  <p className="text-slate-400 mt-2">
                    📍 {application.jobId?.location}
                  </p>

                  <p className="text-green-400 mt-2">
                    {application.jobId?.salary}
                  </p>

                  <div className="mt-5">
                    <p className="text-white font-semibold">
                      Applicant
                    </p>

                    <p className="text-slate-300">
                      {application.applicantId?.name}
                    </p>

                    <p className="text-slate-400">
                      {application.applicantId?.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-4 py-2 rounded-full text-white ${
                      application.status === "Accepted"
                        ? "bg-green-600"
                        : application.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {application.status}
                  </span>

                  {application.status === "Pending" && (
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() =>
                          updateStatus(application._id, "Accepted")
                        }
                        className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(application._id, "Rejected")
                        }
                        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}