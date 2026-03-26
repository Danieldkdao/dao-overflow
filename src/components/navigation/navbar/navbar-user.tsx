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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NavbarUserSkeleton = () => {
  return <Skeleton className="size-8 shrink-0 rounded-full" />;
};

export const NavbarUser = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  if (isPending) return <NavbarUserSkeleton />;
  if (!data) return <div className="size-8 shrink-0" aria-hidden="true" />;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully!");
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to sign out. Try again or come back later.");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-8 shrink-0 items-center justify-center rounded-full">
        <UserAvatar
          name={data.user.name}
          image={data.user.image}
          className="size-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOutIcon className="text-destructive" />
          <label className="text-medium text-destructive">Sign out</label>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
