import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TokenEstimate({ value }: { value: number | string }) {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const poundsValue = numericValue * 5;
  
  return (
    <div className="flex gap-2 items-center pb-2">
      <span className="h-5 w-5 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10.0016 16.6012C13.3865 16.6012 16.1306 15.5303 16.1306 14.2093C16.1306 12.8882 13.3865 11.8173 10.0016 11.8173C6.61662 11.8173 3.87256 12.8882 3.87256 14.2093C3.87256 15.5303 6.61662 16.6012 10.0016 16.6012Z" fill="#03B3E2" />
          <path d="M10.0016 7.54461C13.387 7.54461 16.1306 8.61587 16.1306 9.93653C16.1306 11.2572 13.387 12.3284 10.0016 12.3284C6.6161 12.3284 3.87256 11.2572 3.87256 9.93653C3.87256 8.61587 6.6161 7.54461 10.0016 7.54461Z" fill="#03B3E2" />
          <path d="M10.0018 8.05164C13.3867 8.05164 16.1308 6.98073 16.1308 5.65972C16.1308 4.33871 13.3867 3.26782 10.0018 3.26782C6.61682 3.26782 3.87276 4.33871 3.87276 5.65972C3.87276 6.98073 6.61682 8.05164 10.0018 8.05164Z" fill="#03B3E2" />
        </svg>
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-[13px] leading-[18.62px] text-black cursor-help">£{poundsValue}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Each token is worth 5 pounds</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
    </div>
  );
}


