import { getQuestions } from "@/lib/actions/question.action";
import { loadSearchParams } from "@/lib/params/home-params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { HomeViewClient } from "./home-view-client";
import { SuspenseErrorBoundary } from "../suspense-error-boundary";
import { HomeFilters } from "./home-filters";

export const HomeView = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't load the home feed"
      description="Fetching questions or applying the current filters failed. The feed query may have timed out or the search params may be invalid."
    >
      <Suspense fallback={<HomeViewLoading />}>
        <HomeViewSuspense searchParams={searchParams} />
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

const HomeViewLoading = () => {
  return (
    <div className="w-full space-y-4">
      <div className="my-8 space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`home-filters-skeleton-${index}`}
              className="h-10 w-24 rounded-lg"
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`home-question-skeleton-${index}`}
            className="bg-card rounded-lg p-6 border space-y-4"
          >
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-14 rounded-md" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-4 w-52" />
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

const HomeViewSuspense = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const filters = await loadSearchParams(searchParams);
  const data = await getQuestions(filters);
  return (
    <div>
      <HomeFilters />
      <HomeViewClient data={data} />
    </div>
  );
};
