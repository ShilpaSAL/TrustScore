import { ShieldCheck, CalendarDays } from "lucide-react";

export default function TrustScoreCard({
    company,
    applications,
}) {

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

        <div className="mx-10 mt-8">

            <div className="bg-[#131c2d] border border-[#283247] rounded-3xl p-8">

                {/* Header */}

                <div className="flex justify-between items-center">

                    <div>

                        <h2 className="text-3xl font-bold text-white">
                            Recruiter Trust Score
                        </h2>

                        <p className="text-[#9ca8c4] mt-2">
                            AI powered recruiter credibility assessment
                        </p>

                    </div>

                    <div className="flex items-center gap-2 text-green-400">

                        <ShieldCheck size={22} />

                        <span className="font-semibold">
                            Verified
                        </span>

                    </div>

                </div>

                {/* Body */}

                <div className="grid lg:grid-cols-2 gap-12 mt-10">

                    {/* Circular Score */}

                    <div className="flex flex-col items-center justify-center">

                        <div className="relative w-52 h-52 rounded-full border-[14px] border-green-500 flex items-center justify-center">

                            <div className="text-center">

                                <h1 className="text-6xl font-bold text-white">

                                    {Math.round(
                                        company?.confidenceScore || 0
                                    )}

                                </h1>

                                <p className="text-green-400 font-semibold mt-2">

                                    {company?.trustLabel}

                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-2 text-[#97A4C2] mt-6">

                            <CalendarDays size={18} />

                            <span>

                                Last Updated :
                                {" "}
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
                            value={Math.round((company?.approval_rate || 0) * 100)}
                            color="bg-blue-500"
                        />

                        <Metric
                            title="Response Rate"
                            value={responseRate}
                            color="bg-indigo-500"
                        />

                        <Metric
                            title="Complaint Rate"
                            value={company?.complaints_count || 0}
                            max={10}
                            color="bg-red-500"
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
                    {value}%
                </p>

            </div>

            <div className="w-full h-3 bg-[#1d2638] rounded-full overflow-hidden">

                <div
                    className={`${color} h-3 rounded-full`}
                    style={{
                        width: `${width}%`,
                    }}
                />

            </div>

        </div>

    );

}