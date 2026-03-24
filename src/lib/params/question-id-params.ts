import { QUESTION_ANSWERS_FILTERS } from "@/lib/constants";
import { createLoader, parseAsInteger, parseAsStringEnum } from "nuqs/server";

export const filterSearchParams = {
  filter: parseAsStringEnum([...QUESTION_ANSWERS_FILTERS])
    .withDefault("most-recent")
    .withOptions({
      clearOnDefault: true,
    }),
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSearchParams);
