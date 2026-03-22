import { JobsView } from "@/components/jobs/jobs-view";
import type { SearchParams } from "nuqs";

const JobsPage = ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <p className="text-sm">Click on each job for more information</p>
      <JobsView searchParams={searchParams} />
    </div>
  );
};

export default JobsPage;
