import { HOME_FILTERS } from "@/lib/constants";
import {
  parseAsString,
  useQueryStates,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs";

export const useHomeFilters = () => {
  return useQueryStates(
    {
      query: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
      filter: parseAsStringEnum([...HOME_FILTERS, ""])
        .withDefault("")
        .withOptions({
          clearOnDefault: true,
        }),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false },
  );
};
