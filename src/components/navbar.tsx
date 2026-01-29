import Image from "next/image";
import { Input } from "./ui/input";
import { ThemeToggle } from "./theme-toggle";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <div className="flex items-center justify-between py-4 px-6">
      <Image
        src="/images/logo-dark.svg"
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
      <div className="hidden md:flex p-2 bg-input rounded-lg items-center flex-1 max-w-[550px]">
        <Image
          src="/icons/search.svg"
          alt="Search icon"
          width={20}
          height={20}
        />
        <Input className="text-lg shadow-none border-none focus-visible:border-none focus-visible:ring-0" />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button size="icon" variant="ghost" className="md:hidden">
          <MenuIcon className="size-8"/>
        </Button>
      </div>
    </div>
  );
};
