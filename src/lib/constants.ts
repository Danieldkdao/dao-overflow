import {
  LucideIcon,
  MessageCircleQuestionMarkIcon,
  MessageSquareMoreIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";

export const DEFAULT_PAGE = 1;
export const PAGE_SIZE = 20;

export const COMMUNITY_FILTERS = [
  "new_users",
  "old_users",
  "top_contributors",
] as const;
export const HOME_FILTERS = [
  "newest",
  "recommended",
  "frequent",
  "unanswered",
  "",
] as const;
export const QUESTION_ANSWERS_FILTERS = [
  "highest-upvotes",
  "lowest-upvotes",
  "most-recent",
  "oldest",
] as const;
export const QUESTIONS_FILTERS = [
  "most-recent",
  "oldest",
  "most-viewed",
  "most-voted",
  "most-answered",
] as const;
export const TAGS_FILTERS = ["recent", "oldest", "popular"] as const;
export const UNAUTHED_MESSAGE = "Please sign in to access this feature.";
export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
export const GLOBAL_SEARCH_TYPES = [
  "question",
  "answer",
  "user",
  "tag",
] as const;

export const GLOBAL_SEARCH_TYPE_MAP: Record<
  (typeof GLOBAL_SEARCH_TYPES)[number],
  { icon: LucideIcon; returnHref: (id: string) => string }
> = {
  answer: {
    icon: MessageSquareMoreIcon,
    returnHref: (id: string) => `/question/${id}`,
  },
  question: {
    icon: MessageCircleQuestionMarkIcon,
    returnHref: (id: string) => `/question/${id}`,
  },
  tag: { icon: TagIcon, returnHref: (id: string) => `/tags/${id}` },
  user: { icon: UserIcon, returnHref: (id: string) => `/profile/${id}` },
};
