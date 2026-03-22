export const DEFAULT_PAGE = 1;
export const PAGE_SIZE = 20;

export const communityFilters = [
  "new_users",
  "old_users",
  "top_contributors",
] as const;
export const homeFilters = [
  "newest",
  "recommended",
  "frequent",
  "unanswered",
  "",
] as const;
