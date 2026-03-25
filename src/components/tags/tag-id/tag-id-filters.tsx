"use client";

import { SearchInput } from "@/components/search-input";
import { useTagIdFilters } from "@/hooks/use-tag-id-filters";
import { DEFAULT_PAGE } from "@/lib/constants";

export const TagIdFilters = ({ tagName }: { tagName: string }) => {
  const [filters, setFilters] = useTagIdFilters();

  return (
    <SearchInput
      placeholder={`Search ${tagName.toLowerCase()} questions...`}
      value={filters.query}
      onSearchAction={(value) =>
        setFilters({ query: value, page: DEFAULT_PAGE })
      }
    />
  );
};
