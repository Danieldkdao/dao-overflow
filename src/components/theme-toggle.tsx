"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

const themes = [
  {
    value: "light",
    icon: "sun.svg",
    label: "Light",
  },
  {
    value: "dark",
    icon: "moon.svg",
    label: "Dark",
  },
  {
    value: "system",
    icon: "computer.svg",
    label: "System",
  },
];

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const activeTheme = theme === "system" ? "system" : (resolvedTheme ?? theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={`/icons/${activeTheme === "light" ? "sun.svg" : activeTheme === "dark" ? "moon.svg" : "computer.svg"}`}
          alt="Theme icon"
          height={30}
          width={30}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((t) => (
          <DropdownMenuItem onClick={() => setTheme(t.value)} key={t.value} className="flex items-center gap-3">
            <Image
              src={`/icons/${t.icon}`}
              alt={`${t.value} mode icon`}
              height={20}
              width={20}
            />
            <label className="font-medium">{t.label}</label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
