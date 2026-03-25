import { GetQuestionsOutputType } from "@/lib/actions/question.action";
import { QuestionCard } from "../home/question-card";
import { EmptyState } from "../empty-state";

export const QuestionsListClient = ({
  questions,
  truncateTitles = false,
  showControls = false,
}: {
  questions:
    | NonNullable<GetQuestionsOutputType>["questions"]
    | null
    | undefined;
  truncateTitles?: boolean;
  showControls?: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {questions?.length ? (
        questions.map((q) => (
          <QuestionCard
            key={q.id}
            showControls={showControls}
            truncateTitle={truncateTitles}
            question={q}
          />
        ))
      ) : (
        <EmptyState
          title="No questions found"
          description="We couldn't find any questions that match the applied filters. Try refreshing the page or adjusting your search."
        />
      )}
    </div>
  );
};
