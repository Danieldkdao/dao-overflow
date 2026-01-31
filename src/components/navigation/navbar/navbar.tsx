"use client"

import Image from "next/image";
import { Input } from "../../ui/input";
import { ThemeToggle } from "../../theme-toggle";
import { SearchIcon } from "lucide-react";
import { SidebarSheet } from "../sidebar/sidebar-sheet";
import { NavbarUser } from './navbar-user';
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b bg-sidebar">
      <Image
        src={theme === "light" ? "/images/logo-light.svg" : "/images/logo-dark.svg"}
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
      <div className="hidden md:flex p-2 bg-input/60 rounded-lg items-center flex-1 max-w-[550px]">
        <SearchIcon />
        <Input className="text-lg shadow-none border-none focus-visible:border-none focus-visible:ring-0" />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NavbarUser />
        <SidebarSheet />
      </div>
    </div>
  );
};
