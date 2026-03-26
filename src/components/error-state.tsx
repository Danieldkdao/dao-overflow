"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

type ErrorStateProps = {
  title: string;
  description: string;
  fullScreen?: boolean;
  className?: string;
};

export const ErrorState = ({
  title,
  description,
  fullScreen = false,
  className,
}: ErrorStateProps) => {
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center px-4 py-10",
        fullScreen && "min-h-screen",
        className,
      )}
    >
      <Card className="w-full max-w-xl border-destructive/25 bg-destructive/5 shadow-none">
        <CardHeader className="flex flex-col items-center text-center">
          <Image
            src={
              resolvedTheme === "dark"
                ? "/images/dark-error.png"
                : "/images/light-error.png"
            }
            alt="Error Image"
            width={200}
            height={200}
          />
          <CardTitle className="text-xl text-destructive">{title}</CardTitle>
          <CardDescription className="max-w-lg text-sm leading-6">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 text-center text-sm text-muted-foreground">
          Refresh the page or try again in a moment.
        </CardContent>
      </Card>
    </div>
  );
};
