import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const filterSearchParams = {
  query: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  country: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
