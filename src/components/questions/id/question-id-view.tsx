import { getQuestion, getQuestionAnswers } from "@/lib/actions/question.action";
import { loadSearchParams } from "@/lib/params/question-id-params";
import { Suspense } from "react";
import { QuestionDetails } from "./question-details";
import { QuestionIdAnswers } from "./question-id-answers";
import { SearchParams } from "nuqs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type QuestionIdViewProps = {
  params: Promise<{ questionId: string }>;
  searchParams: Promise<SearchParams>;
};

export const QuestionIdView = (params: QuestionIdViewProps) => {
  return (
    <Suspense fallback={<QuestionIdLoading />}>
      <QuestionIdSuspense {...params} />
    </Suspense>
  );
};

const QuestionIdLoading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Question Details Skeleton */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="size-6" />
          </div>
        </div>
        <div className="space-y-4 mb-4 mt-2">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-14" />
        </div>
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[95%]" />
        </div>
      </div>

      {/* Answers Section Skeleton */}
      <div className="space-y-4 mt-8 pt-4">
        <div className="flex items-center justify-between border-y py-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-8 rounded-md" />
                <Skeleton className="w-16 h-8 rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-[85%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionIdSuspense = async ({
  params,
  searchParams,
}: QuestionIdViewProps) => {
  const { questionId } = await params;
  const filters = await loadSearchParams(searchParams);
  const questionData = await getQuestion(questionId);
  const answersData = await getQuestionAnswers({
    questionId,
    ...filters,
  });

  if (!questionData || !answersData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircleIcon className="size-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Question not found
        </h2>
        <p className="text-muted-foreground max-w-md">
          The question you're looking for doesn't exist, has been removed, or
          you don't have permission to view it.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <QuestionDetails question={questionData} />
      <QuestionIdAnswers data={answersData} questionId={questionId} />
    </div>
  );
};
