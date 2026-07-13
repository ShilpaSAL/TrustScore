import {
  ShieldCheck,
  Briefcase,
  Users,
  TriangleAlert,
} from "lucide-react";

export default function StatsCards({
  company,
  jobs = [],
  applications = [],
}) {
  const cards = [
    {
      value:
        company?.trustLabel || "Not Assessed",
      title: "Trust Level",
      icon: ShieldCheck,
      color: "bg-green-600",
    },
    {
      value: jobs.length,
      title: "Active Job Posts",
      icon: Briefcase,
      color: "bg-indigo-600",
    },
    {
      value: applications.length,
      title: "Total Applicants",
      icon: Users,
      color: "bg-amber-500",
    },
    {
      value:
        company?.complaints_count || 0,
      title: "Complaints Filed",
      icon: TriangleAlert,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-8 mt-8">
      {cards.map(
        (
          {
            value,
            title,
            icon: Icon,
            color,
          },
          index
        ) => (
          <div
            key={index}
            className="bg-[#111827] border border-slate-700 rounded-3xl p-6 flex items-center gap-5 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
            >
              <Icon
                size={26}
                className="text-white"
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-sm text-slate-400 font-medium">
                {title}
              </p>

              <h2 className="text-2xl font-bold text-white mt-1">
                {value}
              </h2>
            </div>
          </div>
        )
      )}
    </div>
  );
}