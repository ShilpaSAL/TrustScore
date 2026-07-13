import {
  MapPin,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function JobCard({
  job,
  onView,
}) {
  // Recruiter credibility information
  const trustLabel =
    job.trustLabel || "Not Assessed";

  const confidenceScore =
    job.confidenceScore;

  // Trust badge style
  const getTrustBadge = () => {
    switch (trustLabel) {
      case "High Trust":
        return "bg-green-500/10 text-green-400 border border-green-500/40";

      case "Medium Trust":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/40";

      case "Low Trust":
        return "bg-red-500/10 text-red-400 border border-red-500/40";

      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/40";
    }
  };

  return (
    <div
      onClick={() => onView(job)}
      className="group bg-[#111827] border border-slate-700 hover:border-indigo-500 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] cursor-pointer"
    >
      {/* Header */}

      <div className="flex justify-between gap-4 flex-wrap">

        <div className="flex gap-4">

          {/* Company Initial */}

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {job.companyName
              ? job.companyName
                  .charAt(0)
                  .toUpperCase()
              : "C"}
          </div>

          {/* Job Information */}

          <div>
            <h2 className="text-2xl font-bold text-white">
              {job.jobTitle}
            </h2>

            <p className="text-indigo-400 font-medium">
              {job.companyName ||
                "Company Not Available"}
            </p>

            <div className="flex items-center gap-2 text-slate-400 mt-1">
              <MapPin size={15} />

              <span>
                {job.location ||
                  "Location Not Specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Recruiter Trust Level */}

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold h-fit ${getTrustBadge()}`}
        >
          <ShieldCheck size={16} />

          <span>{trustLabel}</span>
        </div>
      </div>

      {/* Prediction Confidence */}

      {confidenceScore !== undefined &&
        confidenceScore !== null && (
          <p className="text-sm text-slate-400 mt-4">
            ML Prediction Confidence:{" "}
            <span className="text-white font-semibold">
              {Math.round(
                confidenceScore
              )}
              %
            </span>
          </p>
        )}

      {/* Skills */}

      {job.skills && (
        <div className="flex flex-wrap gap-2 mt-6">
          {job.skills
            .split(",")
            .filter(
              (skill) =>
                skill.trim() !== ""
            )
            .map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm"
              >
                {skill.trim()}
              </span>
            ))}
        </div>
      )}

      {/* Divider */}

      <div className="border-t border-slate-700 my-6" />

      {/* Footer */}

      <div className="flex justify-between items-center flex-wrap gap-4">

        <h3 className="text-2xl font-bold text-white">
          {job.salary ||
            "Salary Not Disclosed"}
        </h3>

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2 text-slate-400">
            <Clock3 size={16} />

            {job.createdAt
              ? new Date(
                  job.createdAt
                ).toLocaleDateString()
              : "Recently Posted"}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(job);
            }}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105 transition px-6 py-3 rounded-xl text-white font-semibold"
          >
            View Details
          </button>

        </div>
      </div>
    </div>
  );
}