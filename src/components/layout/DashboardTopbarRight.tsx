import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationsPopover from "@/components/layout/NotificationsPopover";
import HBAvatar from "@/components/common/HBAvatar";
import { Icons } from "@/constants/icons";

interface DashboardTopbarRightProps {
  tokenCount?: number;
  userName?: string;
  userDept?: string;
  avatarSrc?: string;
  onOpenHelp?: () => void;
}

export default function DashboardTopbarRight({
  tokenCount = 4500,
  userName = "Murray Gordon",
  userDept = "Marcomms",
  avatarSrc,
  onOpenHelp,
}: DashboardTopbarRightProps) {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => onOpenHelp?.()}
        className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-[28px] border border-[#d0d0d0] text-[#646464] hover:bg-[#f1f1f3] transition"
      >
        <Icons.help size={16} />
        <span className="text-sm font-semibold leading-[23.94px] whitespace-nowrap">Help</span>
      </button>
      <NotificationsPopover />
      <button
        onClick={() => navigate("/dashboard/tracker?tab=budget")}
        className="flex items-center gap-1 hover:opacity-70 transition cursor-pointer"
      >
        <Icons.tokens size={18} className="text-[#848487] lg:w-5 lg:h-5" />
        <span className="text-xs leading-[15.96px] text-[#646464]">{tokenCount} Tokens remaining this quarter</span>
      </button>
      <button
        onClick={() => navigate("/dashboard/profile")}
        className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
      >
        <HBAvatar size={40} src={avatarSrc} />
        <div className="flex-col hidden lg:flex">
          <p className="text-sm font-bold leading-[18.62px] text-[#646464]">{userName}</p>
          <p className="text-xs leading-[15.96px] text-[#646464]">{userDept}</p>
        </div>
        <Icons.chevronDown size={24} className="text-[#646464] rotate-90 hidden lg:block" />
      </button>
    </>
  );
}

