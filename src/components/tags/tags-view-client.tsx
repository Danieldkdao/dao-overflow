"use client";

import { GetTagsOutputType } from "@/lib/actions/tags.action";
import { TagCard } from "./tag-card";
import { EmptyState } from "../empty-state";
import { Pagination } from "../pagination";
import { useTagFilters } from "@/hooks/use-tag-filters";

export const TagsViewClient = ({ data }: { data: GetTagsOutputType }) => {
  const [filters, setFilters] = useTagFilters();
  const tags = data?.tags;
  const metadata = data?.metadata;

  const handlePagination = (dir: "next" | "prev") => {
    if (dir === "prev" && metadata.hasPrevPage) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
    if (dir === "next" && metadata.hasNextPage) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {tags.length ? (
          tags.map((tag) => <TagCard tag={tag} />)
        ) : (
          <EmptyState
            title="No tags found"
            description="We weren't able to find any tags that match the selected filters. Try refreshing the page or select different filters."
          />
        )}
      </div>
      {metadata && metadata.totalPages !== 0 && (
        <Pagination
          currentPage={filters.page}
          handlePagination={handlePagination}
          {...metadata}
        />
      )}
    </div>
  );
};
