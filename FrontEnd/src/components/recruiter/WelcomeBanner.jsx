import {
  BadgeCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  return (
    <div className="mx-8 mt-8">

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-10 shadow-2xl">

        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">

          {/* Left Side */}
          <div>

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">

                <Sparkles
                  size={28}
                  className="text-white"
                />

              </div>

              <div>

                <p className="text-white/80 text-sm uppercase tracking-wide">
                  AI Recruitment Platform
                </p>

                <h1 className="text-4xl md:text-5xl font-bold text-white mt-1">
                  Welcome back,
                  {" "}
                  {user?.name || "Recruiter"} 👋
                </h1>

              </div>

            </div>

            <p className="text-lg text-white/80 max-w-3xl leading-relaxed">
              Manage job postings, review applicants, and monitor recruiter credibility
              using an AI-powered trust assessment system. Track recruiter performance,
              review applications, and maintain a reliable hiring platform.
            </p>

          </div>

          {/* Right Side */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">

                <BadgeCheck
                  size={30}
                  className="text-white"
                />

              </div>

              <div>

                <h3 className="text-xl font-bold text-white">
                  Verified Recruiter
                </h3>

                <p className="text-white/80 text-sm">
                  Trusted by AI Verification
                </p>

                <div className="flex items-center gap-2 mt-2 text-green-300">

                  <ShieldCheck size={16} />

                  <span className="text-sm font-medium">
                    Active & Trusted
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}