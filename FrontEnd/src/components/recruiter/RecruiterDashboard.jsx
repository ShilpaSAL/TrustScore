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
        setLoading(true);

        // Load independently so one failed request
        // does not prevent the other data from loading.
        const [
          companyResult,
          jobsResult,
          applicationsResult,
        ] = await Promise.allSettled([
          api.get("/company"),
          api.get("/job"),
          api.get("/application/recruiter"),
        ]);

        // Company profile
        if (companyResult.status === "fulfilled") {
          setCompany(companyResult.value.data);
        } else {
          setCompany(null);

          if (
            companyResult.reason?.response?.status !== 404
          ) {
            console.error(
              "Company loading error:",
              companyResult.reason
            );
          }
        }

        // Recruiter jobs
        if (jobsResult.status === "fulfilled") {
          setJobs(
            Array.isArray(jobsResult.value.data)
              ? jobsResult.value.data
              : []
          );
        } else {
          setJobs([]);
        }

        // Applications
        if (
          applicationsResult.status === "fulfilled"
        ) {
          setApplications(
            Array.isArray(
              applicationsResult.value.data
            )
              ? applicationsResult.value.data
              : []
          );
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error(
          "Recruiter dashboard error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-white text-lg font-semibold">
            Loading Recruiter Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
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