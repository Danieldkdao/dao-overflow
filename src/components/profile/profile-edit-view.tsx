import { Suspense } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const ProfileEditView = () => {
  return (
    <Suspense fallback={<ProfileEditLoading />}>
      <ProfileEditSuspense />
    </Suspense>
  );
};

const ProfileEditLoading = () => {
  return <div>Loading...</div>;
};

const ProfileEditSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in");
  return <ProfileEditForm user={session.user} />;
};
