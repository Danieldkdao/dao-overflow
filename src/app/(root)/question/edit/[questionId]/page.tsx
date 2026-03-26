import { AskEditQuestionForm } from "@/components/questions/ask-edit-question-form";
import { getEditQuestion } from "@/lib/actions/question.action";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { SuspenseErrorBoundary } from "@/components/suspense-error-boundary";

type EditQuestionProps = {
  params: Promise<{ questionId: string }>;
};

const EditQuestionPage = (props: EditQuestionProps) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Edit question</h1>
      <SuspenseErrorBoundary
        title="We couldn't load this question for editing"
        description="Fetching the question or verifying edit access failed. The post may no longer exist, or you may not be allowed to edit it."
      >
        <Suspense fallback={<EditQuestionLoading />}>
          <EditQuestionSuspense {...props} />
        </Suspense>
      </SuspenseErrorBoundary>
    </div>
  );
};

export default EditQuestionPage;

const EditQuestionLoading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex justify-end w-full">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

const EditQuestionSuspense = async ({ params }: EditQuestionProps) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in");
  const { questionId } = await params;
  const data = await getEditQuestion(questionId);

  if (!data) {
    return (
      <EmptyState
        title="Question Not Found"
        description="The question you are trying to edit does not exist or you do not have permission to edit it."
      />
    );
  }

  return (
    <AskEditQuestionForm
      formData={{
        question: data.question,
        title: data.title,
        tags: data.tags.map((t) => t.name),
      }}
      questionId={data.id}
    />
  );
};
