import React from "react";

export default function TokenEstimate({ value }: { value: number | string }) {
  return (
    <div className="flex gap-2 items-center pb-2">
      <img src={"https://www.figma.com/api/mcp/asset/9b4ee3b2-4fab-4d57-a716-36af1bfb4291"} alt="" className="h-5 w-5" />
      <span className="text-[13px] leading-[18.62px] text-black">{value}</span>
      <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
    </div>
  );
}


