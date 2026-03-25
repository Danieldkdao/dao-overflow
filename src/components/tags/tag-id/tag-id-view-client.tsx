"use client";

import { Pagination } from "@/components/pagination";
import { QuestionsListClient } from "@/components/questions/questions-list-client";
import { useTagIdFilters } from "@/hooks/use-tag-id-filters";
import { GetTagQuestionsOutputType } from "@/lib/actions/tags.action";

export const TagIdViewClient = ({
  data,
}: {
  data: GetTagQuestionsOutputType;
}) => {
  const [filters, setFilters] = useTagIdFilters();

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
      <QuestionsListClient data={data} />
      {data && data.metadata.totalPages !== 0 && (
        <Pagination
          currentPage={filters.page}
          hasNextPage={data.metadata.hasNextPage}
          hasPrevPage={data.metadata.hasPrevPage}
          totalPages={data.metadata.totalPages}
          handlePagination={handlePagination}
        />
      )}
    </div>
  );
};
