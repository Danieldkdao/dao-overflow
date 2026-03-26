import { revalidateTag } from "next/cache";

export const revalidateCacheTags = (
  ...tags: Array<string | null | undefined | false>
) => {
  for (const tag of new Set(tags.filter(Boolean))) {
    if (!tag) continue;
    revalidateTag(tag, "max");
  }
};
