import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<ProtectedLayoutFallback />}>
      <ProtectedLayoutSuspense>{children}</ProtectedLayoutSuspense>
    </Suspense>
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
