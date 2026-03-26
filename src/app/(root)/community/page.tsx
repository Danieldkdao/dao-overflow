import { CommunityView } from "@/components/community/community-view";
import { SearchParams } from "nuqs";

const CommunityPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">All Users</h1>
      <CommunityView searchParams={searchParams} />
    </div>
  );
};

export default CommunityPage;
