import React from "react";
import HBAvatar from "@/components/common/HBAvatar";
import { ChevronDown } from "lucide-react";

type UserMenuProps = {
  name: string;
  dept: string;
  onClick?: () => void;
  avatarSize?: number;
  avatarSrc?: string;
};

export default function UserMenu({ name, dept, onClick, avatarSize = 40, avatarSrc }: UserMenuProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
      <HBAvatar size={avatarSize} src={avatarSrc} />
      <div className="flex flex-col">
        <p className="text-sm font-bold leading-[18.62px] text-[#646464]">{name}</p>
        <p className="text-xs leading-[15.96px] text-[#646464]">{dept}</p>
      </div>
      <ChevronDown size={24} className="text-[#646464] rotate-90" />
    </button>
  );
}


