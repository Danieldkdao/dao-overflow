import { CollectionsView } from "@/components/collections/collections-view";
import { SearchParams } from "nuqs";

const CollectionsPage = async (props: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Saved Questions</h1>
      <CollectionsView {...props} />
    </div>
  );
};

export default CollectionsPage;
