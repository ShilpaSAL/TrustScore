import { BadgeCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  return (
    <div className="mx-8 mt-8 rounded-3xl overflow-hidden">

      <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-10 py-10">

        <div className="flex items-center justify-between">

          {/* Left */}

          <div>

            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">

                <Sparkles className="text-white" />

              </div>

              <div>

                <p className="text-green-100 text-sm">
                  AI Recruitment Platform
                </p>

                <h1 className="text-4xl font-bold text-white">
                  Welcome back, {user?.name}
                </h1>

              </div>

            </div>

            <p className="text-green-100 text-lg max-w-2xl">
              Manage job postings, review applicants and monitor recruiter credibility using AI-powered trust analysis.
            </p>

          </div>

          {/* Right */}

          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-5">

            <div className="flex items-center gap-3">

              <BadgeCheck
                className="text-white"
                size={28}
              />

              <div>

                <h3 className="text-white font-bold text-lg">
                  Verified Recruiter
                </h3>

                <p className="text-green-100 text-sm">
                  Trusted by AI Verification
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}