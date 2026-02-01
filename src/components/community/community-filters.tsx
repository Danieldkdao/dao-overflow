"use client";

import { useCommunityFilters } from "@/hooks/use-community-filters";
import { SearchInput } from "../search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DEFAULT_PAGE } from "@/lib/constants";
import { UserFilterType } from "@/lib/actions/user.action";

const filterOptions = [
  {
    label: "New users",
    value: "new_users",
  },
  {
    label: "Old users",
    value: "old_users",
  },
  {
    label: "Top contributors",
    value: "top_contributors",
  },
];

export const CommunityFilters = () => {
  const [filters, setFilters] = useCommunityFilters();

  return (
    <div className="flex items-center gap-4 mb-8">
      <SearchInput
        placeholder="Search amazing minds here..."
        value={filters.query}
        onSearchAction={(value) =>
          setFilters({ page: DEFAULT_PAGE, query: value, filter: "" })
        }
      />
      <Select
        defaultValue={filters.filter}
        onValueChange={(value) =>
          setFilters({
            page: DEFAULT_PAGE,
            query: "",
            filter: value as UserFilterType,
          })
        }
      >
        <SelectTrigger>
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
