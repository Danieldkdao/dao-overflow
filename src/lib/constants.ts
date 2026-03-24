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
export const UNAUTHED_MESSAGE = "Please sign in to access this feature.";
