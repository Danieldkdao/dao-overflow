import { GetUserProfileOutputType } from "@/lib/actions/user.action";
import { AnswerCard } from "./answer-card";
import { EmptyState } from "../empty-state";

export const AnswersList = ({
  answers,
  showControls = false,
}: {
  answers: GetUserProfileOutputType["topAnswers"];
  showControls?: boolean;
}) => {
  return (
    <div className="w-full space-y-4">
      {answers.length ? (
        answers.map((a) => (
          <AnswerCard key={a.id} showControls={showControls} answer={a} />
        ))
      ) : (
        <EmptyState
          title="No answers found"
          description="Looks like this user hasn't been very active! If this is you, you can start by answering some questions."
        />
      )}
    </div>
  );
};
