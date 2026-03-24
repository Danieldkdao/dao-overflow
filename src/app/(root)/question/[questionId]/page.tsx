import { QuestionIdView } from "@/components/questions/id/question-id-view";
import { SearchParams } from "nuqs";

const QuestionIdPage = async (props: {
  params: Promise<{ questionId: string }>;
  searchParams: Promise<SearchParams>;
}) => {
  return <QuestionIdView {...props} />;
};

export default QuestionIdPage;
