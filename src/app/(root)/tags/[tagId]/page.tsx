import { TagIdView } from "@/components/tags/tag-id/tag-id-view";
import { SearchParams } from "nuqs";

const TagIdPage = (props: {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  return <TagIdView {...props} />;
};

export default TagIdPage;
