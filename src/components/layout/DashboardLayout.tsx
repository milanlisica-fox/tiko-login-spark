import React, { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";
import { DASHBOARD_NAV } from "@/constants/navigation";
import { useActiveNav } from "@/hooks/useActiveNav";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");

  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => {
    setIsHelpOpen(false);
    setHelpMessage("");
  };

  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) return onNavigate(path);
    navigate(path);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const enhancedTopbarRight = React.isValidElement(TopbarRight)
    ? React.cloneElement(TopbarRight as React.ReactElement<any>, { onOpenHelp: openHelp })
    : TopbarRight;

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

      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[240px] p-0 sm:max-w-[260px]">
            <MobileSidebar
              navItems={DASHBOARD_NAV}
              activeName={activeName}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              logoSrc={logoSrc}
              logoDotSrc={logoDotSrc}
              onOpenHelp={() => {
                openHelp();
              }}
              onCloseSidebar={() => setIsMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title={title}
          Right={enhancedTopbarRight}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <section className="flex-1 overflow-y-auto">{children}</section>
      </main>

      <Dialog open={isHelpOpen} onOpenChange={(open) => (open ? setIsHelpOpen(true) : closeHelp())}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send a question to your Account Manager</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={helpMessage}
              onChange={(e) => setHelpMessage(e.target.value)}
              placeholder="Type your question here..."
              className="min-h-[160px] bg-[#f9f9f9] text-black"
            />
            <p className="text-xs text-black/80">
              We’ll route this directly to your Account Manager at Iris. Expect a response within one business day.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeHelp}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Question submitted");
                closeHelp();
              }}
              disabled={!helpMessage.trim()}
              className="bg-[#ffb546] text-black hover:bg-[#ffb546]/90"
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


