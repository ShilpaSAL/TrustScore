import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyCompany = {
  companyName: "",
  companyDescription: "",
  companyWebsite: "",
  companyEmail: "",
  companyPhone: "",
  companyLocation: "",
  industryType: "",
  companySize: "",
  foundedYear: "",
};

export default function CompanyProfile() {
  const [company, setCompany] = useState(emptyCompany);
  const [savedCompany, setSavedCompany] = useState(null);
  const [editing, setEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================================
  // Load Company Profile
  // ==========================================================

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/company");

      if (data) {
        setSavedCompany(data);

        setCompany({
          companyName: data.companyName || "",
          companyDescription:
            data.companyDescription || "",
          companyWebsite:
            data.companyWebsite || "",
          companyEmail:
            data.companyEmail || "",
          companyPhone:
            data.companyPhone || "",
          companyLocation:
            data.companyLocation || "",
          industryType:
            data.industryType || "",
          companySize:
            data.companySize || "",
          foundedYear:
            data.foundedYear || "",
        });

        setEditing(false);
      }
    } catch (error) {
      // 404 means the recruiter has not created
      // a company profile yet.
      if (error.response?.status === 404) {
        setSavedCompany(null);
        setEditing(true);
      } else {
        console.error(
          "Fetch company error:",
          error.response?.data || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Handle Input Changes
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompany((previousCompany) => ({
      ...previousCompany,
      [name]: value,
    }));
  };

  // ==========================================================
  // Create / Update Company Profile
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const { data } = await api.post(
        "/company",
        company
      );

      // Corrected backend response:
      // { message: "...", company: {...} }
      const savedData = data.company;

      setSavedCompany(savedData);

      setCompany({
        companyName:
          savedData.companyName || "",
        companyDescription:
          savedData.companyDescription || "",
        companyWebsite:
          savedData.companyWebsite || "",
        companyEmail:
          savedData.companyEmail || "",
        companyPhone:
          savedData.companyPhone || "",
        companyLocation:
          savedData.companyLocation || "",
        industryType:
          savedData.industryType || "",
        companySize:
          savedData.companySize || "",
        foundedYear:
          savedData.foundedYear || "",
      });

      setEditing(false);

      alert(
        "Company profile saved successfully."
      );
    } catch (error) {
      console.error(
        "Save company error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to save company profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // Delete Company Profile
  // ==========================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your company profile?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete("/company");

      setSavedCompany(null);
      setCompany(emptyCompany);
      setEditing(true);

      alert(
        "Company profile deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete company error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete company profile."
      );
    }
  };

  // ==========================================================
  // Cancel Editing
  // ==========================================================

  const handleCancel = () => {
    if (!savedCompany) {
      setCompany(emptyCompany);
      return;
    }

    setCompany({
      companyName:
        savedCompany.companyName || "",
      companyDescription:
        savedCompany.companyDescription || "",
      companyWebsite:
        savedCompany.companyWebsite || "",
      companyEmail:
        savedCompany.companyEmail || "",
      companyPhone:
        savedCompany.companyPhone || "",
      companyLocation:
        savedCompany.companyLocation || "",
      industryType:
        savedCompany.industryType || "",
      companySize:
        savedCompany.companySize || "",
      foundedYear:
        savedCompany.foundedYear || "",
    });

    setEditing(false);
  };

  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <p className="text-gray-400">
          Loading company profile...
        </p>
      </div>
    );
  }

  // ==========================================================
  // Company Overview
  // ==========================================================

  if (!editing && savedCompany) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-[#111827] border border-slate-700 rounded-3xl shadow-xl p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Company Overview
            </h1>

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="bg-amber-500 hover:bg-amber-400 transition px-5 py-2 rounded-xl text-white font-semibold"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 transition px-5 py-2 rounded-xl text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Recruiter Credibility Result */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">
                Recruiter Trust Level
              </p>

              <p className="text-xl font-bold text-white mt-2">
                {savedCompany.trustLabel ||
                  "Not Available"}
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">
                Prediction Confidence
              </p>

              <p className="text-xl font-bold text-white mt-2">
                {savedCompany.confidenceScore !==
                undefined
                  ? `${savedCompany.confidenceScore}%`
                  : "Not Available"}
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">
                Profile Completion
              </p>

              <p className="text-xl font-bold text-white mt-2">
                {savedCompany.profileCompletion || 0}%
              </p>
            </div>

          </div>

          {/* Company Information */}
          <div className="grid md:grid-cols-2 gap-6">

            <InfoCard
              title="Company Name"
              value={savedCompany.companyName}
            />

            <InfoCard
              title="Industry"
              value={savedCompany.industryType}
            />

            <InfoCard
              title="Email"
              value={savedCompany.companyEmail}
            />

            <InfoCard
              title="Phone"
              value={savedCompany.companyPhone}
            />

            <InfoCard
              title="Website"
              value={savedCompany.companyWebsite}
            />

            <InfoCard
              title="Location"
              value={savedCompany.companyLocation}
            />

            <InfoCard
              title="Company Size"
              value={savedCompany.companySize}
            />

            <InfoCard
              title="Founded Year"
              value={savedCompany.foundedYear}
            />

          </div>

          {/* Company Description */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mt-6">
            <h3 className="text-gray-400 text-sm mb-2">
              Company Description
            </h3>

            <p className="text-white leading-7">
              {savedCompany.companyDescription ||
                "Not provided"}
            </p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================================
  // Company Profile Form
  // ==========================================================

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-white mb-6">
        {savedCompany
          ? "Edit Company Profile"
          : "Create Company Profile"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl space-y-4"
      >
        <input
          type="text"
          name="companyName"
          value={company.companyName}
          placeholder="Company Name"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
          required
        />

        <textarea
          name="companyDescription"
          value={company.companyDescription}
          placeholder="Company Description"
          rows="4"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          type="text"
          name="companyWebsite"
          value={company.companyWebsite}
          placeholder="Company Website"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          type="email"
          name="companyEmail"
          value={company.companyEmail}
          placeholder="Company Email"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          type="text"
          name="companyPhone"
          value={company.companyPhone}
          placeholder="Company Phone"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          type="text"
          name="companyLocation"
          value={company.companyLocation}
          placeholder="Company Location"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          type="text"
          name="industryType"
          value={company.industryType}
          placeholder="Industry Type"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          type="text"
          name="companySize"
          value={company.companySize}
          placeholder="Company Size"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <input
          type="text"
          name="foundedYear"
          value={company.foundedYear}
          placeholder="Founded Year"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded text-white"
          >
            {saving
              ? "Saving..."
              : "Save Company Profile"}
          </button>

          {savedCompany && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded text-white"
            >
              Cancel
            </button>
          )}

        </div>
      </form>
    </div>
  );
}


// ============================================================
// Reusable Information Card
// ============================================================

function InfoCard({ title, value }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
      <h3 className="text-gray-400 text-sm">
        {title}
      </h3>

      <p className="text-white text-lg font-semibold break-all">
        {value || "Not provided"}
      </p>
    </div>
  );
}