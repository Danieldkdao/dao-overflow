"use client";

import { Pagination } from "../pagination";
import { QuestionsListClient } from "../questions/questions-list-client";
import { useQuestionFilters } from "@/hooks/use-question-filters";
import { GetCollectionActionOutputType } from "@/lib/actions/collections.action";

export const CollectionsViewClient = ({
  data,
}: {
  data: GetCollectionActionOutputType;
}) => {
  const [filters, setFilters] = useQuestionFilters();

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
