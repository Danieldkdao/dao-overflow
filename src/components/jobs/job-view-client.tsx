"use client";

import { useJobFilters } from "@/hooks/use-job-filters";
import { Job } from "@/lib/types";
import { EmptyState } from "../empty-state";
import { Pagination } from "../pagination";
import { JobCard } from "./job-card";

export const JobViewClient = ({ jobs }: { jobs: Job[] }) => {
  const [filters, setFilters] = useJobFilters();

  const handlePagination = (dir: "prev" | "next") => {
    if (dir === "prev" && filters.page > 1) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
    if (dir === "next" && jobs.length === 10) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            description="Looks like we couldn't find any jobs that match your selected
          filters. Clear the filters or try something else."
          />
        ) : (
          jobs.map((job) => (
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
          ))
        )}
      </div>
      <Pagination
        hasPrevPage={filters.page > 1}
        hasNextPage={jobs.length === 10}
        currentPage={filters.page ?? 1}
        totalPages={0}
        handlePagination={handlePagination}
      />
    </div>
  );
};
