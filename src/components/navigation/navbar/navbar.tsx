"use client";

import Image from "next/image";
import { ThemeToggle } from "../../theme-toggle";
import { SidebarSheet } from "../sidebar/sidebar-sheet";
import { NavbarUser } from "./navbar-user";
import { useTheme } from "next-themes";
import { GlobalSearchInput } from "@/components/general/global-search-input";

export const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b bg-sidebar">
      <Image
        src={
          theme === "light" ? "/images/logo-light.svg" : "/images/logo-dark.svg"
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
      <GlobalSearchInput />

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NavbarUser />
        <SidebarSheet />
      </div>
    </div>
  );
};
