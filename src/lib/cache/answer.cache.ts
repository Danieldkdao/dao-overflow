import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getAnswerGlobalTag = () => {
  return cacheTags.answers.global();
};

export const getAnswerIdTag = (answerId: string) => {
  return cacheTags.answers.byId(answerId);
};

export const getAnswerUserTag = (userId: string) => {
  return cacheTags.answers.byUser(userId);
};

export const getAnswerQuestionTag = (questionId: string) => {
  return cacheTags.answers.byQuestion(questionId);
};

export const revalidateAnswerCache = ({
  answerId,
  questionId,
  userId,
}: {
  answerId: string;
  questionId?: string;
  userId?: string;
}) => {
  revalidateCacheTags(
    getAnswerGlobalTag(),
    getAnswerIdTag(answerId),
    questionId && getAnswerQuestionTag(questionId),
    questionId && cacheTags.questions.answers(questionId),
    questionId && cacheTags.questions.byId(questionId),
    userId && getAnswerUserTag(userId),
    userId && cacheTags.users.byId(userId),
    userId && cacheTags.users.global(),
  );
};
