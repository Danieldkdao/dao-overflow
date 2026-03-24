import { COMMUNITY_FILTERS } from "@/lib/constants";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const filterSearchParams = {
  query: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  filter: parseAsStringEnum([...COMMUNITY_FILTERS])
    .withDefault("new_users")
    .withOptions({
      clearOnDefault: true,
    }),
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
