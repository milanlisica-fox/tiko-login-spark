import React, { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";
import { DASHBOARD_NAV } from "@/constants/navigation";
import { useActiveNav } from "@/hooks/useActiveNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) return onNavigate(path);
    navigate(path);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    onLogout?.();
  };

  return (
    <div className="flex h-screen bg-[#f9f9f9]">
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <Sidebar
        navItems={DASHBOARD_NAV}
        activeName={activeName}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        logoSrc={logoSrc}
        logoDotSrc={logoDotSrc}
      />

      {/* Mobile/Tablet Sidebar - Slide-out sheet - Only show on < 1024px */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[240px] p-0 sm:max-w-[240px]">
            <MobileSidebar
              navItems={DASHBOARD_NAV}
              activeName={activeName}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              logoSrc={logoSrc}
              logoDotSrc={logoDotSrc}
            />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar 
          title={title} 
          Right={TopbarRight}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <section className="flex-1 overflow-y-auto">{children}</section>
      </main>
    </div>
  );
}


