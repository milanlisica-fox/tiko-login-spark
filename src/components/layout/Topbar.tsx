import React from "react";
import NotificationsPopover from "@/components/layout/NotificationsPopover";
import UserMenu from "@/components/layout/UserMenu";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/constants/icons";
import { BRAND } from "@/constants/branding";
import { Menu } from "lucide-react";

export default function Topbar({ 
  title, 
  Right,
  onMobileMenuClick,
}: { 
  title: React.ReactNode; 
  Right?: React.ReactNode;
  onMobileMenuClick?: () => void;
}) {
  const navigate = useNavigate();
  const TokensIcon = Icons.tokens;
  return (
    <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-2 md:px-4 lg:px-6 relative">
      {/* Mobile/Tablet: Hamburger menu + centered logo */}
      <div className="lg:hidden flex items-center justify-center flex-1 relative">
        {onMobileMenuClick && (
          <button 
            onClick={onMobileMenuClick}
            className="absolute left-0 p-1.5 rounded-lg hover:bg-gray-50 transition z-10"
          >
            <Menu size={20} className="text-black" />
          </button>
        )}
        <Logo variant="sidebar" logoSrc={BRAND.logo} logoDotSrc={BRAND.logoDot} className="max-w-[90px]" />
      </div>

      {/* Desktop: Title on left */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-4">
        {typeof title === "string" ? (
          <span className="text-sm text-black">{title}</span>
        ) : (
          title
        )}
      </div>

      {/* Right side content */}
      <div className="flex items-center gap-2 md:gap-4 lg:gap-6 pr-2 lg:pr-[30px]">
        {Right ?? (
          <>
            <NotificationsPopover />
            <div className="hidden md:flex items-center gap-1">
              <TokensIcon size={18} className="text-[#848487] lg:w-5 lg:h-5" />
              <span className="text-xs leading-[15.96px] text-[#646464]">372 Tokens</span>
            </div>
            <UserMenu name="Henry Bray" dept="Marcomms" onClick={() => navigate("/dashboard/profile")} />
          </>
        )}
      </div>
    </header>
  );
}


