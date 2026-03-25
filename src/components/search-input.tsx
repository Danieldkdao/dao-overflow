"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useEffect, useState } from "react";

type SearchInputProps = {
  placeholder: string;
  value: string;
  onSearchAction: (value: string) => void;
};

export const SearchInput = ({
  placeholder,
  value,
  onSearchAction,
}: SearchInputProps) => {
  const [search, setSearch] = useState(value);

  const debouncedSearchValue = useDebouncedValue(search, { wait: 1250 });

  useEffect(() => {
    onSearchAction(search);
  }, [debouncedSearchValue["0"]]);

  return (
    <div className="hidden md:flex px-2 py-1 dark:bg-input/40 border border-border rounded-lg items-center flex-1">
      <SearchIcon />
      <Input
        placeholder={placeholder}
        className="text-lg shadow-none border-none focus-visible:border-none focus-visible:ring-0"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
