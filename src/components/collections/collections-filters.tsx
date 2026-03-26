"use client";

import { useQuestionFilters } from "@/hooks/use-question-filters";
import { DEFAULT_PAGE, QUESTIONS_FILTERS } from "@/lib/constants";
import { SearchInput } from "../search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type QuestionFilter = (typeof QUESTIONS_FILTERS)[number];

const filterOptions: { label: string; value: QuestionFilter }[] = [
  {
    label: "Most Recent",
    value: "most-recent",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
  {
    label: "Most Viewed",
    value: "most-viewed",
  },
  {
    label: "Most Answered",
    value: "most-answered",
  },
  {
    label: "Most Voted",
    value: "most-voted",
  },
];

export const CollectionsFilters = () => {
  const [filters, setFilters] = useQuestionFilters();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <SearchInput
        placeholder="Search saved questions..."
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
            filter: value as QuestionFilter,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((filter) => (
            <SelectItem
              key={filter.value}
              value={filter.value}
              className="font-medium"
            >
              {filter.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
