"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const onboardUser = async (username: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user)
    return {
      error: true,
      message: "User account not found",
    };

  try {
    const updatedUser = await db
      .update(user)
      .set({
        username,
      })
      .where(
        and(
          eq(user.name, session.user.name),
          eq(user.email, session.user.email),
          isNull(user.username),
        ),
      )
      .returning();
    if (!updatedUser) {
      throw new Error("Failed to update user");
    }
    return { error: false, message: "Onboarding process complete!" };
  } catch (error) {
    const typedError = error as { "cause": { code: string } };
    console.error(typedError)
    if (typedError["cause"].code === "23505") {
      return {
        error: true,
        message: "Username already taken.",
      };
    }
    return { error: true, message: "Failed to onboard user" };
  }
};
