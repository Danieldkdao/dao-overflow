"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { db } from "@/db/db";
import { QuestionTable, QuestionTagTable, TagTable, user } from "@/db/schema";
import { and, asc, count, desc, eq, ilike, isNull, sql } from "drizzle-orm";
import { PAGE_SIZE, COMMUNITY_FILTERS } from "../constants";
import { getTableColumns } from "drizzle-orm";
import { GetActionOutput } from "../types";

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

export type UserFilterType = (typeof COMMUNITY_FILTERS)[number];

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
  };

  const filterMapResult = filterMap[filter];

  const users = await db
    .select({
      ...getTableColumns(user),
      topTags: sql<{ id: string; name: string }[]>`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', top_tags.tag_id,
              'name', top_tags.tag_name
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT tt.id AS tag_id, tt.name AS tag_name
          FROM ${QuestionTable} qt
          INNER JOIN ${QuestionTagTable} qtt ON qtt.question_id = qt.id
          INNER JOIN ${TagTable} tt ON tt.id = qtt.tag_id
          WHERE qt.user_id = "user"."id"
          GROUP BY tt.id, tt.name
          ORDER BY COUNT(*) DESC, tt.name ASC
          LIMIT 3
        ) as top_tags
      )`,
    })
    .from(user)
    .where(query.trim() ? ilike(user.name, `%${query}%`) : undefined)
    .offset(offset)
    .orderBy(...filterMapResult)
    .limit(PAGE_SIZE);

  const [userCount] = await db
    .select({
      count: count(),
    })
    .from(user)
    .where(
      query && query.trim() === "" ? undefined : ilike(user.name, `%${query}%`),
    );

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

export type GetUsersOutput = GetActionOutput<typeof fetchUsers>;

export const checkUserAuthed = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return session;
};
