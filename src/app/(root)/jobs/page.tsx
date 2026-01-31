import { CustomSelect } from "@/components/custom-select";
import { JobsView } from "@/components/jobs/jobs-view";
import { SearchInput } from "@/components/search-input";
import { MapPin } from "lucide-react";

const JobsPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">Jobs</h1>
      <p className="text-sm">Click on each job for more information</p>
      <div className="flex gap-4 mb-4">
        <SearchInput placeholder="Job title, company, or keywords" />
        <CustomSelect text="Select location" icon={MapPin} options={[]} />
      </div>
      <JobsView />
    </div>
  );
};

export default JobsPage;
