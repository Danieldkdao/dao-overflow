"use client";

import { useEffect, useRef, useState } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import {
  GetQuestionOutputType,
  incrementQuestionViewCount,
} from "@/lib/actions/question.action";
import { cn, returnNumberAbbr } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  ChevronDownIcon,
  ClockIcon,
  EyeIcon,
  MessageCircleIcon,
  StarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { handleQuestionVoteAction } from "@/lib/actions/votes.action";
import type { VoteType } from "@/db/schema";
import { toast } from "sonner";
import { updateCollectionAction } from "@/lib/actions/collections.action";
import { Tag } from "@/components/tags/tag";

export const QuestionDetails = ({
  question,
}: {
  question: NonNullable<GetQuestionOutputType>;
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;
    handleViewIncrement();
  }, []);

  const handleViewIncrement = async () => {
    await incrementQuestionViewCount(question.id);
    hasIncremented.current = true;
    router.refresh();
  };

  const handleQuestionVote = async (type: VoteType) => {
    const response = await handleQuestionVoteAction({ id: question.id, type });
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  const handleUpdateCollection = async () => {
    const response = await updateCollectionAction(question.id);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <UserAvatar
            name={question.user.name}
            image={question.user.image}
            className="size-6"
          />
          <span className="text-xl font-semibold">
            {question.user.username}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer active:scale-90 transition-discrete duration-150"
            onClick={() => handleQuestionVote("up")}
          >
            <ArrowBigUpIcon
              className={cn(
                question.viewerVote === "up" && "text-green-500 fill-current",
              )}
            />
            <div className="text-sm font-bold bg-sidebar p-1.5 rounded-md">
              {returnNumberAbbr(question.upVoteCount)}
            </div>
            {/* todo: maybe add a useMemo to optimize the calculation of these values? */}
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer active:scale-90 transition-discrete duration-150"
            onClick={() => handleQuestionVote("down")}
          >
            <ArrowBigDownIcon
              className={cn(
                question.viewerVote === "down" && "text-green-500 fill-current",
              )}
            />
            <div className="text-sm font-bold bg-sidebar p-1.5 rounded-md">
              {returnNumberAbbr(question.downVoteCount)}
            </div>
          </div>
          <div
            className="cursor-pointer active:scale-90 transition-discrete duration-150"
            onClick={handleUpdateCollection}
          >
            <StarIcon
              className={cn(
                "text-orange-500",
                question.viewerCollection === question.id && "fill-current",
              )}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-4">
        <h1 className="text-3xl font-bold">{question.title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">
              asked{" "}
              {formatDistanceToNow(question.createdAt, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircleIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {`${returnNumberAbbr(question.answerCount)} ${question.answerCount === 1 ? "Answer" : "Answers"}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EyeIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {returnNumberAbbr(question.views)} Views
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {question.tags.map((tag) => (
          <Tag key={tag.id} id={tag.id} name={tag.name} variant="accent" />
        ))}
      </div>
      <div>
        <div
          className={`w-full relative overflow-hidden transition-[max-height] duration-500 ease-in-out ${
            isExpanded ? "max-h-none" : "max-h-125"
          }`}
        >
          <MarkdownRenderer isClient>{question.question}</MarkdownRenderer>
          {!isExpanded && (
            <div className="h-24 absolute bottom-0 left-0 right-0 bg-linear-to-b from-transparent to-background pointer-events-none" />
          )}
        </div>
        <div className="flex justify-center mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <ChevronDownIcon
              className={`size-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        </div>
      </div>
    </div>
  );
};
