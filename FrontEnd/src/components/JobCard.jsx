import {
  MapPin,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function JobCard({ job, onView }) {

  const trustScore = job.confidenceScore || 88;

  let badge =
    "bg-green-500/10 text-green-400 border border-green-500/40";

  let label = "High Trust";

  if (trustScore < 80 && trustScore >= 55) {
    badge =
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/40";
    label = "Medium Trust";
  }

  if (trustScore < 55) {
    badge =
      "bg-red-500/10 text-red-400 border border-red-500/40";
    label = "Low Trust";
  }

  return (
    <div
      onClick={() => onView(job)}
      className="group bg-[#111827] border border-slate-700 hover:border-indigo-500 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] cursor-pointer"
    >

      {/* Header */}

      <div className="flex justify-between">

        <div className="flex gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">

            {job.companyName
              ? job.companyName[0].toUpperCase()
              : "C"}

          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">

              {job.jobTitle}

            </h2>

            <p className="text-slate-400 mt-1">

              {job.companyName} • {job.location}

            </p>

          </div>

        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${badge}`}
        >

          <ShieldCheck size={16} />

          {label} • {trustScore}

        </div>

      </div>

      {/* Skills */}

      <div className="flex flex-wrap gap-2 mt-6">

        {job.skills &&
          job.skills.split(",").map((skill, index) => (

            <span
              key={index}
              className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm"
            >
              {skill.trim()}
            </span>

          ))}

      </div>

      {/* Divider */}

      <div className="border-t border-slate-700 my-6"></div>

      {/* Footer */}

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-3xl font-bold text-white">

            {job.salary}

          </h3>

        </div>

        <div className="flex items-center gap-8">

          <div className="flex items-center gap-2 text-slate-400">

            <Clock3 size={16} />

            {new Date(job.createdAt).toLocaleDateString()}

          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(job);
            }}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105 transition px-6 py-3 rounded-xl text-white font-semibold"
          >

            Apply

          </button>

        </div>

      </div>

    </div>
  );
}