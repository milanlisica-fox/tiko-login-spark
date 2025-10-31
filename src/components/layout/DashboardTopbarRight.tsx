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
}

export default function DashboardTopbarRight({
  tokenCount = 372,
  userName = "Henry Bray",
  userDept = "Marcomms",
  avatarSrc,
}: DashboardTopbarRightProps) {
  const navigate = useNavigate();

  return (
    <>
      <NotificationsPopover />
      <div className="flex items-center gap-1">
        <Icons.tokens size={20} className="text-[#848487]" />
        <span className="text-xs leading-[15.96px] text-[#646464]">{tokenCount} Tokens</span>
      </div>
      <button
        onClick={() => navigate("/dashboard/profile")}
        className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
      >
        <HBAvatar size={40} src={avatarSrc} />
        <div className="flex-col hidden md:flex">
          <p className="text-sm font-bold leading-[18.62px] text-[#646464]">{userName}</p>
          <p className="text-xs leading-[15.96px] text-[#646464]">{userDept}</p>
        </div>
        <Icons.chevronDown size={24} className="text-[#646464] rotate-90 hidden md:block" />
      </button>
    </>
  );
}

