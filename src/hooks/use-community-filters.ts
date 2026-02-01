import { communityFilters } from "@/lib/constants";
import {
  parseAsString,
  useQueryStates,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs";

export const useCommunityFilters = () => {
  return useQueryStates(
    {
      query: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
      filter: parseAsStringEnum([...communityFilters])
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
      page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
    },
    { shallow: false },
  );
};
