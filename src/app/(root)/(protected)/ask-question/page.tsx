import { AskEditQuestionForm } from "@/components/questions/ask-edit-question-form";

const AskQuestionPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Ask a question</h1>
      <AskEditQuestionForm />
    </div>
  );
};

export default AskQuestionPage;
