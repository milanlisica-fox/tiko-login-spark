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
      {/* Mobile/Tablet: Hamburger menu */}
      <div className="lg:hidden flex items-center">
        {onMobileMenuClick && (
          <button 
            onClick={onMobileMenuClick}
            className="p-1.5 rounded-lg hover:bg-gray-50 transition z-10"
          >
            <Menu size={20} className="text-black" />
          </button>
        )}
      </div>

      {/* Mobile/Tablet: Centered logo */}
      <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Logo variant="sidebar" logoSrc={BRAND.logo} logoDotSrc={BRAND.logoDot} className="max-w-[90px] pointer-events-auto" />
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
      <div className="flex items-center gap-2 md:gap-4 lg:gap-6 pr-2 lg:pr-[30px] sidenav-r z-10">
        {Right ?? (
          <>
            <NotificationsPopover />
            <button 
              onClick={() => navigate("/dashboard/tracker?tab=budget")}
              className="flex items-center gap-1 hover:opacity-70 transition cursor-pointer"
            >
              <TokensIcon size={18} className="text-[#848487] lg:w-5 lg:h-5" />
              <span className="text-xs leading-[15.96px] text-[#646464]">4,500 Tokens remaining this quarter</span>
            </button>
            <UserMenu name="Murray Gordon" dept="Marcomms" onClick={() => navigate("/dashboard/profile")} />
          </>
        )}
      </div>
    </header>
  );
}


