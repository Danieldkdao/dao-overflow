import { getCountries, getJobs, getLocation } from "@/lib/actions/job.action";
import { Suspense } from "react";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "../../lib/params/job-params";
import { JobFilters } from "./job-filters";
import { JobViewClient } from "./job-view-client";
import { Job } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, MapPinIcon, ChevronDownIcon } from "lucide-react";
import { SuspenseErrorBoundary } from "@/components/suspense-error-boundary";

export const JobsView = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't load job listings"
      description="The job search, country list, or location lookup failed. One of the external jobs requests may be unavailable right now."
    >
      <Suspense fallback={<JobsViewLoading />}>
        <JobsViewSuspense searchParams={searchParams} />
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

const JobsViewLoading = () => {
  return (
    <div>
      <div className="flex gap-4 mb-8">
        <div className="hidden md:flex px-2 py-1 dark:bg-input/40 rounded-lg items-center flex-1">
          <SearchIcon className="text-muted-foreground" />
          <div className="h-9 w-full min-w-0 px-3 py-1 flex items-center"></div>
        </div>
        <div className="border-input flex h-11 w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs">
          <MapPinIcon className="size-4 text-muted-foreground shrink-0" />
          <Skeleton className="h-4 w-24" />
          <ChevronDownIcon className="size-4 opacity-50 shrink-0 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`job-skeleton-${index}`}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card"
            >
              <Skeleton className="size-[60px] rounded-lg" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="space-y-1">
                  <Skeleton className="h-7 w-2/3" />
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const JobsViewSuspense = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const filters = await loadSearchParams(searchParams);
  const location = await getLocation();
  const jobs: Job[] = await getJobs({
    query:
      `${filters.query}, ${filters.country}` || `Developer jobs in ${location}`,
    page: filters.page ?? 1,
  });
  const countries = await getCountries();

  return (
    <div>
      <JobFilters
        countries={
          countries?.map(
            (country: { name: { common: string } }) => country.name.common,
          ) ?? []
        }
      />
      <JobViewClient jobs={jobs} />
    </div>
  );
};
