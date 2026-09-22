import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-studio-border bg-studio-surface text-studio-secondary",
        accent:
          "border-studio-accent/30 bg-studio-accentMuted text-studio-accent",
        success:
          "border-studio-success/30 bg-studio-success/15 text-studio-success",
        warning:
          "border-studio-warning/30 bg-studio-warning/15 text-studio-warning",
        error:
          "border-studio-error/30 bg-studio-error/15 text-studio-error",
        outline:
          "border-studio-border text-studio-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
