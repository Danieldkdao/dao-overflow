"use client";

import { cn } from "@/lib/utils";
import {
  BriefcaseBusinessIcon,
  CircleQuestionMarkIcon,
  HomeIcon,
  StarIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Community",
    href: "/community",
    icon: UsersIcon,
  },
  {
    label: "Collections",
    href: "/collections",
    icon: StarIcon,
  },
  {
    label: "Find Jobs",
    href: "/jobs",
    icon: BriefcaseBusinessIcon,
  },
  {
    label: "Tags",
    href: "/tags",
    icon: TagIcon,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
  {
    label: "Ask a question",
    href: "/new-question",
    icon: CircleQuestionMarkIcon,
  },
];

export const Navlinks = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-1 flex-1 overflow-y-auto">
      {links.map((link) => {
        const isActive = link.href === pathname;
        return (
          <Link key={link.label} href={link.href}>
            <div
              className={cn(
                "px-2 py-3 rounded-lg flex items-center gap-3",
                isActive
                  ? "bg-linear-to-r from-primary/80 to-primary/60"
                  : "transition hover:bg-primary/20",
              )}
            >
              <link.icon />
              <span className="font-medium">{link.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
