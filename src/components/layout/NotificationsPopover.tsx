import React from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 relative cursor-pointer">
          <Bell size={24} className="text-[#848487]" />
          <div className="absolute -left-1 -top-1 min-w-[20px] h-5 bg-[#ff4337] border-2 border-[#f7f7f7] rounded-full flex items-center justify-center px-1">
            <span className="text-[10px] font-bold leading-[14px] text-white">3</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} className="w-80 p-0 bg-white border border-[#e0e0e0] shadow-lg">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h3 className="text-base font-bold leading-[21.28px] text-black">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">New brief submitted</p>
                <p className="text-xs leading-[15.96px] text-[#646464]">Sarah Johnson submitted a new brief for review</p>
                <p className="text-xs leading-[15.96px] text-[#848487] mt-1">2 hours ago</p>
              </div>
              <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
            </div>
          </div>
          <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">Project milestone reached</p>
                <p className="text-xs leading-[15.96px] text-[#646464]">"Fold Toolkit Q3 2025" has reached 50% completion</p>
                <p className="text-xs leading-[15.96px] text-[#848487] mt-1">5 hours ago</p>
              </div>
              <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
            </div>
          </div>
          <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">Brief approved</p>
                <p className="text-xs leading-[15.96px] text-[#646464]">Your brief "S Series OOH Campaign" has been approved</p>
                <p className="text-xs leading-[15.96px] text-[#848487] mt-1">1 day ago</p>
              </div>
              <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
            </div>
          </div>
        </div>
        <div className="p-3 border-t border-[#e0e0e0]">
          <button className="w-full text-xs font-semibold leading-[15.96px] text-[#646464] hover:text-black transition">View all notifications</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


