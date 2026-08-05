import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#5E43F3]/15 text-[#7158F5] border-[#5E43F3]/30",
        secondary: "border-transparent bg-white/5 text-[#EDEDED]",
        destructive: "border-transparent bg-destructive/10 text-destructive border-destructive/20",
        outline: "text-zinc-400 border-white/10",
        emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
