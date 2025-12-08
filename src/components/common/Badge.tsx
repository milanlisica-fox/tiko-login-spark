import React from "react";
import { cva, type VariantProps } from "@/lib/cva";

const badgeVariants = cva("inline-flex items-center justify-center rounded-[12px] text-xs px-2 py-[2px] whitespace-nowrap", {
  variants: {
    intent: {
      creation: "bg-[#0177C70D] text-[#0177C7]",
      adaptation: "bg-[#8092DC0D] text-[#8092DC]",
      resize: "bg-[#00C3B10F] text-[#00C3B1]",
      default: "bg-[#f9f9f9] text-[#646464]",
    },
    size: {
      sm: "h-5",
      md: "h-5",
    },
    width: {
      auto: "",
      creation: "w-[61px]",
      adaptation: "w-[75px]",
      resize: "w-[50px]",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "md",
    width: "auto",
  },
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants> & { label: string };

export default function Badge({ label, intent, size, width, className = "", ...rest }: BadgeProps) {
  return (
    <span className={badgeVariants({ intent, size, width, className })} {...rest}>
      {label}
    </span>
  );
}


