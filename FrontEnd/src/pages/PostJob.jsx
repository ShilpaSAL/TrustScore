import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyJob = {
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
};

export default function PostJob() {
  const [job, setJob] = useState(emptyJob);
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================================
  // Load Recruiter's Jobs
  // ==========================================================

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/job");
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Fetch jobs error:",
        error.response?.data || error.message
      );
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Handle Form Input
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setJob((previousJob) => ({
      ...previousJob,
      [name]: value,
    }));
  };

  // ==========================================================
  // Open New Job Form
  // ==========================================================

  const handleNewJob = () => {
    setJob(emptyJob);
    setEditingId(null);
    setShowForm(true);
  };

  // ==========================================================
  // Create / Update Job
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingId) {
        const { data } = await api.put(
          `/job/${editingId}`,
          job
        );

        const updatedJob = data.job || data;

        setJobs((previousJobs) =>
          previousJobs.map((item) =>
            item._id === editingId
              ? updatedJob
              : item
          )
        );

        alert("Job updated successfully.");
      } else {
        const { data } = await api.post(
          "/job",
          job
        );

        const newJob = data.job || data;

        setJobs((previousJobs) => [
          newJob,
          ...previousJobs,
        ]);

        alert("Job posted successfully.");
      }

      setJob(emptyJob);
      setEditingId(null);
      setShowForm(false);

      // Synchronize again with MongoDB
      await fetchJobs();

    } catch (error) {
      console.error(
        "Save job error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Unable to save the job."
      );
    } finally {
      setSubmitting(false);
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
      deadline: item.deadline
        ? item.deadline.split("T")[0]
        : "",
      website: item.website || "",
      email: item.email || "",
    });

    setEditingId(item._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // ==========================================================
  // Delete Job
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/job/${id}`);

      setJobs((previousJobs) =>
        previousJobs.filter(
          (item) => item._id !== id
        )
      );

      if (selectedJob?._id === id) {
        setSelectedJob(null);
      }

      alert("Job deleted successfully.");
    } catch (error) {
      console.error(
        "Delete job error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Unable to delete the job."
      );
    }
  };

  // ==========================================================
  // Cancel Form
  // ==========================================================

  const handleCancel = () => {
    setJob(emptyJob);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Job Posts
        </h1>

        <button
          onClick={handleNewJob}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-lg text-white"
        >
          + New Job Post
        </button>
      </div>

      {/* Create / Edit Job Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-6 rounded-xl space-y-4 mb-6"
        >
          <h2 className="text-xl font-bold text-white">
            {editingId
              ? "Edit Job"
              : "Create New Job"}
          </h2>

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
            required
          />

          <textarea
            name="jobDescription"
            placeholder="Job Description"
            rows="5"
            value={job.jobDescription}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
            required
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
            <option value="">
              Select Job Type
            </option>
            <option value="Full Time">
              Full Time
            </option>
            <option value="Part Time">
              Part Time
            </option>
            <option value="Internship">
              Internship
            </option>
            <option value="Remote">
              Remote
            </option>
          </select>

          <input
            type="number"
            name="vacancies"
            placeholder="Number of Vacancies"
            min="1"
            value={job.vacancies}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="date"
            name="deadline"
            value={job.deadline}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="website"
            placeholder="Company Website"
            value={job.website}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Contact Email"
            value={job.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded text-white"
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Job"
                  : "Post Job"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Job List */}
      {loading ? (
        <p className="text-gray-400">
          Loading jobs...
        </p>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
          <p className="text-gray-400">
            No jobs posted yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 border border-slate-700 rounded-xl p-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {item.jobTitle}
                  </h2>

                  <p className="text-indigo-400">
                    {item.companyName}
                  </p>
                </div>

                {item.salary && (
                  <span className="bg-green-600 px-3 py-1 rounded text-sm text-white">
                    {item.salary}
                  </span>
                )}
              </div>

              <p className="text-gray-400 mt-2">
                📍 {item.location || "Not specified"}
              </p>

              <p className="text-gray-300 mt-3">
                {item.jobDescription}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    setSelectedJob(item)
                  }
                  className="bg-blue-600 px-4 py-2 rounded text-white"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    handleEdit(item)
                  }
                  className="bg-yellow-600 px-4 py-2 rounded text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(item._id)
                  }
                  className="bg-red-600 px-4 py-2 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Job Details
              </h2>

              <button
                onClick={() =>
                  setSelectedJob(null)
                }
                className="text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-white">
              <p>
                <b>Job Title:</b>{" "}
                {selectedJob.jobTitle}
              </p>

              <p>
                <b>Company:</b>{" "}
                {selectedJob.companyName}
              </p>

              <p>
                <b>Location:</b>{" "}
                {selectedJob.location ||
                  "Not specified"}
              </p>

              <p>
                <b>Salary:</b>{" "}
                {selectedJob.salary ||
                  "Not specified"}
              </p>

              <p>
                <b>Experience:</b>{" "}
                {selectedJob.experience ||
                  "Not specified"}
              </p>

              <p>
                <b>Qualification:</b>{" "}
                {selectedJob.qualification ||
                  "Not specified"}
              </p>

              <p>
                <b>Skills:</b>{" "}
                {selectedJob.skills ||
                  "Not specified"}
              </p>

              <p>
                <b>Job Type:</b>{" "}
                {selectedJob.jobType ||
                  "Not specified"}
              </p>

              <p>
                <b>Vacancies:</b>{" "}
                {selectedJob.vacancies ||
                  "Not specified"}
              </p>

              <p>
                <b>Deadline:</b>{" "}
                {selectedJob.deadline ||
                  "Not specified"}
              </p>

              <p>
                <b>Description:</b>{" "}
                {selectedJob.jobDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}