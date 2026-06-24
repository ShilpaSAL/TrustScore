
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-slate-400 text-sm mb-6">Sign in to your account</p>
        {error && <div className="mb-4 p-3 bg-red-900/40 text-red-300 rounded-lg text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          {[["email","Email","email"],["password","Password","password"]].map(([id,label,type]) => (
            <div key={id}>
              <label className="text-xs font-medium text-slate-400 block mb-1">{label}</label>
              <input type={type} required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                value={form[id]} onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-slate-500 text-center mt-4">
          No account? <Link to="/register" className="text-indigo-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
export default Login;