import { useState } from "react";
import api from "../api/axios";

const FIELDS = [
  { key: "number_of_jobs_posted",       label: "Jobs Posted",            min: 0, max: 500,  step: 1,    placeholder: "e.g. 25" },
  { key: "avg_job_description_length",  label: "Avg Description Length", min: 0, max: 5000, step: 10,   placeholder: "chars, e.g. 800" },
  { key: "company_logo_present",        label: "Logo Present (0/1)",     min: 0, max: 1,    step: 1,    placeholder: "0 or 1" },
  { key: "response_time_hours",         label: "Response Time (hrs)",    min: 0, max: 200,  step: 0.5,  placeholder: "e.g. 12" },
  { key: "job_posting_frequency",       label: "Posting Frequency/week", min: 0, max: 20,   step: 0.1,  placeholder: "e.g. 3.5" },
  { key: "complaints_count",            label: "Complaints Count",       min: 0, max: 100,  step: 1,    placeholder: "e.g. 2" },
  { key: "approval_rate",               label: "Approval Rate (0-1)",    min: 0, max: 1,    step: 0.01, placeholder: "e.g. 0.85" },
];

const init = Object.fromEntries(FIELDS.map(f => [f.key, ""]));

export function Predict() {
  const [form, setForm]       = useState(init);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/predict", form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    "High Trust"  : "text-emerald-400",
    "Medium Trust": "text-amber-400",
    "Low Trust"   : "text-red-400"
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-1">Run Prediction</h1>
      <p className="text-slate-400 text-sm mb-6">Enter recruiter metrics below to assess credibility.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 text-red-300 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map(({ key, label, min, max, step, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-400 block mb-1">{label}</label>
              <input
                type="number"
                required
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Predict Trust Level"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400">Prediction Result</h2>
          <div className="flex items-center gap-4">
            <span className={`text-4xl font-extrabold ${colorMap[result.prediction?.trust_label]}`}>
              {result.prediction?.trust_label}
            </span>
            <span className="text-slate-400 text-sm">
              Confidence: <span className="text-white font-bold">{result.prediction?.confidence_score}%</span>
            </span>
          </div>
          {result.flaskResponse?.class_probabilities && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Class Probabilities</p>
              {Object.entries(result.flaskResponse.class_probabilities).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 mb-1">
                  <span className="text-xs text-slate-400 w-32">{k}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${v}%` }} />
                  </div>
                  <span className="text-xs text-slate-300 w-12 text-right">{v}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Predict;