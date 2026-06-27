export default function RecentApplicants({ applications }) {
    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-700 p-8 mt-8 mx-8">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                    Recent Applicants
                </h2>

                <button className="text-green-400 font-semibold">
                    View All
                </button>
            </div>

            {applications.length === 0 ? (
                <p className="text-slate-400">
                    No applicants yet.
                </p>
            ) : (
                <div className="space-y-4">

                    {applications.map((app) => (

                        <div
                            key={app._id}
                            className="bg-slate-800 rounded-2xl p-5 flex justify-between items-center"
                        >

                            <div>

                                <h3 className="text-white font-semibold">
                                    {app.applicantId?.name}
                                </h3>

                                <p className="text-slate-400">
                                    {app.jobId?.jobTitle}
                                </p>

                            </div>

                            <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${app.status === "Accepted"
                                        ? "bg-green-500"
                                        : app.status === "Rejected"
                                            ? "bg-red-500"
                                            : "bg-yellow-500"
                                    }`}
                            >
                                {app.status}
                            </span>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}