import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getQuestionGlobalTag = () => {
  return cacheTags.questions.global();
};

export const getQuestionUserTag = (userId: string) => {
  return cacheTags.questions.byUser(userId);
};

export const getQuestionIdTag = (questionId: string) => {
  return cacheTags.questions.byId(questionId);
};

export const getQuestionTagQuestionsTag = (tagId: string) => {
  return cacheTags.questions.byTag(tagId);
};

export const getQuestionAnswersTag = (questionId: string) => {
  return cacheTags.questions.answers(questionId);
};

export const getQuestionCollectionTag = (questionId: string) => {
  return cacheTags.questions.collections(questionId);
};

export const getRecommendedQuestionsTag = (userId: string) => {
  return cacheTags.questions.recommendedForUser(userId);
};

export const revalidateQuestionCache = ({
  userId,
  id,
  tagIds = [],
}: {
  userId: string;
  id: string;
  tagIds?: string[];
}) => {
  revalidateCacheTags(
    getQuestionGlobalTag(),
    getQuestionUserTag(userId),
    getQuestionIdTag(id),
    getRecommendedQuestionsTag(userId),
    cacheTags.users.byId(userId),
    cacheTags.users.global(),
    tagIds.length > 0 && cacheTags.tags.global(),
    ...tagIds.map((tagId) => getQuestionTagQuestionsTag(tagId)),
    ...tagIds.map((tagId) => cacheTags.tags.byId(tagId)),
  );
};
