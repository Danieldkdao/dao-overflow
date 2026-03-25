import { getTagQuestions } from "@/lib/actions/tags.action";
import { loadSearchParams } from "@/lib/params/tag-id-params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { TagIdViewClient } from "./tag-id-view-client";
import { TagIdFilters } from "./tag-id-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";

type TagIdViewProps = {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<SearchParams>;
};

export const TagIdView = (props: TagIdViewProps) => {
  return (
    <Suspense fallback={<TagIdLoading />}>
      <TagIdSuspense {...props} />
    </Suspense>
  );
};

const TagIdLoading = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`tag-question-skeleton-${index}`}
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
      </div>
    </div>
  );
};

const TagIdSuspense = async ({ params, searchParams }: TagIdViewProps) => {
  const { tagId } = await params;
  const filters = await loadSearchParams(searchParams);
  const data = await getTagQuestions({ tagId, ...filters });

  if (!data) {
    return (
      <EmptyState
        title="Tag Not Found"
        description="The tag you are looking for does not exist or has been removed."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{data.tag.name}</h1>
      <TagIdFilters tagName={data.tag.name} />
      <TagIdViewClient data={data} />
    </div>
  );
};
