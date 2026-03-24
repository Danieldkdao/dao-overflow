"use client";

import { GetQuestionAnswersOutputType } from "@/lib/actions/question.action";
import { QuestionIdAnswersFilters } from "./question-id-answers-filters";
import { EmptyState } from "@/components/empty-state";
import { AnswerSubmission } from "./answer-submission";
import { QuestionAnswer } from "./question-answer";
import { Pagination } from "@/components/pagination";
import { useQuestionIdFilters } from "@/hooks/use-question-id-filters";
import { PAGE_SIZE } from "@/lib/constants";

export const QuestionIdAnswers = ({
  questionId,
  data,
}: {
  questionId: string;
  data: NonNullable<GetQuestionAnswersOutputType>;
}) => {
  const [filters, setFilters] = useQuestionIdFilters();
  const answers = data.answers;
  const metadata = data.metadata;

  const handlePagination = (dir: "next" | "prev") => {
    if (dir === "prev" && metadata.hasPrevPage) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
    if (dir === "next" && metadata.hasNextPage) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  return (
    <div className="space-y-12">
      {answers.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-xl font-medium text-primary">
              {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
            </h2>
            <QuestionIdAnswersFilters />
          </div>
        </div>
      ) : (
        <EmptyState
          title="No answers posted yet"
          description="Looks like no one has answered this question yet. Be the first to share your insights!"
        />
      )}
      {answers.map((a) => (
        <QuestionAnswer key={a.id} answer={a} />
      ))}
      {answers.length > PAGE_SIZE && (
        <Pagination
          currentPage={filters.page}
          handlePagination={handlePagination}
          {...metadata}
        />
      )}
      <AnswerSubmission questionId={questionId} />
    </div>
  );
};
