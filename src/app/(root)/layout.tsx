import { LeftSidebar } from "@/components/navigation/sidebar/left-sidebar";
import { Navbar } from "@/components/navigation/navbar/navbar";
import { RightSidebar } from "@/components/navigation/right-sidebar";
import { ReactNode, Suspense } from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoadingState } from "@/components/loading-state";
import "@mdxeditor/editor/style.css";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<RootLayoutFallback />}>
      <RootLayoutSuspense>{children}</RootLayoutSuspense>
    </Suspense>
  );
};

export default RootLayout;

const RootLayoutFallback = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoadingState />
    </div>
  );
};

const RootLayoutSuspense = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session && !session.user.username) {
    return redirect("/onboarding");
  }
  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div className="flex flex-1 h-full overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
        <RightSidebar />
      </div>
    </div>
  );
};
