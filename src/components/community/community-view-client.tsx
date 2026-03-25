"use client";

import { useCommunityFilters } from "@/hooks/use-community-filters";
import { Pagination } from "../pagination";
import { UserCard } from "./user-card";
import { GetUsersOutput } from "@/lib/actions/user.action";
import { EmptyState } from "../empty-state";

export const CommunityViewClient = ({ data }: { data: GetUsersOutput }) => {
  const [filters, setFilters] = useCommunityFilters();

  const handlePagination = (dir: "prev" | "next") => {
    if (dir === "next" && data?.metadata.hasNextPage) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
    if (dir === "prev" && data?.metadata.hasPrevPage) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.users.length ? (
          data.users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <EmptyState
            title="No users found"
            description="We weren't able to find any users that match the selected filters. Try refreshing the page or select different filters."
          />
        )}
      </div>
      {data && (
        <Pagination
          hasNextPage={data.metadata.hasNextPage}
          hasPrevPage={data.metadata.hasPrevPage}
          totalPages={data.metadata.totalPages}
          currentPage={filters.page}
          handlePagination={handlePagination}
        />
      )}
    </div>
  );
};
