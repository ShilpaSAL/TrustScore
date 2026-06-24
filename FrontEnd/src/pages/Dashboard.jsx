
import { useEffect, useState as useStateD } from "react";
import { Link as LinkD } from "react-router-dom";
import { useAuth as useAuthD } from "../context/AuthContext";
import api from "../api/axios";
import { BrainCircuit, ClipboardList, TrendingUp, Award } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuthD();
  const [history, setHistory] = useStateD([]);

  useEffect(() => {
    api.get("/predict/history").then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const counts = { total: history.length, high: 0, medium: 0, low: 0 };
  history.forEach(p => {
    if (p.trust_label === "High Trust") counts.high++;
    else if (p.trust_label === "Medium Trust") counts.medium++;
    else counts.low++;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ClipboardList} label="Total Predictions" value={counts.total}  color="bg-indigo-600" />
        <StatCard icon={Award}        label="High Trust"        value={counts.high}   color="bg-emerald-600" />
        <StatCard icon={TrendingUp}   label="Medium Trust"      value={counts.medium} color="bg-amber-600" />
        <StatCard icon={BrainCircuit} label="Low Trust"         value={counts.low}    color="bg-red-600" />
      </div>

      <div className="flex gap-4 mb-8">
        <LinkD to="/predict" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm">
          + New Prediction
        </LinkD>
        <LinkD to="/history" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-sm">
          View Full History
        </LinkD>
      </div>

      {history.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Recent Predictions</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map(p => (
              <div key={p._id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <span className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleString()}</span>
                <TrustBadge label={p.trust_label} />
                <span className="text-xs text-slate-400">{p.confidence_score}% conf.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;

function TrustBadge({ label }) {
  const cls = label === "High Trust"   ? "bg-emerald-900/50 text-emerald-300"
            : label === "Medium Trust" ? "bg-amber-900/50 text-amber-300"
            : "bg-red-900/50 text-red-300";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}
