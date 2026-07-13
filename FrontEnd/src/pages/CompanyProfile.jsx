import { useState, useEffect } from "react";
import api from "../api/axios";

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    companyEmail: "",
    companyPhone: "",
    companyLocation: "",
    industryType: "",
    companySize: "",
    foundedYear: "",
  });

  const [savedCompany, setSavedCompany] = useState(null);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await api.get("/company");

      if (res.data) {
        setSavedCompany(res.data);
        setCompany(res.data);
        setEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/company", company);

      setSavedCompany(res.data);
      setEditing(false);

      alert("Company Profile Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to Save Company Profile");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/company");

      setSavedCompany(null);

      setCompany({
        companyName: "",
        companyDescription: "",
        companyWebsite: "",
        companyEmail: "",
        companyPhone: "",
        companyLocation: "",
        industryType: "",
        companySize: "",
        foundedYear: "",
      });

      setEditing(true);

      alert("Company Profile Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (!editing && savedCompany) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-[#111827] border border-slate-700 rounded-3xl shadow-xl p-8">
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-indigo-500 transition-all duration-300">
              <h3 className="text-gray-400 text-sm">Company Name</h3>
              <p className="text-white text-lg font-semibold">
                {savedCompany.companyName}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-gray-400 text-sm">Industry</h3>
              <p className="text-white">
                {savedCompany.industryType}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-gray-400 text-sm">Email</h3>
              <p className="text-white">
                {savedCompany.companyEmail}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-gray-400 text-sm">Phone</h3>
              <p className="text-white">
                {savedCompany.companyPhone}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-gray-400 text-sm">Website</h3>
              <p className="text-white break-all">
                {savedCompany.companyWebsite}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-gray-400 text-sm">Location</h3>
              <p className="text-white">
                {savedCompany.companyLocation}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-gray-400 text-sm">Company Size</h3>
              <p className="text-white">
                {savedCompany.companySize}
              </p>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl">
              <h3 className="text-gray-400 text-sm">Founded Year</h3>
              <p className="text-white">
                {savedCompany.foundedYear}
              </p>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mt-6">
            <h3 className="text-gray-400 text-sm mb-2">
              Company Description
            </h3>

            <p className="text-white leading-7">
              {savedCompany.companyDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Company Profile
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

        <button
          type="submit"
          className="bg-indigo-600 px-6 py-3 rounded text-white"
        >
          Save Company Profile
        </button>
      </form>
    </div>
  );
}