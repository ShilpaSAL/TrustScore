import {
  ShieldCheck,
  CalendarDays,
  BrainCircuit,
} from "lucide-react";

export default function TrustScoreCard({
  company,
  applications = [],
}) {
  // ML prediction result
  const trustLabel =
    company?.trustLabel || "Not Assessed";

  // Confidence of the ML prediction
  const predictionConfidence = Math.round(
    company?.confidenceScore || 0
  );

  // approval_rate is stored between 0 and 1
  const approvalRate = Math.round(
    (company?.approval_rate || 0) * 100
  );

  // Percentage of applications that received
  // a recruiter response
  const responseRate =
    applications.length === 0
      ? 0
      : Math.round(
          (applications.filter(
            (application) =>
              application.status !== "Pending"
          ).length /
            applications.length) *
            100
        );

  const lastUpdated = company?.updatedAt
    ? new Date(
        company.updatedAt
      ).toLocaleDateString()
    : "Not available";

  return (
    <div className="px-8 mt-8">
      <div className="bg-[#111827] border border-slate-700 rounded-3xl p-8 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Recruiter Credibility Assessment
            </h2>

            <p className="text-slate-400 mt-2">
              Machine learning-based evaluation of
              recruiter behavioural attributes
            </p>
          </div>

          <div className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 rounded-full text-indigo-400 font-semibold">
            <BrainCircuit size={20} />
            ML Assessment
          </div>
        </div>

        {/* No Company Profile */}
        {!company ? (
          <div className="mt-10 bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
            <ShieldCheck
              size={45}
              className="mx-auto text-slate-400 mb-4"
            />

            <h3 className="text-xl font-bold text-white">
              Credibility Assessment Not Available
            </h3>

            <p className="text-slate-400 mt-2">
              Create your company profile to generate
              a recruiter credibility prediction.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 mt-10">

            {/* ML Prediction */}
            <div className="flex flex-col items-center justify-center">

              <div className="w-56 h-56 rounded-full border-[14px] border-indigo-500 flex items-center justify-center">
                <div className="text-center px-4">
                  <ShieldCheck
                    size={35}
                    className="mx-auto text-indigo-400 mb-3"
                  />

                  <h1 className="text-3xl font-bold text-white">
                    {trustLabel}
                  </h1>

                  <p className="text-slate-400 mt-2">
                    Predicted Trust Level
                  </p>
                </div>
              </div>

              {/* Prediction Confidence */}
              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Prediction Confidence
                </p>

                <p className="text-3xl font-bold text-indigo-400 mt-1">
                  {predictionConfidence}%
                </p>
              </div>

              <div className="flex items-center gap-2 text-slate-400 mt-5">
                <CalendarDays size={18} />

                <span>
                  Last Updated: {lastUpdated}
                </span>
              </div>
            </div>

            {/* Behavioural Metrics */}
            <div className="space-y-6">

              <Metric
                title="Profile Completion"
                value={
                  company.profileCompletion || 0
                }
                color="bg-green-500"
              />

              <Metric
                title="Approval Rate"
                value={approvalRate}
                color="bg-blue-500"
              />

              <Metric
                title="Response Rate"
                value={responseRate}
                color="bg-indigo-500"
              />

              <Metric
                title="Complaint Count"
                value={
                  company.complaints_count || 0
                }
                max={10}
                color="bg-red-500"
                percentage={false}
              />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ============================================================
// Metric Progress Bar
// ============================================================

function Metric({
  title,
  value,
  color,
  max = 100,
  percentage = true,
}) {
  const numericValue =
    Number(value) || 0;

  const width = Math.min(
    Math.max(
      (numericValue / max) * 100,
      0
    ),
    100
  );

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p className="text-white font-medium">
          {title}
        </p>

        <p className="text-slate-300 font-bold">
          {percentage
            ? `${numericValue}%`
            : numericValue}
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