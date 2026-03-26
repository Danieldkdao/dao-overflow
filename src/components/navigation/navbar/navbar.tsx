"use client";

import Image from "next/image";
import { ThemeToggle } from "../../theme-toggle";
import { SidebarSheet } from "../sidebar/sidebar-sheet";
import { NavbarUser } from "./navbar-user";
import { useTheme } from "next-themes";
import { GlobalSearchInput } from "@/components/general/global-search-input";
import { Suspense } from "react";

const GlobalSearchFallback = () => {
  return (
    <div className="hidden md:block w-full max-w-[550px]">
      <div className="h-[52px] rounded-lg border border-border bg-background dark:bg-input/40" />
    </div>
  );
};

export const Navbar = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b bg-sidebar">
      <Image
        src={
          resolvedTheme === "light"
            ? "/images/logo-light.svg"
            : "/images/logo-dark.svg"
        }
        alt="Logo image"
        width={200}
        height={100}
        className="hidden lg:block"
      />
      <Image
        src="/images/site-logo.svg"
        alt="Logo image"
        width={35}
        height={35}
        className="lg:hidden"
      />
      <Suspense fallback={<GlobalSearchFallback />}>
        <GlobalSearchInput />
      </Suspense>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NavbarUser />
        <SidebarSheet />
      </div>
    </div>
  );
};
