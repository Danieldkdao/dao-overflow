import { getTopQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tags.action";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Tag } from "@/components/tags/tag";

export const RightSidebar = async () => {
  const topQuestions = await getTopQuestions();
  const popularTags = await getPopularTags();

  return (
    <div className="h-full fixed right-0 translate-x-full transition-all duration-200 ease-in-out lg:translate-x-0 lg:static bg-sidebar space-y-10 overflow-y-auto w-75 p-4 border-l">
      <div className="flex flex-col gap-4 ">
        <h1 className="text-xl font-bold">Top Questions</h1>
        {topQuestions.map((question) => (
          <Link key={question.id} href={`/question/${question.id}`}>
            <div className="flex items-center gap-4">
              <span className="text-sm flex-1 line-clamp-2">
                {question.title}
              </span>
              <ChevronRightIcon className="shrink-0 size-4" />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-4 ">
        <h1 className="text-xl font-bold">Popular Tags</h1>
        {popularTags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between group">
            <Tag
              id={tag.id}
              name={tag.name.toUpperCase()}
              variant="card"
              className="line-clamp-2 uppercase p-2 border-none h-auto w-auto shrink bg-card text-foreground! hover:bg-card/80"
              size="sm"
            />
            <span className="text-sm font-medium">{tag.questionCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
