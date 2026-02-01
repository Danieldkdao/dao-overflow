import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<AuthLayoutFallback />}>
      <AuthLayoutSuspense>{children}</AuthLayoutSuspense>
    </Suspense>
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
