"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { authClient } from "@/lib/auth/auth-client";
import { LogOutIcon } from "lucide-react";

export const NavbarUser = () => {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <Skeleton className="size-8 rounded-full" />;
  if (!data) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar name={data.user.name} image={data.user.image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => authClient.signOut()}
          className="flex items-center gap-2"
        >
          <LogOutIcon className="text-destructive" />
          <label className="text-medium text-destructive">Sign out</label>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
