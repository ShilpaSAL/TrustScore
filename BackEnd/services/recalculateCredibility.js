const axios = require("axios");

const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");

const FLASK_URL =
  process.env.FLASK_URL || "http://127.0.0.1:5001";

// ============================================================
// Recalculate Recruiter Credibility
// ============================================================

const recalculateCredibility = async (recruiterId) => {
  try {
    // Get company profile
    const company = await Company.findOne({
      userId: recruiterId,
    });

    // Recruiter may not have created a company profile yet
    if (!company) {
      console.log(
        "Credibility calculation skipped: Company profile not found."
      );
      return null;
    }

    // Get recruiter jobs and applications
    const [jobs, applications] = await Promise.all([
      Job.find({
        recruiterId,
      }),

      Application.find({
        recruiterId,
      }),
    ]);

    // ========================================================
    // 1. Number of Jobs Posted
    // ========================================================

    const number_of_jobs_posted = jobs.length;

    // ========================================================
    // 2. Average Job Description Length
    // ========================================================

    const avg_job_description_length =
      jobs.length === 0
        ? 0
        : Math.round(
            jobs.reduce(
              (total, job) =>
                total +
                (job.jobDescription || "").length,
              0
            ) / jobs.length
          );

    // ========================================================
    // 3. Job Posting Frequency
    // ========================================================

    let job_posting_frequency = 0;

    if (jobs.length === 1) {
      job_posting_frequency = 1;
    }

    if (jobs.length > 1) {
      const dates = jobs
        .map((job) => new Date(job.createdAt))
        .sort((a, b) => a - b);

      const oldestJob = dates[0];

      const daysSinceFirstJob = Math.max(
        (Date.now() - oldestJob.getTime()) /
          (1000 * 60 * 60 * 24),
        1
      );

      const months = Math.max(
        daysSinceFirstJob / 30,
        1
      );

      job_posting_frequency = Number(
        (jobs.length / months).toFixed(2)
      );
    }

    // ========================================================
    // 4. Approval Rate
    // Stored as 0 to 1 because ML training uses this range
    // ========================================================

    const totalApplications = applications.length;

    const acceptedApplications =
      applications.filter(
        (application) =>
          application.status === "Accepted"
      ).length;

    const approval_rate =
      totalApplications === 0
        ? 0
        : Number(
            (
              acceptedApplications /
              totalApplications
            ).toFixed(4)
          );

    // ========================================================
    // 5. Average Response Time
    // ========================================================

    const respondedApplications =
      applications.filter(
        (application) =>
          application.respondedAt
      );

    let response_time_hours = 24;

    if (respondedApplications.length > 0) {
      const totalResponseHours =
        respondedApplications.reduce(
          (total, application) => {
            const responseHours =
              (new Date(
                application.respondedAt
              ) -
                new Date(
                  application.createdAt
                )) /
              (1000 * 60 * 60);

            return (
              total +
              Math.max(responseHours, 0)
            );
          },
          0
        );

      response_time_hours = Number(
        (
          totalResponseHours /
          respondedApplications.length
        ).toFixed(2)
      );
    }

    // ========================================================
    // 6. Prepare ML Input
    // ========================================================

    const mlInput = {
      number_of_jobs_posted,

      avg_job_description_length,

      company_logo_present:
        company.company_logo_present ?? 0,

      response_time_hours,

      job_posting_frequency,

      complaints_count:
        company.complaints_count ?? 0,

      approval_rate,
    };

    console.log(
      "Recalculating recruiter credibility:",
      mlInput
    );

    // ========================================================
    // 7. Call Flask ML API
    // ========================================================

    const { data } = await axios.post(
      `${FLASK_URL}/predict`,
      mlInput
    );

    // ========================================================
    // 8. Update Company
    // ========================================================

    company.number_of_jobs_posted =
      number_of_jobs_posted;

    company.avg_job_description_length =
      avg_job_description_length;

    company.response_time_hours =
      response_time_hours;

    company.job_posting_frequency =
      job_posting_frequency;

    company.approval_rate =
      approval_rate;

    company.trustLabel =
      data.trust_label;

    company.confidenceScore =
      data.confidence_score;

    await company.save();

    console.log(
      `Credibility updated: ${data.trust_label} (${data.confidence_score}% confidence)`
    );

    return company;
  } catch (error) {
    console.error(
      "Credibility recalculation error:",
      error.response?.data ||
        error.message
    );

    // Do not crash job/application operations
    return null;
  }
};

module.exports = recalculateCredibility;