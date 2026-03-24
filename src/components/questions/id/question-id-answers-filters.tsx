"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuestionIdFilters } from "@/hooks/use-question-id-filters";
import { QUESTION_ANSWERS_FILTERS } from "@/lib/constants";

const questionAnswerFilters: {
  value: (typeof QUESTION_ANSWERS_FILTERS)[number];
  label: string;
}[] = [
  {
    value: "highest-upvotes",
    label: "Highest Upvotes",
  },
  {
    value: "lowest-upvotes",
    label: "Lowest Upvotes",
  },
  {
    value: "most-recent",
    label: "Most Recent",
  },
  {
    value: "oldest",
    label: "Oldest",
  },
];

export const QuestionIdAnswersFilters = () => {
  const [filters, setFilters] = useQuestionIdFilters();

  return (
    <Select
      value={filters.filter}
      onValueChange={(value) =>
        setFilters({
          ...filters,
          filter: value as (typeof QUESTION_ANSWERS_FILTERS)[number],
        })
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select filters..." />
      </SelectTrigger>
      <SelectContent>
        {questionAnswerFilters.map((filter) => (
          <SelectItem key={filter.value} value={filter.value}>
            {filter.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
