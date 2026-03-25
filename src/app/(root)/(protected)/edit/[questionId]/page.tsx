import { AskEditQuestionForm } from "@/components/questions/ask-edit-question-form";
import { getEditQuestion } from "@/lib/actions/question.action";
import { Suspense } from "react";

type EditQuestionProps = {
  params: Promise<{ questionId: string }>;
};

const EditQuestionPage = (props: EditQuestionProps) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Edit question</h1>
      <Suspense fallback={<EditQuestionLoading />}>
        <EditQuestionSuspense {...props} />
      </Suspense>
    </div>
  );
};

export default EditQuestionPage;

const EditQuestionLoading = () => {
  return <div>loading...</div>;
};

const EditQuestionSuspense = async ({ params }: EditQuestionProps) => {
  const { questionId } = await params;
  const data = await getEditQuestion(questionId);

  if (!data) {
    return <div>not found/error state</div>;
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
