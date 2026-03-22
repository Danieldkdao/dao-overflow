import { homeFilters } from "../constants";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const filterSearchParams = {
  query: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  filter: parseAsStringEnum([...homeFilters, ""])
    .withDefault("")
    .withOptions({
      clearOnDefault: true,
    }),
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
