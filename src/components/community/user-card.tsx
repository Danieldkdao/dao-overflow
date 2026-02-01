import { User } from "@/lib/auth/auth";
import { UserAvatar } from "../user-avatar";
import Link from "next/link";

export const UserCard = ({ user }: { user: User }) => {
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
        {/*todo: add tags*/}
      </div>
    </Link>
  );
};
