import { TagsView } from "@/components/tags/tags-view";
import { SearchParams } from "nuqs";

const TagsPage = async (props: { searchParams: Promise<SearchParams> }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Tags</h1>
      <TagsView {...props} />
    </div>
  );
};

export default TagsPage;
