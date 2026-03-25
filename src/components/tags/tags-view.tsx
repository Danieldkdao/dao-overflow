import { getTags } from "@/lib/actions/tags.action";
import { loadSearchParams } from "@/lib/params/tag-params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { TagsViewClient } from "./tags-view-client";

type TagsViewProps = {
  searchParams: Promise<SearchParams>;
};

export const TagsView = (props: TagsViewProps) => {
  return (
    <Suspense fallback={<TagsLoading />}>
      <TagsSuspense {...props} />
    </Suspense>
  );
};

const TagsLoading = () => {
  return <div>loading...</div>;
};

const TagsSuspense = async ({ searchParams }: TagsViewProps) => {
  const filters = await loadSearchParams(searchParams);
  const data = await getTags(filters);

  return <TagsViewClient data={data} />;
};
