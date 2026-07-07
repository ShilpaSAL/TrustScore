import {
  User,
  Briefcase,
  Eye,
} from "lucide-react";

export default function RecentApplicants({ applications }) {
  return (
    <div className="bg-[#111827] rounded-3xl border border-slate-700 shadow-xl p-8 mt-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-3xl font-bold text-white">
            Recent Applicants
          </h2>

          <p className="text-slate-400 mt-1">
            Latest candidates who applied for your job postings.
          </p>
        </div>

        <button className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
          View All
        </button>

      </div>

      {/* Empty State */}
      {applications.length === 0 ? (

        <div className="text-center py-14">

          <User
            size={55}
            className="mx-auto text-slate-600 mb-4"
          />

          <h3 className="text-2xl font-semibold text-white">
            No Applicants Yet
          </h3>

          <p className="text-slate-400 mt-2">
            Applicants will appear here after they apply for your jobs.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {applications.map((app) => (

            <div
              key={app._id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 flex justify-between items-center"
            >

              {/* Left */}
              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-xl font-bold text-white">

                  {app.applicantId?.name
                    ? app.applicantId.name.charAt(0).toUpperCase()
                    : "U"}

                </div>

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {app.applicantId?.name || "Unknown Applicant"}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-400 mt-1">

                    <Briefcase size={15} />

                    <span>
                      {app.jobId?.jobTitle || "Job Not Found"}
                    </span>

                  </div>

                </div>

              </div>

              {/* Right */}
              <div className="flex items-center gap-4">

                <span
                  className={`px-5 py-2 rounded-full text-sm font-semibold text-white ${
                    app.status === "Accepted"
                      ? "bg-green-600"
                      : app.status === "Rejected"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {app.status}
                </span>

                <button className="p-3 rounded-xl bg-slate-700 hover:bg-indigo-600 transition-all duration-300">

                  <Eye
                    size={18}
                    className="text-white"
                  />

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}