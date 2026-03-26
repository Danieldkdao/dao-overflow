"use client";

import {
  deleteQuestion,
  GetQuestionsOutputType,
} from "@/lib/actions/question.action";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { formatDistanceToNow } from "date-fns";
import {
  EditIcon,
  EyeIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo } from "react";
import { cn, returnNumberAbbr } from "@/lib/utils";
import { Tag } from "../tags/tag";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const QuestionCard = ({
  question,
  truncateTitle = false,
  showControls = false,
}: {
  question: NonNullable<
    NonNullable<GetQuestionsOutputType>["questions"][number]
  >;
  truncateTitle?: boolean;
  showControls?: boolean;
}) => {
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete this question? All data associated with this question will be permanently deleted.",
  );
  const router = useRouter();
  const formattedVoteCount = useMemo(() => {
    return returnNumberAbbr(question.voteCount);
  }, [question.voteCount]);
  const formattedAnswerCount = useMemo(() => {
    return returnNumberAbbr(question.answerCount);
  }, [question.answerCount]);
  const formattedViewCount = useMemo(() => {
    return returnNumberAbbr(question.views);
  }, [question.views]);

  const handleDeletion = async () => {
    const confirmation = await confirm();
    if (!confirmation) return;

    const response = await deleteQuestion(question.id);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <div>
      <ConfirmationDialog />
      <div className="bg-card rounded-lg p-6 border space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex-1 flex items-center gap-2">
            <Link
              href={`/question/${question.id}`}
              className={cn(
                "text-2xl font-bold",
                truncateTitle && "line-clamp-1",
              )}
            >
              {question.title}
            </Link>
            {showControls && (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/question/edit/${question.id}`}>
                      <Button variant="ghost" size="icon">
                        <EditIcon className="text-blue-500 dark:text-blue-300" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Edit question</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDeletion}
                    >
                      <Trash2Icon className="text-red-500 dark:text-red-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete question</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {question.tags.map((t) => (
              <Tag
                key={t.id}
                id={t.id}
                name={t.name}
                variant="default"
                size="sm"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href={`/profile/${question.user.id}`}
            className="flex items-center gap-2"
          >
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
              <EyeIcon className="size-4" />
              <span className="text-sm">{formattedViewCount} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
