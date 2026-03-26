import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { SuspenseErrorBoundary } from "@/components/suspense-error-boundary";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SuspenseErrorBoundary
      title="We couldn't verify access to this page"
      description="Protected routes need an active session. The session lookup or redirect check failed before the page could render."
      fullScreen
    >
      <Suspense fallback={<ProtectedLayoutFallback />}>
        <ProtectedLayoutSuspense>{children}</ProtectedLayoutSuspense>
      </Suspense>
    </SuspenseErrorBoundary>
  );
};

export default ProtectedLayout;

const ProtectedLayoutFallback = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoadingState />
    </div>
  );
};

const ProtectedLayoutSuspense = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/sign-in");
  }

  return children;
};
