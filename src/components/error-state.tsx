"use client";

import { TriangleAlertIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
          <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
            <TriangleAlertIcon className="size-7 text-destructive" />
          </div>
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
