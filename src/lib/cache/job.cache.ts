import { cacheTags } from "./cache-tags";
import { revalidateCacheTags } from "./revalidate-cache";

export const getJobsGlobalTag = () => {
  return cacheTags.jobs.global();
};

export const getJobCountriesTag = () => {
  return cacheTags.jobs.countries();
};

export const getJobLocationTag = () => {
  return cacheTags.jobs.location();
};

export const revalidateJobCache = () => {
  revalidateCacheTags(
    getJobsGlobalTag(),
    getJobCountriesTag(),
    getJobLocationTag(),
  );
};
