import React from "react";
import Logo from "./Logo";
import { LogOut, Settings, LucideIcon } from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

type NavItem = { name: string; icon: LucideIcon; path: string };

export default function Sidebar({
  navItems,
  activeName,
  onNavigate,
  onLogout,
  logoSrc,
  logoDotSrc,
}: {
  navItems: NavItem[];
  activeName: string;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  logoSrc: string;
  logoDotSrc?: string;
}) {
  const defaultLogout = useLogout();
  const logout = onLogout ?? defaultLogout;
  return (
    <aside className="hidden lg:flex w-[240px] bg-[#f7f7f7] border-r border-[#d9d9d9] flex-col justify-between">
      <div>
        <div className="h-[70px] flex items-center justify-start px-8 py-4">
          <Logo variant="sidebar" logoSrc={logoSrc} logoDotSrc={logoDotSrc} />
        </div>
        <div className="divider-line" />
        <nav className="pt-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeName === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-2 px-4 py-4 rounded-lg transition ${
                  isActive ? "bg-white" : "hover:bg-white/50"
                }`}
              >
                <Icon size={20} className="text-black" />
                <span className={`text-sm ${isActive ? "font-semibold" : "font-normal"} text-black`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="px-4 pb-8 flex flex-col gap-2">
        <button
          onClick={() => onNavigate("/dashboard/client-configuration")}
          className="w-full flex items-center gap-2 px-4 py-4 rounded-lg transition hover:bg-white/50"
        >
          <Settings size={20} className="text-black" />
          <span className="text-sm font-normal text-black">Client configuration</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-4 rounded-lg transition hover:bg-white/50"
        >
          <LogOut size={20} className="text-black" />
          <span className="text-sm font-normal text-black">Logout</span>
        </button>
      </div>
    </aside>
  );
}


