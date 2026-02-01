import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingClient } from "./client";
import { LoadingState } from "@/components/loading-state";

const OnboardingPage = () => {
  return (
    <Suspense fallback={<OnboardingPageFallback />}>
      <OnboardingPageSuspense />
    </Suspense>
  );
};

export default OnboardingPage;

const OnboardingPageFallback = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoadingState />
    </div>
  );
};

const OnboardingPageSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/sign-in");
  }
  if (session.user.id && session.user.username) {
    return redirect("/");
  }

  return <OnboardingClient />;
};
