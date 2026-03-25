import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const redirectUrl = session ? `/profile/${session.user.id}` : "/sign-in";
  return redirect(redirectUrl);
};

export default ProfilePage;
