import { GLOBAL_SEARCH_TYPES } from "@/lib/constants";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useGlobalSearchFilters = () => {
  return useQueryStates({
    q: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    type: parseAsStringEnum([...GLOBAL_SEARCH_TYPES]).withOptions({
      clearOnDefault: true,
    }),
  });
};
