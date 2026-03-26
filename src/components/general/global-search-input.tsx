"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useEffect, useState } from "react";
import { useGlobalSearchFilters } from "@/hooks/use-global-search-filters";
import { GlobalSearchFilters } from "./global-search-filters";
import { GlobalSearchResults } from "./global-search-results";

export const GlobalSearchInput = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useGlobalSearchFilters();
  const [open, setOpen] = useState(false);

  const debouncedSearchValue = useDebouncedValue(search, { wait: 1250 });

  useEffect(() => {
    setFilters({ type: filters.type, q: debouncedSearchValue["0"] });
  }, [debouncedSearchValue["0"]]);

  return (
    <div
      className="relative w-full max-w-[550px]"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setSearch("");
          setFilters({ q: "", type: null });
          setOpen(false);
        }
      }}
    >
      <div className="hidden md:flex p-2 bg-background dark:bg-input/40 border border-border rounded-lg items-center w-full">
        <SearchIcon />
        <Input
          className="text-lg shadow-none border-none focus-visible:border-none focus-visible:ring-0"
          placeholder="Search anything globally..."
          onChange={(e) => {
            if (!open) setOpen(true);
            setSearch(e.target.value);
          }}
          value={search}
        />
      </div>
      {open && filters.q.trim() && (
        <div className="absolute top-[110%] z-1000 rounded-lg bg-background dark:bg-input border border-border right-0 left-0">
          <GlobalSearchFilters />
          <hr className="w-full" />
          <div className="py-5 space-y-4">
            <h3 className="text-xl font-bold px-5">Top Matches</h3>
            <GlobalSearchResults setOpen={setOpen} />
          </div>
        </div>
      )}
    </div>
  );
};
