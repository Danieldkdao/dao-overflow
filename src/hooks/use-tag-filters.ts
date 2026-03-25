import { TAGS_FILTERS } from "@/lib/constants";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export const useTagFilters = () => {
  return useQueryStates(
    {
      filter: parseAsStringEnum([...TAGS_FILTERS])
        .withDefault("recent")
        .withOptions({
          clearOnDefault: true,
        }),
      query: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false },
  );
};
