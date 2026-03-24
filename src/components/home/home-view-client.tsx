"use client";

import { useHomeFilters } from "@/hooks/use-home-filters";
import { Pagination } from "../pagination";
import { QuestionCard } from "./question-card";
import type { GetQuestionsOutputType } from "@/lib/actions/question.action";
import { EmptyState } from "../empty-state";

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
      <div className="grid grid-cols-1 gap-2">
        {data?.questions.length ? (
          data.questions.map((q) => <QuestionCard key={q.id} question={q} />)
        ) : (
          <EmptyState
            title="No questions found"
            description="We couldn't find any questions that match the applied filters. Try refreshing the page or adjusting your search."
          />
        )}
      </div>
      {data && (
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
