import React from "react";

type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "subtle" | "ghost";
  size?: "sm" | "md" | "lg";
};

const base = "rounded-[28px] flex items-center justify-center gap-[10px] transition";

const sizeClasses: Record<NonNullable<PillButtonProps["size"]>, string> = {
  sm: "h-8 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-[44px] px-6 text-base",
};

const variantClasses: Record<NonNullable<PillButtonProps["variant"]>, string> = {
  primary: "bg-[#03b3e2] text-black hover:opacity-90",
  accent: "bg-[#ffb546] text-black hover:opacity-90",
  subtle: "bg-transparent text-[#848487] hover:opacity-80",
  ghost: "bg-transparent text-black hover:opacity-80",
};

export function PillButton({ variant = "primary", size = "md", className = "", children, ...rest }: PillButtonProps) {
  return (
    <button className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...rest}>
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


