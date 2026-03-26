import { Suspense } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SuspenseErrorBoundary } from "@/components/suspense-error-boundary";

export const ProfileEditView = () => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't load your profile editor"
      description="Your session may have expired, or your profile details could not be prepared for editing."
    >
      <Suspense fallback={<ProfileEditLoading />}>
        <ProfileEditSuspense />
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

const ProfileEditLoading = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="min-h-16 w-full" />
      </div>
      <Skeleton className="h-9 w-32 self-end" />
    </div>
  );
};

const ProfileEditSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in");
  return <ProfileEditForm user={session.user} />;
};
