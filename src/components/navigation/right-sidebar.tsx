import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const forumData = {
  topQuestions: [
    {
      label: "How to use the `useContext` hook in React for global state?",
      href: "/questions/use-context-hook-react",
    },
    {
      label: "Best practices for securing a Node.js REST API with JWT",
      href: "/questions/node-rest-api-security",
    },
    {
      label: "Why is my CSS Grid layout breaking on mobile screens?",
      href: "/questions/css-grid-mobile-fix",
    },
    {
      label: "Understanding the difference between Map and WeakMap in JS",
      href: "/questions/js-map-vs-weakmap",
    },
    {
      label: "How to optimize PostgreSQL queries for large datasets",
      href: "/questions/postgres-query-optimization",
    },
  ],
  popularTags: [
    {
      label: "javascript",
      href: "/tags/javascript",
      number: 1240,
    },
    {
      label: "react",
      href: "/tags/react",
      number: 856,
    },
    {
      label: "css",
      href: "/tags/css",
      number: 642,
    },
    {
      label: "nodejs",
      href: "/tags/nodejs",
      number: 521,
    },
    {
      label: "python",
      href: "/tags/python",
      number: 489,
    },
    {
      label: "typescript",
      href: "/tags/typescript",
      number: 312,
    },
  ],
};

export const RightSidebar = () => {
  return (
    <div className="h-full fixed right-0 translate-x-full transition-all duration-200 ease-in-out lg:translate-x-0 lg:static bg-sidebar space-y-10 overflow-y-auto w-75 p-4 border-l">
      <div className="flex flex-col gap-4 ">
        <h1 className="text-xl font-bold">Top Questions</h1>
        {forumData.topQuestions.map((question) => (
          <Link key={question.label} href={question.href}>
            <div className="flex items-center gap-4">
              <span className="text-sm flex-1 line-clamp-2">
                {question.label}
              </span>
              <ChevronRightIcon className="shrink-0 size-4" />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-4 ">
        <h1 className="text-xl font-bold">Popular Tags</h1>
        {forumData.popularTags.map((tag) => (
          <Link key={tag.label} href={tag.href}>
            <div className="flex items-center justify-between">
              <span className="text-sm bg-card line-clamp-2 p-2 rounded-md">
                {tag.label.toUpperCase()}
              </span>
              <span className="text-sm text-medium">{tag.number}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
