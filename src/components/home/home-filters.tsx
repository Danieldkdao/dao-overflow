"use client";

import { useHomeFilters } from "@/hooks/use-home-filters";
import { SearchInput } from "../search-input";
import { HOME_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const HomeFilters = () => {
  const [filters, setFilters] = useHomeFilters();

  return (
    <div className="my-8 space-y-4">
      <SearchInput
        value={filters.query}
        onSearchAction={(value) =>
          setFilters({ filter: "", page: 1, query: value })
        }
        placeholder="Search questions..."
      />
      <div className="flex items-center gap-2 flex-wrap">
        {HOME_FILTERS.filter((f) => f !== "").map((f) => {
          const isActive = f === filters.filter;
          return (
            <div
              key={f}
              className={cn(
                "p-2 rounded-lg bg-sidebar cursor-pointer",
                isActive && "bg-accent text-primary",
              )}
              onClick={() =>
                setFilters({ page: 1, query: filters.query, filter: f })
              }
            >
              <span className="capitalize">{f}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
