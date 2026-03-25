import { GetUsersOutput } from "@/lib/actions/user.action";
import { UserAvatar } from "../user-avatar";
import Link from "next/link";
import { Tag } from "../tag";

export const UserCard = ({
  user,
}: {
  user: NonNullable<GetUsersOutput>["users"][number];
}) => {
  return (
    <Link href={`/profile/${user.id}`} className="block w-full min-w-0">
      <div className="p-6 rounded-xl border flex flex-col items-center gap-2 w-full max-w-full min-w-0">
        <UserAvatar
          name={user.name}
          image={user.name}
          className="size-20"
          textSize="text-2xl"
        />
        <h1 className="text-2xl font-bold truncate w-full text-center">
          {user.name}
        </h1>
        <p className="text-chart-2/60 truncate w-full text-center">
          @{user.username}
        </p>
        <div className="w-full flex items-center gap-2 justify-center">
          {user.topTags.length ? (
            user.topTags.map((t) => (
              <Tag
                key={t.id}
                id={t.id}
                name={t.name}
                className="bg-sidebar max-w-1/3 truncate w-full rounded-md p-2 text-xs text-muted-foreground block text-left"
              />
            ))
          ) : (
            <div className="bg-sidebar truncate w-fit rounded-md p-2 text-xs text-muted-foreground">
              NO TAGS YET
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
