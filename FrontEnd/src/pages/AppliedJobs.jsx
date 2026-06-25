export default function AppliedJobs() {
  const appliedJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechNova Solutions",
      location: "Bangalore",
      status: "Under Review",
      trustScore: 92,
    },
    {
      id: 2,
      title: "React Developer",
      company: "Infosys",
      location: "Mangalore",
      status: "Shortlisted",
      trustScore: 95,
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "ABC Technologies",
      location: "Mumbai",
      status: "Rejected",
      trustScore: 60,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        Applied Jobs
      </h1>

      <div className="grid gap-4">
        {appliedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {job.title}
                </h2>

                <p className="text-indigo-400">
                  {job.company}
                </p>

                <p className="text-gray-400 mt-1">
                  📍 {job.location}
                </p>
              </div>

              <div className="text-right">
                <span className="bg-emerald-600 px-3 py-1 rounded text-white text-sm">
                  Trust Score: {job.trustScore}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`px-3 py-1 rounded text-white text-sm ${
                  job.status === "Shortlisted"
                    ? "bg-green-600"
                    : job.status === "Rejected"
                    ? "bg-red-600"
                    : "bg-yellow-600"
                }`}
              >
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}