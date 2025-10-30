import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { DASHBOARD_NAV } from "@/constants/navigation";
import { useActiveNav } from "@/hooks/useActiveNav";

export default function DashboardLayout({
  title,
  children,
  onNavigate,
  onLogout,
  logoSrc,
  logoDotSrc,
  TopbarRight,
}: {
  title: ReactNode;
  children: ReactNode;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  logoSrc: string;
  logoDotSrc?: string;
  TopbarRight?: ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeName } = useActiveNav(location.pathname);

  const handleNavigate = (path: string) => {
    if (onNavigate) return onNavigate(path);
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-[#f9f9f9]">
      <Sidebar
        navItems={DASHBOARD_NAV}
        activeName={activeName}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        logoSrc={logoSrc}
        logoDotSrc={logoDotSrc}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} Right={TopbarRight} />
        <section className="flex-1 overflow-y-auto">{children}</section>
      </main>
    </div>
  );
}


