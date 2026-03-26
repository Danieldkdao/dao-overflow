import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingClient } from "./client";
import { LoadingState } from "@/components/loading-state";
import { SuspenseErrorBoundary } from "@/components/suspense-error-boundary";

const OnboardingPage = () => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't load onboarding"
      description="This flow depends on your session and username status. That check failed before the onboarding form could render."
      fullScreen
    >
      <Suspense fallback={<OnboardingPageFallback />}>
        <OnboardingPageSuspense />
      </Suspense>
    </SuspenseErrorBoundary>
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
