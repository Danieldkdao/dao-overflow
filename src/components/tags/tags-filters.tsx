"use client";

import { useTagFilters } from "@/hooks/use-tag-filters";
import { DEFAULT_PAGE, TAGS_FILTERS } from "@/lib/constants";
import { SearchInput } from "../search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const TagsFilters = () => {
  const [filters, setFilters] = useTagFilters();

  return (
    <div className="flex items-center gap-4 mb-8">
      <SearchInput
        placeholder="Search tags..."
        value={filters.query}
        onSearchAction={(value) =>
          setFilters({
            page: DEFAULT_PAGE,
            query: value,
            filter: filters.filter,
          })
        }
      />
      <Select
        defaultValue={filters.filter}
        onValueChange={(value) =>
          setFilters({
            page: DEFAULT_PAGE,
            query: "",
            filter: value as (typeof TAGS_FILTERS)[number],
          })
        }
      >
        <SelectTrigger className="capitalize">
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          {TAGS_FILTERS.map((filter) => (
            <SelectItem
              key={filter}
              value={filter}
              className="font-medium capitalize"
            >
              {filter}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
