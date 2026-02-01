import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export const LoadingState = ({
  title = "Loading...",
  description = "This may take a few seconds",
  className,
}: LoadingStateProps) => {
  return (
    <div
      className={cn(
        className,
        "border bg-card rounded-xl p-5 flex flex-col items-center gap-2",
      )}
    >
      <Loader2Icon className="text-primary animate-spin size-10" />
      <h1 className="text-3xl font-bold text-center">{title}</h1>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </div>
  );
};
