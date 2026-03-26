"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";

export const checkUserAuthed = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
};
