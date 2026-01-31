import { parseAsString, useQueryStates, parseAsInteger } from "nuqs";

export const useJobFilters = () => {
  return useQueryStates({
    query: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    country: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  });
};
