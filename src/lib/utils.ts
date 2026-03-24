import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const returnNumberAbbr = (num: number) => {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
  });

  return formatter.format(num);
};
