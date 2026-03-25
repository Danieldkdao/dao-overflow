"use client";

import { useHomeFilters } from "@/hooks/use-home-filters";
import type { GetQuestionsOutputType } from "@/lib/actions/question.action";
import { Pagination } from "../pagination";
import { QuestionsListClient } from "../questions/questions-list-client";

export const HomeViewClient = ({ data }: { data: GetQuestionsOutputType }) => {
  const [filters, setFilters] = useHomeFilters();

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
      <QuestionsListClient questions={data?.questions} />
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
