import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FieldProps = {
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Field({ label, helpText, children, className = "" }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <label className="text-sm font-bold leading-[18.62px] text-black">{label}</label>
      ) : null}
      {children}
      {helpText ? (
        <p className="text-xs leading-[15.96px] text-[#848487]">{helpText}</p>
      ) : null}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-bold leading-[18.62px] text-black">{children}</label>;
}

export function FieldHelp({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-[15.96px] text-[#848487]">{children}</p>;
}

export function FieldRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex gap-4 ${className}`}>{children}</div>;
}

export function FieldCol({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex-1 flex flex-col gap-2 ${className}`}>{children}</div>;
}


