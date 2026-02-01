"use client";

import { useCommunityFilters } from "@/hooks/use-community-filters";
import { Pagination } from "../pagination";
import { UserCard } from "./user-card";

type CommunityViewClientProps = {
  data: {
    users: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
      username: string | null;
    }[];
    metadata: {
      hasPrevPage: boolean;
      hasNextPage: boolean;
      totalPages: number;
    };
  } | null;
};

export const CommunityViewClient = ({ data }: CommunityViewClientProps) => {
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
        {(data?.users ?? []).map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <Pagination
        hasNextPage={data?.metadata.hasNextPage ?? false}
        hasPrevPage={data?.metadata.hasPrevPage ?? false}
        totalPages={data?.metadata.totalPages || 1}
        currentPage={filters.page}
        handlePagination={handlePagination}
      />
    </div>
  );
};
