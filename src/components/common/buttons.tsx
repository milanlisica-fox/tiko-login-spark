import React from "react";
import { cva, type VariantProps } from "@/lib/cva";

const buttonVariants = cva("pill-base", {
  variants: {
    variant: {
      primary: "bg-[var(--color-brand)] text-black hover:opacity-90",
      accent: "bg-[var(--color-accent)] text-black hover:opacity-90",
      subtle: "bg-transparent text-[var(--color-muted)] hover:opacity-80",
      ghost: "bg-transparent text-black hover:opacity-80",
    },
    size: {
      sm: "h-8 px-4 text-sm",
      md: "h-10 px-5 text-sm",
      lg: "h-[44px] px-6 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function PillButton({ variant, size, className = "", children, ...rest }: PillButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

export const PillPrimary: React.FC<Omit<PillButtonProps, "variant">> = (props) => (
  <PillButton variant="primary" {...props} />
);
export const PillAccent: React.FC<Omit<PillButtonProps, "variant">> = (props) => (
  <PillButton variant="accent" {...props} />
);
export const PillSubtle: React.FC<Omit<PillButtonProps, "variant">> = (props) => (
  <PillButton variant="subtle" {...props} />
);
export const PillGhost: React.FC<Omit<PillButtonProps, "variant">> = (props) => (
  <PillButton variant="ghost" {...props} />
);


