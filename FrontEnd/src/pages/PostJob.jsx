import { useState, useEffect } from "react";
import api from "../api/axios";

export default function PostJob() {
  const [job, setJob] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    location: "",
    salary: "",
    experience: "",
    qualification: "",
    skills: "",
    jobType: "",
    vacancies: "",
    deadline: "",
    website: "",
    email: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/job");
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/job/${editingId}`, job);

        alert("Job Updated Successfully");
      } else {
        await api.post("/job", job);

        alert("Job Posted Successfully");
      }
      fetchJobs();
      setEditingId(null);


      setJob({
        jobTitle: "",
        companyName: "",
        jobDescription: "",
        location: "",
        salary: "",
        experience: "",
        qualification: "",
        skills: "",
        jobType: "",
        vacancies: "",
        deadline: "",
        website: "",
        email: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to Post Job");
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/job/${id}`);

      setJobs(jobs.filter((job) => job._id !== id));

      alert("Job deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to delete job");
    }
  };
  const handleEdit = (item) => {
    setJob({
      jobTitle: item.jobTitle || "",
      companyName: item.companyName || "",
      jobDescription: item.jobDescription || "",
      location: item.location || "",
      salary: item.salary || "",
      experience: item.experience || "",
      qualification: item.qualification || "",
      skills: item.skills || "",
      jobType: item.jobType || "",
      vacancies: item.vacancies || "",
      deadline: item.deadline || "",
      website: item.website || "",
      email: item.email || "",
    });

    setEditingId(item._id);
    setShowForm(true);
  };
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Job Posters
        </h1>

        <button
          onClick={() => {
            setEditingId(null);

            setJob({
              jobTitle: "",
              companyName: "",
              jobDescription: "",
              location: "",
              salary: "",
              experience: "",
              qualification: "",
              skills: "",
              jobType: "",
              vacancies: "",
              deadline: "",
              website: "",
              email: "",
            });

            setShowForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-lg text-white"
        >
          + New Job Post
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-6 rounded-xl space-y-4 mb-6"
        >
          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title"
            value={job.jobTitle}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
            required
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={job.companyName}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <textarea
            name="jobDescription"
            placeholder="Job Description"
            rows="5"
            value={job.jobDescription}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={job.location}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary Package"
            value={job.salary}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />
          <input
            type="text"
            name="experience"
            placeholder="Experience (Example: 0-2 Years)"
            value={job.experience}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="qualification"
            placeholder="Qualification (Example: MCA / B.Tech)"
            value={job.qualification}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="skills"
            placeholder="Required Skills (Example: React, JavaScript, Node.js)"
            value={job.skills}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <select
            name="jobType"
            value={job.jobType}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          >
            <option value="">Select Job Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>

          <input
            type="number"
            name="vacancies"
            placeholder="Number of Vacancies"
            value={job.vacancies}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded text-white"
            >
              {editingId ? "Update Job" : "Post Job"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {jobs.map((item) => (
          <div
            key={item._id}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {item.jobTitle}
                </h2>

                <p className="text-indigo-400">
                  {item.companyName}
                </p>
              </div>

              <span className="bg-green-600 px-3 py-1 rounded text-sm text-white">
                {item.salary}
              </span>
            </div>

            <p className="text-gray-400 mt-2">
              📍 {item.location}
            </p>

            <p className="text-gray-300 mt-3">
              {item.jobDescription}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedJob(item)}
                className="bg-blue-600 px-4 py-2 rounded text-white"
              >
                View
              </button>

              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-600 px-4 py-2 rounded text-white"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 px-4 py-2 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Job Details
              </h2>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-white">
              <p><b>Job Title:</b> {selectedJob.jobTitle}</p>
              <p><b>Company:</b> {selectedJob.companyName}</p>
              <p><b>Location:</b> {selectedJob.location}</p>
              <p><b>Salary:</b> {selectedJob.salary}</p>
              <p><b>Description:</b> {selectedJob.jobDescription}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}