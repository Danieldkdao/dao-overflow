import { QUESTIONS_FILTERS } from "@/lib/constants";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export const useQuestionFilters = () => {
  return useQueryStates(
    {
      filter: parseAsStringEnum([...QUESTIONS_FILTERS])
        .withDefault("most-recent")
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
