import { GetQuestionsOutputType } from "@/lib/actions/question.action";
import { QuestionCard } from "../home/question-card";
import { EmptyState } from "../empty-state";

export const QuestionsListClient = ({
  data,
}: {
  data: GetQuestionsOutputType;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {data?.questions.length ? (
        data.questions.map((q) => <QuestionCard key={q.id} question={q} />)
      ) : (
        <EmptyState
          title="No questions found"
          description="We couldn't find any questions that match the applied filters. Try refreshing the page or adjusting your search."
        />
      )}
    </div>
  );
};
