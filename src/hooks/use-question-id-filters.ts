import { QUESTION_ANSWERS_FILTERS } from "@/lib/constants";
import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs";

export const useQuestionIdFilters = () => {
  return useQueryStates(
    {
      filter: parseAsStringEnum([...QUESTION_ANSWERS_FILTERS])
        .withDefault("most-recent")
        .withOptions({
          clearOnDefault: true,
        }),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false },
  );
};
