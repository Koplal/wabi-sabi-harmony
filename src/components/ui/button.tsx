import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-[all] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-sans uppercase tracking-wider text-xs",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none",
        outline: "border border-border bg-transparent hover:bg-secondary rounded-none font-sans uppercase tracking-wider text-xs",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted rounded-none",
        ghost: "hover:bg-secondary/50 rounded-none font-sans uppercase tracking-wider text-xs",
        sage: "bg-accent text-accent-foreground hover:bg-accent/80 rounded-none font-sans uppercase tracking-wider text-xs",
        link: "text-primary underline-offset-4 hover:underline font-sans",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-6",
        lg: "h-14 px-12",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
