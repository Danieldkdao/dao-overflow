"use server";

import { envServer } from "@/data/env/server";

type JobFilters = {
  query: string;
  page: number;
};

export const getLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country");
  const location = await response.json();
  return location.country;
};

export const getCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name",
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getJobs = async (filters: JobFilters) => {
  const { query, page } = filters;
  return []
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
