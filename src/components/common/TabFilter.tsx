import React from "react";
import { cva, type VariantProps } from "@/lib/cva";

const tabVariants = cva("text-xs font-semibold transition", {
  variants: {
    variant: {
      rounded: "px-4 py-1.5 rounded-[28px]",
      sharp: "px-4 py-1.5 rounded-[6px]",
      compact: "h-[26px] px-3 rounded-full",
    },
    active: {
      true: "bg-black text-white",
      false: "bg-[#f1f1f3] text-black",
    },
  },
  defaultVariants: {
    variant: "rounded",
    active: false,
  },
});

interface TabFilterProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  variant?: VariantProps<typeof tabVariants>["variant"];
  className?: string;
}

export default function TabFilter({
  tabs,
  activeTab,
  onTabChange,
  variant = "rounded",
  className = "",
}: TabFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={tabVariants({ variant, active: activeTab === tab })}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

