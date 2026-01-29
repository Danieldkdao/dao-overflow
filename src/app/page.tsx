"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const { data } = authClient.useSession();
  return (
    <div>
      <ThemeToggle />
      {data && (
        <>
          <p>{data.user?.name} is logged in</p>
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: { onSuccess: () => router.push("/sign-in") },
              })
            }
          >
            Sign out
          </Button>
        </>
      )}
    </div>
  );
};

export default HomePage;
