import { getJobs } from "@/lib/actions/job.action";
import { Suspense } from "react";
import { data } from "./temp-data";
import { JobCard } from "./job-card";

export const JobsView = () => {
  return (
    <Suspense fallback={<JobsViewLoading />}>
      <JobsViewSuspense />
    </Suspense>
  );
};

const JobsViewLoading = () => {
  return <div></div>;
};

const JobsViewSuspense = async () => {
  // const jobs = await getJobs({
  //   query: "Developer jobs in Washington",
  //   page: 1,
  // });

  return (
    <div className="space-y-2">
      {data.map((job) => (
        <JobCard
          key={job.job_id}
          jobTitle={job.job_title}
          employerLogo={job.employer_logo}
          employerWebsite={job.employer_website}
          jobApplyLink={job.job_apply_link}
          jobDescription={job.job_description}
          jobEmploymentType={
            job.job_employment_types.length &&
            job.job_employment_types.length > 0
              ? job.job_employment_types[0]
              : "UNKNOWN"
          }
          jobCity={job.job_city}
          jobCountry={job.job_country}
          jobState={job.job_state}
          qualifications={job.job_highlights?.Qualifications}
          responsibilities={job.job_highlights.Responsibilities}
        />
      ))}
    </div>
  );
};
