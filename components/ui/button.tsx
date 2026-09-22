import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-studio-accent disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-studio-primary text-studio-bg hover:bg-white shadow-sm font-semibold",
        accent:
          "bg-studio-accent text-studio-bg hover:bg-studio-accentHover shadow-sm font-semibold",
        secondary:
          "bg-studio-elevated text-studio-primary hover:bg-studio-border border border-studio-border",
        outline:
          "border border-studio-border bg-transparent text-studio-primary hover:bg-studio-surface hover:border-studio-borderHover",
        ghost:
          "text-studio-secondary hover:text-studio-primary hover:bg-studio-surface",
        danger:
          "bg-studio-error/15 text-studio-error border border-studio-error/30 hover:bg-studio-error/25",
        success:
          "bg-studio-success/15 text-studio-success border border-studio-success/30 hover:bg-studio-success/25",
        whatsapp:
          "bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/25 font-semibold",
      },
      size: {
        default: "h-9 px-3.5 py-2",
        sm: "h-8 rounded-md px-2.5 text-[11px]",
        lg: "h-11 rounded-lg px-6 text-sm",
        icon: "h-9 w-9 p-0",
        iconSm: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
