import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center justify-center w-fit rounded-md p-2 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sidebar text-muted-foreground hover:bg-sidebar/80",
        accent: "bg-accent hover:bg-accent/80 hover:text-foreground",
        card: "bg-card hover:bg-card/80 text-foreground border",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TagProps extends VariantProps<typeof tagVariants> {
  id: string;
  name: string;
  className?: string;
}

export const Tag = ({ id, name, variant, size, className }: TagProps) => {
  return (
    <Link
      href={`/tags/${id}`}
      className={cn(tagVariants({ variant, size }), className)}
    >
      {name}
    </Link>
  );
};
