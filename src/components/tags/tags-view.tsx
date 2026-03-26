import { getTags } from "@/lib/actions/tags.action";
import { loadSearchParams } from "@/lib/params/tag-params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { TagsViewClient } from "./tags-view-client";
import { Skeleton } from "@/components/ui/skeleton";
import { SuspenseErrorBoundary } from "@/components/suspense-error-boundary";
import { TagsFilters } from "./tags-filters";

type TagsViewProps = {
  searchParams: Promise<SearchParams>;
};

export const TagsView = (props: TagsViewProps) => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't load tags"
      description="The tag directory failed to load. Filtering or the tags query did not complete successfully."
    >
      <Suspense fallback={<TagsLoading />}>
        <TagsSuspense {...props} />
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

const TagsLoading = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full sm:w-44 rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-5 space-y-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
};

const TagsSuspense = async ({ searchParams }: TagsViewProps) => {
  const filters = await loadSearchParams(searchParams);
  const data = await getTags(filters);

  return (
    <div>
      <TagsFilters />
      <TagsViewClient data={data} />
    </div>
  );
};
