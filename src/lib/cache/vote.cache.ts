import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getQuestionVoteTag = (questionId: string) => {
  return cacheTags.votes.question(questionId);
};

export const getAnswerVoteTag = (answerId: string) => {
  return cacheTags.votes.answer(answerId);
};

export const getQuestionVoteUserTag = (userId: string) => {
  return cacheTags.votes.questionByUser(userId);
};

export const getAnswerVoteUserTag = (userId: string) => {
  return cacheTags.votes.answerByUser(userId);
};

export const revalidateQuestionVoteCache = ({
  questionId,
  voterId,
  authorId,
}: {
  questionId: string;
  voterId?: string;
  authorId?: string;
}) => {
  revalidateCacheTags(
    getQuestionVoteTag(questionId),
    cacheTags.questions.byId(questionId),
    cacheTags.questions.global(),
    voterId && getQuestionVoteUserTag(voterId),
    authorId && cacheTags.users.byId(authorId),
    authorId && cacheTags.users.questions(authorId),
    authorId && cacheTags.users.global(),
  );
};

export const revalidateAnswerVoteCache = ({
  answerId,
  questionId,
  voterId,
  authorId,
}: {
  answerId: string;
  questionId?: string;
  voterId?: string;
  authorId?: string;
}) => {
  revalidateCacheTags(
    getAnswerVoteTag(answerId),
    cacheTags.answers.byId(answerId),
    questionId && cacheTags.answers.byQuestion(questionId),
    questionId && cacheTags.questions.answers(questionId),
    questionId && cacheTags.questions.byId(questionId),
    voterId && getAnswerVoteUserTag(voterId),
    authorId && cacheTags.users.byId(authorId),
    authorId && cacheTags.users.answers(authorId),
    authorId && cacheTags.users.global(),
  );
};
