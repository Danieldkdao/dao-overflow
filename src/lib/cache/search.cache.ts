import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getGlobalSearchTag = () => {
  return cacheTags.search.global();
};

export const revalidateSearchCache = () => {
  revalidateCacheTags(getGlobalSearchTag());
};
