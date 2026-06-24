import { useState as useState2 } from "react";
import { Link as Link2, useNavigate as useNavigate2 } from "react-router-dom";
import { useAuth as useAuth2 } from "../context/AuthContext";

export function Register() {
  const { register } = useAuth2();
  const navigate = useNavigate2();

  const [form, setForm] = useState2({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [error, setError] = useState2("");
  const [loading, setLoading] = useState2(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">

        <h2 className="text-2xl font-bold text-white mb-1">
          Create Account
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          Start assessing recruiter credibility
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/40 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Full Name
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Email
            </label>

            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  email: e.target.value,
                }))
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Password
            </label>

            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  password: e.target.value,
                }))
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Select Role
            </label>

            <select
              value={form.role}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  role: e.target.value,
                }))
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-4">
          Have account?{" "}
          <Link2
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Sign In
          </Link2>
        </p>
      </div>
    </div>
  );
}

export default Register;