import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export const SidebarAuthButtons = () => {
  return (
    <Suspense fallback={<SidebarAuthButtonsLoading />}>
      <SidebarAuthButtonsSuspense />
    </Suspense>
  );
};

const SidebarAuthButtonsLoading = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
};

const SidebarAuthButtonsSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) return null;

  return (
    <div className="flex flex-col gap-2">
      <Link href="/sign-in">
        <Button className="w-full">Sign in</Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="outline" className="w-full">
          Sign up
        </Button>
      </Link>
    </div>
  );
};
