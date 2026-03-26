import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getCollectionGlobalTag = () => {
  return cacheTags.collections.global();
};

export const getCollectionUserTag = (userId: string) => {
  return cacheTags.collections.byUser(userId);
};

export const getCollectionQuestionTag = (questionId: string) => {
  return cacheTags.collections.byQuestion(questionId);
};

export const revalidateCollectionCache = ({
  userId,
  questionId,
}: {
  userId: string;
  questionId?: string;
}) => {
  revalidateCacheTags(
    getCollectionGlobalTag(),
    getCollectionUserTag(userId),
    questionId && getCollectionQuestionTag(questionId),
  );
};
