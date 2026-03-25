"use client";

import { GetUserProfileOutputType } from "@/lib/actions/user.action";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { returnNumberAbbr } from "@/lib/utils";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteAnswer } from "@/lib/actions/answers.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AnswerCard = ({
  answer,
  showControls = false,
}: {
  answer: GetUserProfileOutputType["topAnswers"][number];
  showControls?: boolean;
}) => {
  const router = useRouter();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete this answer? This action cannot be undone.",
  );

  const handleDeleteAnswer = async () => {
    const confirmation = await confirm();
    if (!confirmation) return;

    const response = await deleteAnswer(answer.id);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="bg-card rounded-lg p-6 border space-y-4">
        <div className="flex items-center gap-2 justify-between">
          <Link
            href={`/question/${answer.questionId}`}
            className="text-2xl font-bold line-clamp-1"
          >
            {answer.questionTitle}
          </Link>
          {showControls && (
            <Button variant="ghost" size="icon" onClick={handleDeleteAnswer}>
              <Trash2Icon className="text-red-500 dark:text-red-400" />
            </Button>
          )}
        </div>

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
    </>
  );
};
