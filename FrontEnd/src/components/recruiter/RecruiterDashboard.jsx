import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import DashboardHeader from "./DashboardHeader";
import WelcomeBanner from "./WelcomeBanner";
import StatsCards from "./StatsCards";
import TrustScoreCard from "./TrustScoreCard";
import RecentApplicants from "./RecentApplicants";

export default function RecruiterDashboard() {
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [companyRes, jobsRes, appRes] = await Promise.all([
          api.get("/company"),
          api.get("/job"),
          api.get("/application/recruiter"),
        ]);

        setCompany(companyRes.data);
        setJobs(jobsRes.data);
        setApplications(appRes.data);
      } catch (error) {
        console.error("Error loading recruiter dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">
            Loading Recruiter Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <DashboardHeader />

      <WelcomeBanner />

      <StatsCards
        company={company}
        jobs={jobs}
        applications={applications}
      />

      <TrustScoreCard
        company={company}
        applications={applications}
      />

      <RecentApplicants
        applications={applications}
      />
    </div>
  );
}