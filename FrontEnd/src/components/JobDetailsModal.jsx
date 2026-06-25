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
    if (!isOpen || !job) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-3xl w-[900px] max-h-[90vh] overflow-y-auto border border-slate-700">

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
                        className="text-gray-400 hover:text-white"
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
                            {job.salary}
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                            <Briefcase size={18} />
                            {job.experience}
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                            <GraduationCap size={18} />
                            {job.qualification}
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                            <Building2 size={18} />
                            {job.jobType}
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                            <Briefcase size={18} />
                            Vacancies : {job.vacancies}
                        </div>

                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Skills Required
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {job.skills &&
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
                            {job.jobDescription}
                        </p>
                    </div>

                    {/* Recruiter Trust */}
                    <div className="bg-slate-800 rounded-2xl p-5">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Recruiter Trust Score
                        </h3>

                        <div className="grid grid-cols-2 gap-4">

                            <div className="bg-green-600 rounded-xl p-4 text-center">
                                <h2 className="text-3xl font-bold text-white">
                                    88
                                </h2>

                                <p className="text-white">
                                    High Trust
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
                        <button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl text-white font-semibold">
                            Apply Now
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}