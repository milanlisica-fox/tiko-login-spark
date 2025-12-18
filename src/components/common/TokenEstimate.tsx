import React from "react";
import { PoundSterling } from "lucide-react";

export default function TokenEstimate({ value }: { value: number | string }) {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  
  return (
    <div className="flex gap-2 items-center pb-2">
      <span className="h-5 w-5 flex items-center justify-center">
        <PoundSterling size={20} className="text-[#03B3E2]" />
      </span>
      <span className="text-[13px] leading-[18.62px] text-black">£{numericValue}</span>
      <span className="text-[13px] leading-[18.62px] text-[#848487]">Pounds estimate</span>
    </div>
  );
}


