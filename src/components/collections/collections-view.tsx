import { getCollectionAction } from "@/lib/actions/collections.action";
import { loadSearchParams } from "@/lib/params/question-params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { CollectionsViewClient } from "./collections-view-client";
import { SuspenseErrorBoundary } from "../suspense-error-boundary";

type CollectionsViewProps = {
  searchParams: Promise<SearchParams>;
};

export const CollectionsView = (props: CollectionsViewProps) => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't load saved questions"
      description="Your collections depend on your saved-question query and the active filters. That request did not complete successfully."
    >
      <Suspense fallback={<CollectionsLoading />}>
        <CollectionsSuspense {...props} />
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

const CollectionsLoading = () => {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`collection-question-skeleton-${index}`}
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

const CollectionsSuspense = async ({ searchParams }: CollectionsViewProps) => {
  const filters = await loadSearchParams(searchParams);
  const data = await getCollectionAction(filters);

  return <CollectionsViewClient data={data} />;
};
