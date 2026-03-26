import {
  getAnswerTag,
  getGlobalTag,
  getIdTag,
  getQuestionTag,
  getTagScopeTag,
  getUserTag,
} from "./data-cache";

export const cacheTags = {
  users: {
    global: () => getGlobalTag("users"),
    byId: (userId: string) => getIdTag("users", userId),
    questions: (userId: string) => getUserTag("questions", userId),
    answers: (userId: string) => getUserTag("answers", userId),
    collections: (userId: string) => getUserTag("collections", userId),
    interactions: (userId: string) => getUserTag("interactions", userId),
    recommendedQuestions: (userId: string) =>
      getUserTag("recommendedQuestions", userId),
  },
  questions: {
    global: () => getGlobalTag("questions"),
    byId: (questionId: string) => getIdTag("questions", questionId),
    byUser: (userId: string) => getUserTag("questions", userId),
    byTag: (tagId: string) => getTagScopeTag("questions", tagId),
    answers: (questionId: string) => getQuestionTag("answers", questionId),
    votes: (questionId: string) => getQuestionTag("questionVotes", questionId),
    collections: (questionId: string) =>
      getQuestionTag("collections", questionId),
    interactions: (questionId: string) =>
      getQuestionTag("interactions", questionId),
    recommendedForUser: (userId: string) =>
      getUserTag("recommendedQuestions", userId),
  },
  answers: {
    global: () => getGlobalTag("answers"),
    byId: (answerId: string) => getIdTag("answers", answerId),
    byUser: (userId: string) => getUserTag("answers", userId),
    byQuestion: (questionId: string) => getQuestionTag("answers", questionId),
    votes: (answerId: string) => getAnswerTag("answerVotes", answerId),
  },
  tags: {
    global: () => getGlobalTag("tags"),
    byId: (tagId: string) => getIdTag("tags", tagId),
    questions: (tagId: string) => getTagScopeTag("questions", tagId),
  },
  collections: {
    global: () => getGlobalTag("collections"),
    byUser: (userId: string) => getUserTag("collections", userId),
    byQuestion: (questionId: string) =>
      getQuestionTag("collections", questionId),
  },
  interactions: {
    global: () => getGlobalTag("interactions"),
    byUser: (userId: string) => getUserTag("interactions", userId),
    byQuestion: (questionId: string) =>
      getQuestionTag("interactions", questionId),
  },
  votes: {
    question: (questionId: string) => getQuestionTag("questionVotes", questionId),
    answer: (answerId: string) => getAnswerTag("answerVotes", answerId),
    questionByUser: (userId: string) => getUserTag("questionVotes", userId),
    answerByUser: (userId: string) => getUserTag("answerVotes", userId),
  },
  jobs: {
    global: () => getGlobalTag("jobs"),
    countries: () => getGlobalTag("jobCountries"),
    location: () => getGlobalTag("jobLocation"),
  },
  search: {
    global: () => getGlobalTag("search"),
  },
} as const;
