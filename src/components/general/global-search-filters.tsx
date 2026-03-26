import { GLOBAL_SEARCH_TYPES } from "@/lib/constants";
import { Button } from "../ui/button";
import { useGlobalSearchFilters } from "@/hooks/use-global-search-filters";
import { cn } from "@/lib/utils";
import { GlobalSearchType } from "@/lib/types";

export const GlobalSearchFilters = () => {
  const [filters, setFilters] = useGlobalSearchFilters();

  const handleFilterChange = (t: GlobalSearchType) => {
    setFilters({ q: filters.q, type: filters.type === t ? null : t });
  };

  return (
    <div className="p-5 flex items-center gap-2">
      <span>Type:</span>
      {GLOBAL_SEARCH_TYPES.map((t) => {
        const isActive = filters.type === t;
        return (
          <Button
            variant={isActive ? "default" : "ghost"}
            key={t}
            size="sm"
            className={cn(
              "capitalize rounded-full",
              !isActive && "bg-accent dark:bg-background",
            )}
            onClick={() => handleFilterChange(t)}
          >
            {t}
          </Button>
        );
      })}
    </div>
  );
};
