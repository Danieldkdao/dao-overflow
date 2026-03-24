import { GetQuestionsOutputType } from "@/lib/actions/question.action";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageCircleIcon, ThumbsUpIcon } from "lucide-react";
import { useMemo } from "react";
import { returnNumberAbbr } from "@/lib/utils";

export const QuestionCard = ({
  question,
}: {
  question: NonNullable<
    NonNullable<GetQuestionsOutputType>["questions"][number]
  >;
}) => {
  const formattedVoteCount = useMemo(() => {
    return returnNumberAbbr(question.voteCount);
  }, [question.voteCount]);
  const formattedAnswerCount = useMemo(() => {
    return returnNumberAbbr(question.answerCount);
  }, [question.answerCount]);
  const formattedViewCount = useMemo(() => {
    return returnNumberAbbr(question.views);
  }, [question.views]);

  return (
    <div className="bg-card rounded-lg p-6 border space-y-4">
      <div className="flex flex-col gap-2">
        <Link href={`/question/${question.id}`} className="text-2xl font-bold">
          {question.title}
        </Link>
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

      <div className="flex flex-col gap-2">
        <Link href={`/profile/${question.user.id}`}>
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
        </Link>

        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUpIcon className="size-4" />
            <span className="text-sm">{formattedVoteCount} votes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon className="size-4" />
            <span className="text-sm">{formattedAnswerCount} answers</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUpIcon className="size-4" />
            <span className="text-sm">{formattedViewCount} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};
