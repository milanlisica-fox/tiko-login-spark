import React from "react";
import Logo from "./Logo";
import { LogOut, LucideIcon } from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

type NavItem = { name: string; icon: LucideIcon; path: string };

interface MobileSidebarProps {
  navItems: NavItem[];
  activeName: string;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  logoSrc: string;
  logoDotSrc?: string;
}

export default function MobileSidebar({
  navItems,
  activeName,
  onNavigate,
  onLogout,
  logoSrc,
  logoDotSrc,
}: MobileSidebarProps) {
  const defaultLogout = useLogout();
  const logout = onLogout ?? defaultLogout;

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7] border-r border-[#d9d9d9]">
      <div className="flex-1">
        <div className="h-[70px] flex items-center justify-center px-8 py-4 border-b border-[#d9d9d9]">
          <Logo variant="sidebar" logoSrc={logoSrc} logoDotSrc={logoDotSrc} />
        </div>
        <nav className="pt-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeName === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition ${
                  isActive ? "bg-white" : "hover:bg-white/50"
                }`}
              >
                <Icon size={20} className="text-black" />
                <span className={`text-base ${isActive ? "font-semibold" : "font-normal"} text-black`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="px-4 pb-8 border-t border-[#d9d9d9] pt-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-lg transition hover:bg-white/50"
        >
          <LogOut size={20} className="text-black" />
          <span className="text-base font-normal text-black">Logout</span>
        </button>
      </div>
    </div>
  );
}
