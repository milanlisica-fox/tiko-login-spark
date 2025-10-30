import React from "react";

export default function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: color }} />
      <span className="text-[#646464] text-sm">{label}</span>
    </div>
  );
}


