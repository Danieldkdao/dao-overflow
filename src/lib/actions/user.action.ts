"use server";

import { db } from "@/db/db";
import {
  AnswerTable,
  AnswerVoteTable,
  QuestionTable,
  QuestionTagTable,
  QuestionVoteTable,
  TagTable,
  user,
} from "@/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNull,
  sql,
} from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { BADGE_CRITERIA, COMMUNITY_FILTERS, PAGE_SIZE } from "../constants";
import { GetActionOutput } from "../types";
import { checkUserAuthed } from "./auth.action";
import { cacheTag } from "next/cache";
import {
  getUserAnswersTag,
  getUserGlobalTag,
  getUserIdTag,
  getUserQuestionsTag,
  revalidateSearchCache,
  revalidateUserCache,
} from "../cache";

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

    revalidateUserCache(session.user.id);
    revalidateSearchCache();

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

export const updateUserReputation = async (amount: number, userId: string) => {
  await db
    .update(user)
    .set({
      reputation: sql<number>`${user.reputation} + ${amount}`,
    })
    .where(eq(user.id, userId));
};

export type UserFilterType = (typeof COMMUNITY_FILTERS)[number];

export const fetchUsers = async (
  page: number,
  query: string,
  filter: UserFilterType,
) => {
  "use cache";

  if (page < 1) return null;
  const offset = (page - 1) * PAGE_SIZE;

  cacheTag(getUserGlobalTag());

  const filterMap = {
    new_users: [desc(user.createdAt), desc(user.id)],
    old_users: [asc(user.createdAt), asc(user.id)],
    top_contributors: [desc(user.reputation), desc(user.id)],
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

export const getUserProfile = async (userId: string) => {
  const session = await checkUserAuthed();
  const userProfile = await getUserProfileCached(userId);
  if (!userProfile) {
    throw new Error("User profile not found.");
  }

  const isCurrentUser = session?.user.id === userId;

  return { ...userProfile, isCurrentUser };
};

const getUserProfileCached = async (userId: string) => {
  "use cache";

  cacheTag(getUserIdTag(userId));
  cacheTag(getUserQuestionsTag(userId));
  cacheTag(getUserAnswersTag(userId));

  const [userProfile] = await db
    .select({
      ...getTableColumns(user),
      questionCount: sql<number>`(
      SELECT COUNT(*)
      FROM ${QuestionTable} qt
      WHERE qt.user_id = ${userId}
    )`,
      answerCount: sql<number>`(
      SELECT COUNT(*)
      FROM ${AnswerTable} ast
      WHERE ast.user_id = ${userId}
    )`,
      totalQuestionUpvotes: sql<number>`(
        SELECT COUNT(*)
        FROM ${QuestionVoteTable} qvt
        INNER JOIN ${QuestionTable} qt ON qt.id = qvt.question_id
        WHERE qt.user_id = ${userId}
          AND qvt.type = 'up'
      )`,
      totalAnswerUpVotes: sql<number>`(
        SELECT COUNT(*)
        FROM ${AnswerVoteTable} avt
        INNER JOIN ${AnswerTable} ast ON ast.id = avt.answer_id
        WHERE ast.user_id = ${userId}
          AND avt.type = ${"up"}
      )`,
      totalViews: sql<number>`(
        SELECT SUM(qt.views)
        FROM ${QuestionTable} qt
        WHERE qt.user_id = ${userId}
      )`,
      topTags: sql<{ id: string; name: string; questionCount: number }[]>`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', top_tags.tag_id,
              'name', top_tags.tag_name,
              'questionCount', top_tags.question_count
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT 
            tt.id AS tag_id,
            tt.name AS tag_name,
            COUNT(*) AS question_count
          FROM ${QuestionTable} qt
          INNER JOIN ${QuestionTagTable} qtt ON qtt.question_id = qt.id
          INNER JOIN ${TagTable} tt ON tt.id = qtt.tag_id
          WHERE qt.user_id = ${userId}
          GROUP BY tt.id, tt.name
          ORDER BY question_count DESC, tt.name ASC
          LIMIT 6
        ) AS top_tags
      )`,
      topAnswers: sql<
        {
          id: string;
          questionId: string;
          questionTitle: string;
          userName: string;
          userImage: string | null | undefined;
          voteCount: number;
          createdAt: Date;
        }[]
      >`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', top_answers.answer_id,
              'questionId', top_answers.question_id,
              'questionTitle', top_answers.question_title,
              'userName', top_answers.user_name,
              'userImage', top_answers.user_image,
              'voteCount', top_answers.vote_count,
              'createdAt', top_answers.created_at
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT
            ast.id AS answer_id,
            qt.id AS question_id,
            qt.title AS question_title,
            ut.name AS user_name,
            ut.image AS user_image,
            ast.created_at AS created_at,
            (
              SELECT COUNT(*)
              FROM ${AnswerVoteTable} avt
              WHERE avt.answer_id = ast.id
                AND avt.type = ${"up"}
            ) AS vote_count
          FROM ${AnswerTable} ast
          INNER JOIN ${QuestionTable} qt ON qt.id = ast.question_id
          INNER JOIN ${user} ut ON ut.id = ast.user_id
          WHERE ast.user_id = ${userId}
          ORDER BY vote_count DESC, ast.created_at DESC
          LIMIT 6
        ) AS top_answers
      )`,
      topPosts: sql<
        {
          user: {
            id: string;
            name: string;
            email: string;
            emailVerified: boolean;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            username: string | null;
            portfolioLink: string | null;
            location: string | null;
            bio: string | null;
            reputation: number;
          };
          voteCount: number;
          answerCount: number;
          tags: { id: string; name: string }[];
          id: string;
          title: string;
          question: string;
          views: number;
          userId: string;
          createdAt: Date;
        }[]
      >`(
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', top_posts.question_id,
              'title', top_posts.question_title,
              'question', top_posts.question_body,
              'views', top_posts.question_views,
              'userId', top_posts.user_id,
              'createdAt', top_posts.question_created_at,
              'voteCount', top_posts.vote_count,
              'answerCount', top_posts.answer_count,
              'tags', top_posts.tags,
              'user', jsonb_build_object(
                'id', top_posts.user_id,
                'name', top_posts.user_name,
                'email', top_posts.user_email,
                'emailVerified', top_posts.user_email_verified,
                'image', top_posts.user_image,
                'createdAt', top_posts.user_created_at,
                'updatedAt', top_posts.user_updated_at,
                'username', top_posts.user_username,
                'portfolioLink', top_posts.user_portfolio_link,
                'location', top_posts.user_location,
                'bio', top_posts.user_bio,
                'reputation', top_posts.user_reputation
              )
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT
            qt.id AS question_id,
            qt.title AS question_title,
            qt.question AS question_body,
            qt.views AS question_views,
            qt.created_at AS question_created_at,
            qt.user_id AS user_id,
            ut.name AS user_name,
            ut.email AS user_email,
            ut.email_verified AS user_email_verified,
            ut.image AS user_image,
            ut.created_at AS user_created_at,
            ut.updated_at AS user_updated_at,
            ut.username AS user_username,
            ut.portfolio_link AS user_portfolio_link,
            ut.location AS user_location,
            ut.bio AS user_bio,
            ut.reputation AS user_reputation,
            (
              SELECT COUNT(*)
              FROM ${QuestionVoteTable} qvt
              WHERE qvt.question_id = qt.id
                AND qvt.type = 'up'
            ) AS vote_count,
            (
              SELECT COUNT(*)
              FROM ${AnswerTable} ant
              WHERE ant.question_id = qt.id
            ) AS answer_count,
            COALESCE(
              (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', tt.id,
                    'name', tt.name
                  )
                )
                FROM ${QuestionTagTable} qtt
                INNER JOIN ${TagTable} tt ON tt.id = qtt.tag_id
                WHERE qtt.question_id = qt.id
              ),
              '[]'::jsonb
            ) AS tags
          FROM ${QuestionTable} qt
          INNER JOIN ${user} ut ON ut.id = qt.user_id
          WHERE qt.user_id = ${userId}
          ORDER BY qt.views DESC, qt.created_at DESC
          LIMIT 6
        ) AS top_posts
      )`,
    })
    .from(user)
    .where(eq(user.id, userId));

  if (!userProfile) {
    throw new Error("User profile not found.");
  }

  const criteriaMap = [
    {
      criteria: BADGE_CRITERIA.QUESTION_COUNT,
      value: userProfile.questionCount,
    },
    {
      criteria: BADGE_CRITERIA.ANSWER_COUNT,
      value: userProfile.answerCount,
    },
    {
      criteria: BADGE_CRITERIA.QUESTION_UPVOTES,
      value: userProfile.totalQuestionUpvotes,
    },
    {
      criteria: BADGE_CRITERIA.ANSWER_UPVOTES,
      value: userProfile.totalAnswerUpVotes,
    },
    {
      criteria: BADGE_CRITERIA.TOTAL_VIEWS,
      value: userProfile.totalViews,
    },
  ];

  const badgeCount = { BRONZE: 0, SILVER: 0, GOLD: 0 };

  for (const { criteria, value } of criteriaMap) {
    if (value >= criteria.GOLD) {
      badgeCount.GOLD += 1;
    } else if (value >= criteria.SILVER) {
      badgeCount.SILVER += 1;
    } else if (value >= criteria.BRONZE) {
      badgeCount.BRONZE += 1;
    }
  }

  return { ...userProfile, ...badgeCount };
};

export type GetUserProfileOutputType = GetActionOutput<typeof getUserProfile>;
