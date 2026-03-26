import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { SuspenseErrorBoundary } from "@/components/suspense-error-boundary";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't load authentication"
      description="This area checks whether you should see sign-in, sign-up, or onboarding. Session resolution failed before the page could render."
      fullScreen
    >
      <Suspense fallback={<AuthLayoutFallback />}>
        <AuthLayoutSuspense>{children}</AuthLayoutSuspense>
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

export default AuthLayout;

const AuthLayoutFallback = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoadingState />
    </div>
  );
};

const AuthLayoutSuspense = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    if (session.user.username) {
      return redirect("/");
    } else {
      return redirect("/onboarding");
    }
  }
  return children;
};
