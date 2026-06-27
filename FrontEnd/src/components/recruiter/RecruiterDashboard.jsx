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

  useEffect(() => {
    Promise.all([
      api.get("/company"),
      api.get("/job"),
      api.get("/application/recruiter"),
    ])
      .then(([companyRes, jobsRes, appRes]) => {
        setCompany(companyRes.data);
        setJobs(jobsRes.data);
        setApplications(appRes.data);
      })
      .catch(console.error);
  }, []);

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
    </div >
  );
}