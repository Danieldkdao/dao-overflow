import { GetTagsOutputType } from "@/lib/actions/tags.action";
import Link from "next/link";

export const TagCard = ({
  tag,
}: {
  tag: NonNullable<GetTagsOutputType>["tags"][number];
}) => {
  return (
    <Link href={`/tags/${tag.id}`}>
      <div className="rounded-lg border bg-card p-5 space-y-2">
        <div className="p-2 rounded-md bg-accent w-fit text-sm truncate whitespace-pre-wrap">
          {tag.name}
        </div>
        <span className="text-sm font-medium">
          <span className="font-semibold text-base text-primary">
            {tag.questionCount}+
          </span>{" "}
          Questions
        </span>
      </div>
    </Link>
  );
};
