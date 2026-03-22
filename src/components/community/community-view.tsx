import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { loadSearchParams } from "../../lib/params/community-params";
import { fetchUsers } from "@/lib/actions/user.action";
import { CommunityFilters } from "./community-filters";
import { CommunityViewClient } from "./community-view-client";
import { Skeleton } from "@/components/ui/skeleton";

export const CommunityView = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <Suspense fallback={<CommunityViewSkeleton />}>
      <CommunityFilters />
      <CommunityViewSuspense searchParams={searchParams} />
    </Suspense>
  );
};

const CommunityViewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={`community-skeleton-${index}`}
          className="p-6 rounded-xl border flex flex-col items-center gap-2 w-full max-w-full"
        >
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};

const CommunityViewSuspense = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const filters = await loadSearchParams(searchParams);
  const data = await fetchUsers(filters.page, filters.query, filters.filter);

  return <CommunityViewClient data={data} />;
};
