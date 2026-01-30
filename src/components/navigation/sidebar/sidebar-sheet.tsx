import { MenuIcon } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import Image from "next/image";
import { Navlinks } from "../navbar/nav-links";
import Link from "next/link";

export const SidebarSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="sm:hidden">
          <MenuIcon className="size-8" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle />
          <Image
            src="/images/logo-dark.svg"
            alt="Dao Overflow Logo"
            width={180}
            height={100}
          />
        </SheetHeader>
        <div className="px-4">
          <Navlinks />
          <div className="flex flex-col gap-2">
            <Link href="/sign-in">
              <Button className="w-full">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
