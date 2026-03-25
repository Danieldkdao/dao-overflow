import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { TAGS_FILTERS } from "../constants";

const filterSearchParams = {
  filter: parseAsStringEnum([...TAGS_FILTERS])
    .withDefault("recent")
    .withOptions({
      clearOnDefault: true,
    }),
  query: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
