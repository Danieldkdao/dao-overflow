import { getUserProfile } from "@/lib/actions/user.action";
import { Suspense } from "react";
import { UserAvatar } from "../user-avatar";
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { QuestionsListClient } from "../questions/questions-list-client";
import { AnswersList } from "../answers/answers-list";
import { Tag } from "../tag";
import { Button } from "../ui/button";

import { Skeleton } from "../ui/skeleton";

type ProfileIdViewProps = {
  params: Promise<{ profileId: string }>;
};

export const ProfileIdView = (props: ProfileIdViewProps) => {
  return (
    <Suspense fallback={<ProfileIdLoading />}>
      <ProfileIdSuspense {...props} />
    </Suspense>
  );
};

const ProfileIdLoading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex gap-4 justify-between items-start flex-wrap">
        <div className="flex gap-4 items-start w-full md:w-auto">
          <Skeleton className="size-32 rounded-full shrink-0" />
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-4 flex-wrap">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-full md:w-32" />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Stats</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Top Tags</h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-8 w-16 md:w-20 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileIdSuspense = async ({ params }: ProfileIdViewProps) => {
  const { profileId } = await params;
  const profileData = await getUserProfile(profileId);

  const badgeMap = [
    {
      image: "/gold-medal.svg",
      label: "Gold",
      data: profileData.GOLD,
    },
    {
      image: "/silver-medal.svg",
      label: "Silver",
      data: profileData.SILVER,
    },
    {
      image: "/bronze-medal.svg",
      label: "Bronze",
      data: profileData.BRONZE,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex gap-4 justify-between items-start flex-wrap">
        <div className="flex gap-4 items-start">
          <UserAvatar
            name={profileData.name}
            image={profileData.image}
            className="size-32"
            textSize="text-5xl"
          />
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <span className="text-xl">@{profileData.username}</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {profileData.portfolioLink && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="size-4 text-muted-foreground" />
                  <Link
                    href={profileData.portfolioLink}
                    className="text-chart-2 font-medium"
                  >
                    Porfolio
                  </Link>
                </div>
              )}
              {profileData.location && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-muted-foreground" />
                  <span>{profileData.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <span>
                  Joined{" "}
                  {profileData.createdAt.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            {profileData.bio && (
              <p className="text-muted-foreground text-sm">{profileData.bio}</p>
            )}
          </div>
        </div>
        {profileData.isCurrentUser && (
          <Link href="/profile/edit">
            <Button variant="outline" size="lg" className="w-full md:w-auto">
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Stats</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-md border border-border bg-card p-8 flex items-center flex-wrap gap-2">
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-lg font-semibold">
              {profileData.questionCount}
            </span>
            <span>Questions</span>
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-lg font-semibold">
              {profileData.answerCount}
            </span>
            <span>Answers</span>
          </div>
        </div>
        {badgeMap.map((b) => (
          <div
            key={b.label}
            className="rounded-md border border-border bg-card p-8 flex items-center flex-wrap gap-2"
          >
            <div className="relative w-12 h-14 shrink-0">
              <Image
                src={b.image}
                alt={`${b.label} Medal Image`}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-2flex-1 ">
              <span className="text-lg font-semibold">{b.data}</span>
              <span>{b.label} Medals</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div>
          <Tabs defaultValue="posts" className="space-y-4">
            <TabsList className="h-auto">
              <TabsTrigger value="posts" className="px-6 py-1.5">
                Top Posts
              </TabsTrigger>
              <TabsTrigger value="answers" className="px-6 py-1.5">
                Top Answers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <QuestionsListClient
                truncateTitles
                showControls={profileData.isCurrentUser}
                questions={profileData.topPosts}
              />
            </TabsContent>
            <TabsContent value="answers">
              <AnswersList
                answers={profileData.topAnswers}
                showControls={profileData.isCurrentUser}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Top Tags</h3>
          <div className="space-y-4">
            {profileData.topTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between group"
              >
                <Tag
                  id={tag.id}
                  name={tag.name.toUpperCase()}
                  variant="accent"
                  className="line-clamp-2 uppercase p-2 border-none h-auto w-auto shrink text-foreground!"
                  size="sm"
                />
                <span className="text-sm font-medium">{tag.questionCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
