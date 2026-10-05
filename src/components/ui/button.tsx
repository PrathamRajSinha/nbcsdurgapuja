import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import lotusAsset from "@/assets/lotus.png.asset.json";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        festival: "lotus-button rounded-none border border-primary bg-primary text-primary-foreground uppercase tracking-widest shadow-none",
        ink: "rounded-none border-b border-foreground bg-transparent px-0 text-foreground shadow-none hover:gap-4",
        gold: "lotus-button rounded-none border border-gold bg-gold text-kali shadow-none",
        donate: "lotus-button rounded-none border border-vermilion bg-vermilion text-primary-foreground shadow-none",
        navIcon: "rounded-full border border-border/70 bg-background/70 text-foreground shadow-none backdrop-blur-xl hover:bg-background",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        xl: "h-13 px-7 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const decorative = variant === "festival" || variant === "gold" || variant === "donate";
    const buttonStyle = decorative
      ? ({ ...style, "--button-lotus": `url(${lotusAsset.url})` } as React.CSSProperties)
      : style;
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} style={buttonStyle} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
