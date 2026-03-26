"use client";

import { useGlobalSearchFilters } from "@/hooks/use-global-search-filters";
import {
  getGlobalSearchResults,
  GlobalSearchResultsType,
} from "@/lib/actions/general.action";
import { GLOBAL_SEARCH_TYPE_MAP } from "@/lib/constants";
import { AnnoyedIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const GlobalSearchResults = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [filters] = useGlobalSearchFilters();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GlobalSearchResultsType[]>(
    [],
  );

  useEffect(() => {
    if (!filters.q.trim()) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      const results = await getGlobalSearchResults(filters);
      setSearchResults(results);
      setLoading(false);
    };

    fetchSearchResults();
  }, [filters.q, filters.type]);

  return (
    <div className="flex flex-col gap-2">
      {loading ? (
        <div className="flex flex-col items-center gap-2 w-full justify-center py-2 px-5">
          <Loader2Icon className="text-primary animate-spin size-10" />
          <span className="text-muted-foreground font-medium text-sm">
            Browsing the whole database...
          </span>
        </div>
      ) : searchResults.length ? (
        searchResults.map((sr, index) => {
          const Icon = GLOBAL_SEARCH_TYPE_MAP[sr.type].icon;
          const redirectTo = GLOBAL_SEARCH_TYPE_MAP[sr.type].returnHref(sr.id);

          return (
            <Link
              href={redirectTo}
              onNavigate={() => setOpen(false)}
              key={`${sr}+${index}`}
              className="flex items-center gap-2 py-2 hover:bg-accent dark:hover:bg-background px-5"
            >
              <Icon className="shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm line-clamp-1">
                  {sr.text}
                </span>
                <span className="text-xs font-medium text-chart-2 capitalize">
                  {sr.type}
                </span>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="flex flex-col items-center gap-2 w-full justify-center py-2 px-5">
          <AnnoyedIcon className="text-primary size-10" />
          <span className="text-muted-foreground font-medium text-sm">
            No results found that matched the filters
          </span>
        </div>
      )}
    </div>
  );
};
