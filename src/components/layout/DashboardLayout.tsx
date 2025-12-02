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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [helpType, setHelpType] = useState<"account-manager" | "report-bug">("account-manager");

  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => {
    setIsHelpOpen(false);
    setHelpMessage("");
    setHelpType("account-manager");
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
            <DialogTitle>Send a question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select recipient</Label>
              <RadioGroup value={helpType} onValueChange={(value) => setHelpType(value as "account-manager" | "report-bug")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="account-manager" id="account-manager" />
                  <Label htmlFor="account-manager" className="font-normal cursor-pointer">
                    Account Manager
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="report-bug" id="report-bug" />
                  <Label htmlFor="report-bug" className="font-normal cursor-pointer">
                    Report a bug
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Textarea
              value={helpMessage}
              onChange={(e) => setHelpMessage(e.target.value)}
              placeholder={helpType === "account-manager" ? "Type your question here..." : "Describe the bug you encountered..."}
              className="min-h-[160px] bg-[#f9f9f9] text-black"
            />
            <p className="text-xs text-black/80">
              {helpType === "account-manager"
                ? "We'll route this directly to your Account Manager at Iris. Expect a response within one business day."
                : "We'll review your bug report and get back to you as soon as possible."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeHelp}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success(helpType === "account-manager" ? "Question submitted" : "Bug report submitted");
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


