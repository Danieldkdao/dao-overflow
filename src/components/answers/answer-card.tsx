import { GetUserProfileOutputType } from "@/lib/actions/user.action";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { ThumbsUpIcon } from "lucide-react";
import { returnNumberAbbr } from "@/lib/utils";

export const AnswerCard = ({
  answer,
}: {
  answer: GetUserProfileOutputType["topAnswers"][number];
}) => {
  return (
    <div className="bg-card rounded-lg p-6 border space-y-4">
      <Link
        href={`/question/${answer.questionId}`}
        className="text-2xl font-bold line-clamp-1"
      >
        {answer.questionTitle}
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href={`/profile/${answer.id}`}>
          <div className="flex items-center flex-wrap gap-1">
            <UserAvatar
              name={answer.userName}
              image={answer.userImage}
              className="size-6"
              textSize="text-xs"
            />
            <span className="text-sm font-medium">
              {answer.userName} ● answered{" "}
              {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <ThumbsUpIcon className="size-4" />
          <span className="text-sm">
            {returnNumberAbbr(answer.voteCount)} votes
          </span>
        </div>
      </div>
    </div>
  );
};
