"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

type EmptyStateProps = {
  title: string;
  description: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full p-5 rounded-xl border border-dashed bg-card flex flex-col items-center gap-2">
      <Image
        src={
          resolvedTheme === "dark"
            ? "/images/dark-illustration.png"
            : "/images/light-illustration.png"
        }
        alt="Dark illustration image"
        width={200}
        height={150}
      />
      <h1 className="text-xl font-bold text-center">{title}</h1>
      <p className="text-muted-foreground text-sm text-center max-w-100">
        {description}
      </p>
    </div>
  );
};
