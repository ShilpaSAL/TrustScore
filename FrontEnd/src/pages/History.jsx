import { useEffect, useState } from "react";
import api from "../api/axios";

export function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/predict/history")
      .then(r => setHistory(r.data))
      .finally(() => setLoading(false));
  }, []);

  const colorMap = {
    "High Trust"  : "bg-emerald-900/50 text-emerald-300",
    "Medium Trust": "bg-amber-900/50 text-amber-300",
    "Low Trust"   : "bg-red-900/50 text-red-300"
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Prediction History</h1>
      <p className="text-slate-400 text-sm mb-6">{history.length} total predictions</p>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
            <tr>
              {["Date","Jobs","Logo","Resp.Time","Complaints","Approval","Trust","Confidence"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-10 text-slate-500">Loading…</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-slate-500">No predictions yet.</td></tr>
            ) : history.map((p, i) => (
              <tr key={p._id} className={`border-t border-slate-800 hover:bg-slate-800/40 transition-colors ${i % 2 === 0 ? "" : "bg-slate-900/50"}`}>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-slate-300">{p.number_of_jobs_posted}</td>
                <td className="px-4 py-3 text-slate-300">{p.company_logo_present ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-slate-300">{p.response_time_hours}h</td>
                <td className="px-4 py-3 text-slate-300">{p.complaints_count}</td>
                <td className="px-4 py-3 text-slate-300">{(p.approval_rate * 100).toFixed(0)}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[p.trust_label]}`}>
                    {p.trust_label}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 font-semibold">{p.confidence_score}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;