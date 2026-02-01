"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { and, asc, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { PAGE_SIZE } from "../constants";
import { communityFilters } from "../constants";

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
    const typedError = error as { cause: { code: string } };
    console.error(typedError);
    if (typedError["cause"].code === "23505") {
      return {
        error: true,
        message: "Username already taken.",
      };
    }
    return { error: true, message: "Failed to onboard user" };
  }
};

export type UserFilterType = (typeof communityFilters)[number];

export const fetchUsers = async (
  page: number,
  query: string,
  filter: UserFilterType,
) => {
  if (page < 1) return null;
  const offset = (page - 1) * PAGE_SIZE;

  const filterMap = {
    new_users: [desc(user.createdAt), desc(user.id)],
    old_users: [asc(user.createdAt), asc(user.id)],
    // todo: add the amount of questions created/answered, tags
    top_contributors: [],
    "": [desc(user.createdAt), desc(user.id)],
  };

  const filterOrderBy =
    filter in filterMap ? filterMap[filter] : filterMap.new_users;

  const users = await db
    .select()
    .from(user)
    .where(
      query && query.trim() === "" ? undefined : ilike(user.name, `%${query}%`),
    )
    .offset(offset)
    .orderBy(...filterOrderBy)
    .limit(PAGE_SIZE);

  const [userCount] = await db
    .select({
      count: count(),
    })
    .from(user)
    .where(
      query && query.trim() === "" ? undefined : ilike(user.name, `%${query}%`),
    )

  const hasPrevPage = page > 1;
  const hasNextPage = page * PAGE_SIZE < userCount.count;
  const totalPages = Math.floor(userCount.count / PAGE_SIZE);

  return {
    users,
    metadata: {
      hasPrevPage,
      hasNextPage,
      totalPages,
    },
  };
};
