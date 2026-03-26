import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getTagGlobalTag = () => {
  return cacheTags.tags.global();
};

export const getTagIdTag = (tagId: string) => {
  return cacheTags.tags.byId(tagId);
};

export const getTagQuestionsTag = (tagId: string) => {
  return cacheTags.tags.questions(tagId);
};

export const revalidateTagCache = ({ tagId }: { tagId?: string } = {}) => {
  revalidateCacheTags(
    getTagGlobalTag(),
    tagId && getTagIdTag(tagId),
    tagId && getTagQuestionsTag(tagId),
  );
};
