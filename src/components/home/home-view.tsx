import { getQuestions } from "@/lib/actions/question.action";
import { loadSearchParams } from "@/lib/params/home-params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { HomeViewClient } from "./home-view-client";
import { HomeFilters } from "./home-filters";
import { Skeleton } from "../ui/skeleton";

export const HomeView = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <Suspense fallback={<HomeViewLoading />}>
      <HomeFilters />
      <HomeViewSuspense searchParams={searchParams} />
    </Suspense>
  );
};

const HomeViewLoading = () => {
  return (
    <div className="w-full space-y-4">
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
  return <HomeViewClient data={data} />;
};
