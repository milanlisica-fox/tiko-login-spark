import React from "react";
import { Input, InputProps } from "@/components/ui/input";
import { cva, type VariantProps } from "@/lib/cva";

const inputVariants = cva("", {
  variants: {
    variant: {
      login: "h-14 rounded-full bg-input text-secondary px-6 text-base border-0 focus-visible:ring-2 focus-visible:ring-accent",
      signup: "h-12 rounded-[28px] bg-white text-[#848487] px-6 text-sm border-0 focus-visible:ring-2 focus-visible:ring-accent placeholder:text-[#848487]",
      brief: "border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto bg-[#f9f9f9] text-black placeholder:text-[#848487]",
    },
  },
  defaultVariants: {
    variant: "login",
  },
});

export interface StyledInputProps extends Omit<InputProps, "className">, VariantProps<typeof inputVariants> {
  className?: string;
}

export function StyledInput({ variant, className = "", ...props }: StyledInputProps) {
  return <Input className={inputVariants({ variant, className })} {...props} />;
}

