"use client";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { VoteType } from "@/db/schema";
import { GetQuestionAnswersOutputType } from "@/lib/actions/question.action";
import { handleAnswerVoteAction } from "@/lib/actions/votes.action";
import { cn, returnNumberAbbr } from "@/lib/utils";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const QuestionAnswer = ({
  answer,
}: {
  answer: NonNullable<GetQuestionAnswersOutputType>["answers"][number];
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAnswerVote = async (type: VoteType) => {
    const response = await handleAnswerVoteAction({ id: answer.id, type });
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <div className="py-6 border-b border-border flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2">
            <UserAvatar
              name={answer.user.name}
              image={answer.user.image}
              className="size-6"
            />
            <span className="text-sm font-bold">{answer.user.name}</span>
          </div>
          <span className="text-muted-foreground text-sm">●</span>
          <span className="text-muted-foreground text-sm">
            answered{" "}
            {answer.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            {answer.createdAt.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer active:scale-90 transition-discrete duration-150"
            onClick={() => handleAnswerVote("up")}
          >
            <ArrowBigUpIcon
              className={cn(
                answer.viewerVote === "up" && "text-green-500 fill-current",
              )}
            />
            <div className="text-sm font-bold bg-sidebar p-1.5 rounded-md">
              {returnNumberAbbr(answer.upVoteCount)}
            </div>
            {/* todo: maybe add a useMemo to optimize the calculation of these values? */}
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer active:scale-90 transition-discrete duration-150"
            onClick={() => handleAnswerVote("down")}
          >
            <ArrowBigDownIcon
              className={cn(
                answer.viewerVote === "down" && "text-green-500 fill-current",
              )}
            />
            <div className="text-sm font-bold bg-sidebar p-1.5 rounded-md">
              {returnNumberAbbr(answer.downVoteCount)}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`w-full relative overflow-hidden transition-[max-height] duration-500 ease-in-out ${
            isExpanded ? "max-h-none" : "max-h-125"
          }`}
        >
          <MarkdownRenderer isClient>{answer.answerText}</MarkdownRenderer>
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
