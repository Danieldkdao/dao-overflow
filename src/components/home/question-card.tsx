import { GetQuestionsOutputType } from "@/lib/actions/question.action";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageCircleIcon, ThumbsUpIcon } from "lucide-react";

export const QuestionCard = ({
  question,
}: {
  question: NonNullable<
    NonNullable<GetQuestionsOutputType>["questions"][number]
  >;
}) => {
  return (
    <Link href={`/question/${question.id}`}>
      <div className="bg-card rounded-lg p-6 border space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{question.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {question.tags.map((t) => (
              <div
                key={t.id}
                className="bg-sidebar rounded-md p-2 text-xs text-muted-foreground"
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center flex-wrap gap-1">
            <UserAvatar
              name={question.user.name}
              image={question.user.image}
              className="size-6"
              textSize="text-xs"
            />
            <span className="text-sm font-medium">
              {question.user.name} ● asked{" "}
              {formatDistanceToNow(question.createdAt, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUpIcon className="size-4" />
              <span className="text-sm">{question.voteCount} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircleIcon className="size-4" />
              <span className="text-sm">{question.answerCount} answers</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUpIcon className="size-4" />
              <span className="text-sm">{0} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
