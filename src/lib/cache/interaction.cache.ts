import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getInteractionGlobalTag = () => {
  return cacheTags.interactions.global();
};

export const getInteractionUserTag = (userId: string) => {
  return cacheTags.interactions.byUser(userId);
};

export const getInteractionQuestionTag = (questionId: string) => {
  return cacheTags.interactions.byQuestion(questionId);
};

export const revalidateInteractionCache = ({
  userId,
  questionId,
}: {
  userId: string;
  questionId?: string;
}) => {
  revalidateCacheTags(
    getInteractionGlobalTag(),
    getInteractionUserTag(userId),
    questionId && getInteractionQuestionTag(questionId),
    cacheTags.users.recommendedQuestions(userId),
  );
};
