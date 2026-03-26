export type CacheTag =
  | "users"
  | "questions"
  | "answers"
  | "tags"
  | "collections"
  | "interactions"
  | "questionVotes"
  | "answerVotes"
  | "recommendedQuestions"
  | "jobs"
  | "jobCountries"
  | "jobLocation"
  | "search";

export type CacheResourceScope =
  | "question"
  | "answer"
  | "tag"
  | "user"
  | "collection"
  | "job";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}` as const;
};

export const getUserTag = (tag: CacheTag, userId: string) => {
  return `user:${userId}:${tag}` as const;
};

export const getResourceTag = (
  tag: CacheTag,
  scope: CacheResourceScope,
  resourceId: string,
) => {
  return `resource:${scope}:${resourceId}:${tag}` as const;
};

export const getQuestionTag = (tag: CacheTag, questionId: string) => {
  return getResourceTag(tag, "question", questionId);
};

export const getAnswerTag = (tag: CacheTag, answerId: string) => {
  return getResourceTag(tag, "answer", answerId);
};

export const getTagScopeTag = (tag: CacheTag, tagId: string) => {
  return getResourceTag(tag, "tag", tagId);
};

export const getCollectionTag = (tag: CacheTag, collectionId: string) => {
  return getResourceTag(tag, "collection", collectionId);
};

export const getJobTag = (tag: CacheTag, jobId: string) => {
  return getResourceTag(tag, "job", jobId);
};

export const getIdTag = (tag: CacheTag, id: string) => {
  return `id:${id}:${tag}` as const;
};
