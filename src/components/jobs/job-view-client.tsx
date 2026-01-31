"use client";

import { useJobFilters } from "@/hooks/use-job-filters";
import { JobCard } from "./job-card";
import { Job } from "@/lib/types";
import { Pagination } from "../pagination";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const JobViewClient = ({ jobs }: { jobs: Job[] }) => {
  const [filters, setFilters] = useJobFilters();
  const router = useRouter();

  const handlePagination = (dir: "prev" | "next") => {
    if (dir === "prev" && filters.page > 1) {
      setFilters({ ...filters, page: filters.page - 1 });
      router.refresh();
    }
    if (dir === "next" && jobs.length === 10) {
      setFilters({ ...filters, page: filters.page + 1 });
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {jobs.length === 0 ? (
          <JobEmpty />
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

const JobEmpty = () => {
  return (
    <div className="w-full p-5 rounded-xl border border-dashed bg-card flex flex-col items-center gap-2">
      <Image
        src="/images/dark-illustration.png"
        alt="Dark illustration image"
        width={200}
        height={150}
      />
      <h1 className="text-xl font-bold text-center">No jobs found</h1>
      <p className="text-muted-foreground text-sm text-center max-w-100">
        Looks like we couldn&apos;t find any jobs that match your selected
        filters. Clear the filters or try something else.
      </p>
    </div>
  );
};
