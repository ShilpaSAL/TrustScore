import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
     const { data } = await api.get("/job/all");
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        Browse Jobs
      </h1>

      <input
        type="text"
        placeholder="Search Jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 text-white mb-6"
      />

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {job.jobTitle}
                </h2>

                <p className="text-indigo-400">
                  {job.companyName}
                </p>
              </div>

              <span className="bg-green-600 px-3 py-1 rounded text-white">
                {job.salary}
              </span>
            </div>

            <p className="text-gray-400 mt-2">
              📍 {job.location}
            </p>

            <p className="text-gray-300 mt-3">
              {job.jobDescription}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <span className="bg-emerald-600 px-3 py-1 rounded text-white text-sm">
                  Trust Score: 92
                </span>
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white">
                Apply Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}