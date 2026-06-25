import { MapPin, Briefcase, Clock } from "lucide-react";

export default function JobCard({ job, onView }) {
  return (
    <div
      onClick={() => onView(job)}
      className="bg-slate-900 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            {job.companyName
              ? job.companyName.charAt(0).toUpperCase()
              : "C"}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              {job.jobTitle}
            </h3>

            <p className="text-indigo-400 font-medium">
              {job.companyName}
            </p>

            <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
              <MapPin size={15} />
              {job.location}
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          High Trust • 88
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-5">
        {job.skills &&
          job.skills.split(",").map((skill, index) => (
            <span
              key={index}
              className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs"
            >
              {skill.trim()}
            </span>
          ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="text-green-400 font-bold text-lg">
            {job.salary}
          </p>

          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
            <Clock size={14} />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(job);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-white font-semibold"
        >
          View Details
        </button>
      </div>
    </div>
  );
}