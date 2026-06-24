// ══════════════════════════════════════════════════════════════
//  src/pages/Home.jsx
// ══════════════════════════════════════════════════════════════
import { Link } from "react-router-dom";
import { BrainCircuit, ShieldCheck, BarChart2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-2xl">
        <BrainCircuit size={36} className="text-white" />
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-3">
        Recruiter Credibility<br />
        <span className="text-indigo-400">Assessment System</span>
      </h1>
      <p className="text-slate-400 max-w-lg mb-10">
        Leverage Random Forest ML to evaluate recruiter trustworthiness and
        classify them as High Trust, Medium Trust, or Low Trust.
      </p>
      <div className="flex gap-4 mb-14">
        <Link to="/register" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg">
          Get Started
        </Link>
        <Link to="/login" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors">
          Sign In
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-6 max-w-2xl">
        {[
          { icon: BrainCircuit, title: "ML-Powered",  desc: "Random Forest model with ~90%+ accuracy" },
          { icon: ShieldCheck,  title: "Trust Labels", desc: "High / Medium / Low with confidence scores" },
          { icon: BarChart2,    title: "Analytics",    desc: "Track prediction history and patterns" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
            <Icon size={22} className="text-indigo-400 mb-2" />
            <p className="font-semibold text-sm text-slate-100">{title}</p>
            <p className="text-xs text-slate-400 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}