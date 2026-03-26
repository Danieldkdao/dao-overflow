import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getUserGlobalTag = () => {
  return cacheTags.users.global();
};

export const getUserIdTag = (userId: string) => {
  return cacheTags.users.byId(userId);
};

export const getUserQuestionsTag = (userId: string) => {
  return cacheTags.users.questions(userId);
};

export const getUserAnswersTag = (userId: string) => {
  return cacheTags.users.answers(userId);
};

export const getUserCollectionsTag = (userId: string) => {
  return cacheTags.users.collections(userId);
};

export const getUserInteractionsTag = (userId: string) => {
  return cacheTags.users.interactions(userId);
};

export const getUserRecommendedQuestionsTag = (userId: string) => {
  return cacheTags.users.recommendedQuestions(userId);
};

export const revalidateUserCache = (userId: string) => {
  revalidateCacheTags(
    getUserGlobalTag(),
    getUserIdTag(userId),
    getUserQuestionsTag(userId),
    getUserAnswersTag(userId),
    getUserCollectionsTag(userId),
    getUserInteractionsTag(userId),
    getUserRecommendedQuestionsTag(userId),
  );
};
