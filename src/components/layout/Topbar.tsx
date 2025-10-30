import React from "react";
import NotificationsPopover from "@/components/layout/NotificationsPopover";
import UserMenu from "@/components/layout/UserMenu";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title, Right }: { title: React.ReactNode; Right?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-4">
      <div className="flex items-center gap-2 px-4 py-4">
        {typeof title === "string" ? (
          <span className="text-sm text-black">{title}</span>
        ) : (
          title
        )}
      </div>
      <div className="flex items-center gap-6 pr-[30px]">
        {Right ?? (
          <>
            <NotificationsPopover />
            <div className="flex items-center gap-1">
              <Coins size={20} className="text-[#848487]" />
              <span className="text-xs leading-[15.96px] text-[#646464]">372 Tokens</span>
            </div>
            <UserMenu name="Henry Bray" dept="Marcomms" onClick={() => navigate("/dashboard/profile")} />
          </>
        )}
      </div>
    </header>
  );
}


