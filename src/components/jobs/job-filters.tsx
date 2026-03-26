"use client";

import { useJobFilters } from "@/hooks/use-job-filters";
import { SearchInput } from "../search-input";
import { CountrySelect } from "./country-select";

export const JobFilters = ({ countries }: { countries: string[] }) => {
  const [filters, setFilters] = useJobFilters();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <SearchInput
        placeholder="Job title, company, or keywords"
        value={filters.query}
        onSearchAction={(value: string) =>
          setFilters({ query: value, country: filters.country, page: 1 })
        }
      />
      <CountrySelect
        options={countries}
        value={filters.country}
        onChange={(value: string) =>
          setFilters({ query: filters.query, country: value, page: 1 })
        }
      />
    </div>
  );
};
