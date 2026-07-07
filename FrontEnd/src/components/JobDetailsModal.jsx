import { useState } from "react";
import api from "../api/axios";
import {
    X,
    MapPin,
    Building2,
    Briefcase,
    GraduationCap,
    IndianRupee,
} from "lucide-react";

export default function JobDetailsModal({
    job,
    isOpen,
    onClose,
}) {

    const [loading, setLoading] = useState(false);

    if (!isOpen || !job) return null;
    const trustScore =
        job.trustScore ??
        job.confidenceScore ??
        88;

    const trustLabel =
        trustScore >= 80
            ? "High Trust"
            : trustScore >= 55
                ? "Medium Trust"
                : "Low Trust";

    const trustColor =
        trustScore >= 80
            ? "bg-green-600"
            : trustScore >= 55
                ? "bg-yellow-500"
                : "bg-red-600";

    const applyJob = async () => {
        try {
            setLoading(true);

            const res = await api.post(
                `/application/apply/${job._id}`
            );

            alert(res.data.message);

            onClose();
        } catch (err) {
            alert(
                err.response?.data?.message || "Failed to apply."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-3xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                            {job.companyName
                                ? job.companyName.charAt(0).toUpperCase()
                                : "C"}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {job.jobTitle}
                            </h2>

                            <p className="text-indigo-400">
                                {job.companyName}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    >
                        <X size={30} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Basic Details */}
                    <div className="grid md:grid-cols-2 gap-4">

                        <div className="flex items-center gap-2 text-slate-300">
                            <MapPin size={18} />
                            {job.location}
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                            <IndianRupee size={18} />
                            {job.salary || "Not Disclosed"}
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                            <Briefcase size={18} />
                            {job.experience || "Not Specified"}
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                            <GraduationCap size={18} />
                            {job.qualification || "Not Specified"}
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                            <Building2 size={18} />
                            {job.jobType || "Full Time"}
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                            <Briefcase size={18} />
                            Vacancies: {job.vacancies || "N/A"}
                        </div>

                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Skills Required
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {typeof job.skills === "string" &&
                                job.skills.split(",").map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-indigo-700 px-3 py-1 rounded-full text-white text-sm"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Job Description
                        </h3>

                        <p className="text-slate-300 leading-7">
                            {job.jobDescription || "No description available."}
                        </p>
                    </div>

                    {/* Recruiter Trust */}
                    <div className="bg-slate-800 rounded-2xl p-5">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Recruiter Trust Score
                        </h3>

                        <div className="grid grid-cols-2 gap-4">

                            <div className={`${trustColor} rounded-xl p-4 text-center`}>
                                <h2 className="text-3xl font-bold text-white">
                                    {trustScore}
                                </h2>

                                <p className="text-white font-semibold">
                                    {trustLabel}
                                </p>
                            </div>

                            <div className="space-y-2 text-slate-300">

                                <p>✔ Profile Completion : 92%</p>

                                <p>✔ Approval Rate : 90%</p>

                                <p>✔ Response Rate : 89%</p>

                                <p>✔ Complaint Rate : 3%</p>

                            </div>

                        </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={applyJob}
                            disabled={loading}
                            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl text-white font-semibold"
                        >
                            {loading ? "Applying..." : "Apply Now"}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}