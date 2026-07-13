import { ShieldCheck, CalendarDays } from "lucide-react";

export default function TrustScoreCard({
    company,
    applications,
}) {
    const trustScore = Math.round(
        company?.confidenceScore ??
        company?.trustScore ??
        0
    );

    const trustLabel =
        company?.trustLabel ??
        (trustScore >= 80
            ? "High Trust"
            : trustScore >= 55
                ? "Medium Trust"
                : "Low Trust");

    const responseRate =
        applications.length === 0
            ? 0
            : Math.round(
                (applications.filter(
                    (a) => a.status !== "Pending"
                ).length /
                    applications.length) *
                100
            );

    return (
        <div className="px-8 mt-8">

            <div className="bg-[#111827] border border-slate-700 rounded-3xl p-8 shadow-xl">

                {/* Header */}

                <div className="flex justify-between items-center flex-wrap gap-4">

                    <div>

                        <h2 className="text-3xl font-bold text-white">
                            Recruiter Trust Score
                        </h2>

                        <p className="text-slate-400 mt-2">
                            AI-powered recruiter credibility assessment
                        </p>

                    </div>

                    <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 px-4 py-2 rounded-full text-green-400 font-semibold">

                        <ShieldCheck size={20} />

                        Verified Recruiter

                    </div>

                </div>

                {/* Body */}

                <div className="grid lg:grid-cols-2 gap-12 mt-10">

                    {/* Score */}

                    <div className="flex flex-col items-center justify-center">

                        <div className="relative w-52 h-52 rounded-full border-[14px] border-green-500 flex items-center justify-center hover:scale-105 transition-all duration-300">

                            <div className="text-center">

                                <h1 className="text-6xl font-bold text-white">
                                    {trustScore}
                                </h1>

                                <p className="text-green-400 font-semibold mt-2">
                                    {trustLabel}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-2 text-slate-400 mt-6">

                            <CalendarDays size={18} />

                            <span>
                                Last Updated:{" "}
                                {new Date().toLocaleDateString()}
                            </span>

                        </div>

                    </div>

                    {/* Metrics */}

                    <div className="space-y-6">

                        <Metric
                            title="Profile Completion"
                            value={company?.profileCompletion || 0}
                            color="bg-green-500"
                        />

                        <Metric
                            title="Approval Rate"
                            value={Math.round(
                                company?.approval_rate || 0
                            )}
                            color="bg-blue-500"
                        />

                        <Metric
                            title="Response Rate"
                            value={responseRate}
                            color="bg-indigo-500"
                        />

                        <Metric
                            title="Complaint Count"
                            value={company?.complaints_count || 0}
                            max={10}
                            color="bg-red-500"
                            percentage={false}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

function Metric({
    title,
    value,
    color,
    max = 100,
    percentage = true,
}) {
    const width = Math.min(
        (value / max) * 100,
        100
    );

    return (
        <div>

            <div className="flex justify-between mb-2">

                <p className="text-white font-medium">
                    {title}
                </p>

                <p className="text-green-400 font-bold">
                    {percentage ? `${value}%` : value}
                </p>

            </div>

            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

                <div
                    className={`${color} h-3 rounded-full transition-all duration-500`}
                    style={{
                        width: `${width}%`,
                    }}
                />

            </div>

        </div>
    );
}