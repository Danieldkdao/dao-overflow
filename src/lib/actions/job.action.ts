"use server";

import { envServer } from "@/data/env/server";
import {
  getJobCountriesTag,
  getJobLocationTag,
  getJobsGlobalTag,
} from "../cache";
import { checkUserAuthed } from "./auth.action";
import { cacheTag } from "next/cache";

type JobFilters = {
  query: string;
  page: number;
};

export const getLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country", {
    next: {
      tags: [getJobLocationTag()],
    },
  });
  const location = await response.json();
  return location.country;
};

export const getCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name",
      {
        next: {
          tags: [getJobCountriesTag()],
        },
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getJobs = async (filters: JobFilters) => {
  const session = await checkUserAuthed();
  return getJobsCached(session?.user.id || null, filters);
};

export const getJobsCached = async (
  userEmail: string | null,
  filters: JobFilters,
) => {
  "use cache";

  const { query, page } = filters;
  cacheTag(getJobsGlobalTag());
  if (
    process.env.NODE_ENV === "production" &&
    userEmail !== envServer.ALLOWED_USER
  )
    return [];

  const response = await fetch(
    `https://api.openwebninja.com/jsearch/search?query=${query}&page=${page}`,
    {
      headers: {
        "x-api-key": envServer.JOB_SEARCH_API_KEY,
      },
    },
  );

  if (!response.ok) {
    return [];
  }

  const result = await response.json();
  return result.data;
};
