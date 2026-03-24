import { QUESTIONS_FILTERS } from "@/lib/constants";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const filterSearchParams = {
  filter: parseAsStringEnum([...QUESTIONS_FILTERS])
    .withDefault("most-recent")
    .withOptions({
      clearOnDefault: true,
    }),
  query: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
