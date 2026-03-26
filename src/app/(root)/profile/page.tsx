import { ProfileIdLoading } from "@/components/profile/profile-id-view";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const ProfilePage = () => {
  return (
    <Suspense fallback={<ProfileIdLoading />}>
      <ProfileSuspense />
    </Suspense>
  );
};

const ProfileSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const redirectUrl = session ? `/profile/${session.user.id}` : "/sign-in";
  return redirect(redirectUrl);
};

export default ProfilePage;
