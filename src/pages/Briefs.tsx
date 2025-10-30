import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HBAvatar from "@/components/common/HBAvatar";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Calculator, Coins, X, Calendar as CalendarIcon, ArrowLeft, Plus, ChevronDown as ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import confetti from "canvas-confetti";

// Reuse images from Dashboard for consistent visuals
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

// Template icons from Figma
const iconAssetAdaptation = "https://www.figma.com/api/mcp/asset/c1a556d8-686f-44f2-88a7-ae10c1e9e2f2";
const iconBAU = "https://www.figma.com/api/mcp/asset/97b7efb4-4c30-4c6a-b0f1-00389ded9baf";
const iconPOS = "https://www.figma.com/api/mcp/asset/5538e7d7-21fd-482e-a031-dbcda03fedf1";
const iconDigitalPOS = "https://www.figma.com/api/mcp/asset/313704f8-5070-4770-b5fe-eb44c650dc2f";
const iconFeatureAsset = "https://www.figma.com/api/mcp/asset/ec129011-0fa8-488e-bd49-a3ae85c02d77";
const iconToolkit = "https://www.figma.com/api/mcp/asset/835dc746-f8b7-47a1-8471-75138a491898";
const iconPartnerships = "https://www.figma.com/api/mcp/asset/c1a556d8-686f-44f2-88a7-ae10c1e9e2f2";
const iconSocialContent = "https://www.figma.com/api/mcp/asset/5538e7d7-21fd-482e-a031-dbcda03fedf1";
const arrowRightIcon = "https://www.figma.com/api/mcp/asset/aded2578-385a-4338-976a-dd31471fba50";

// New brief form images from Figma
const briefLoadingIcon = "https://www.figma.com/api/mcp/asset/72b9b00c-3cef-4290-a604-5a85dae49da4";
const tokenIcon = "https://www.figma.com/api/mcp/asset/9b4ee3b2-4fab-4d57-a716-36af1bfb4291";
const createBriefArrowIcon = "https://www.figma.com/api/mcp/asset/33c5c1d3-721c-423d-8e72-cd89fd07637c";

// Deliverables screen images from Figma
const imgFrame14 = "https://www.figma.com/api/mcp/asset/fe99575b-8465-4231-a868-ebd338d7488e";
const imgFrame15 = "https://www.figma.com/api/mcp/asset/73cdd6a7-1b90-41e6-92b7-d74d896ac41b";
const imgLine10 = "https://www.figma.com/api/mcp/asset/72de3633-cbde-4f52-a617-6480a78ffab1";
const imgLineStroke = "https://www.figma.com/api/mcp/asset/7526d27e-2d12-451f-8734-7948c58e1bb8";

// AI Response screen images from Figma
const imgLine11 = "https://www.figma.com/api/mcp/asset/eb5e3b99-c1d1-4c7f-8b76-b1d1f7328087";
const imgLine12 = "https://www.figma.com/api/mcp/asset/b0c33ab4-8352-4301-888e-175517ef6274";
const imgFrame14_v2 = "https://www.figma.com/api/mcp/asset/d26c3cfb-b903-4bcb-acad-deab88e4291e";
const imgFrame15_v2 = "https://www.figma.com/api/mcp/asset/47ce8115-0573-4c9b-87da-8910dfe4fced";
// Upload icon (match profile picture dialog)
const uploadIcon = "https://www.figma.com/api/mcp/asset/ddbd83a4-2dd8-426f-9875-8383e44a9aa0";

export default function BriefsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreatingBrief, setIsCreatingBrief] = useState(false);
  const [briefView, setBriefView] = useState<"templates" | "form" | "deliverables" | "ai-response">("templates");
  const [aiInputText, setAiInputText] = useState("");

  // Check if we should show the form directly from navigation state or reset to overview
  useEffect(() => {
    const state = location.state as { createBrief?: boolean; showForm?: boolean; resetToOverview?: boolean } | null;
    if (state?.resetToOverview) {
      setIsCreatingBrief(false);
      setBriefView("templates");
      // Clear the state so subsequent renders don't re-trigger
      navigate("/dashboard/briefs", { replace: true });
      return;
    }
    if (state?.createBrief && state?.showForm) {
      setIsCreatingBrief(true);
      setBriefView("form");
    } else if (state?.createBrief) {
      setIsCreatingBrief(true);
      setBriefView("templates");
    }
  }, [location.state, navigate]);

  const navItems = useMemo(
    () => [
      { name: "Central", icon: Home, path: "/dashboard" },
      { name: "Briefs", icon: FileText, path: "/dashboard/briefs" },
      { name: "Projects", icon: Folder, path: "/dashboard/projects" },
      { name: "Tracker", icon: BarChart2, path: "/dashboard/tracker" },
    ],
    []
  );

  const activeName = useMemo(() => {
    if (location.pathname.startsWith("/dashboard/briefs")) return "Briefs";
    if (location.pathname === "/dashboard") return "Central";
    if (location.pathname.startsWith("/dashboard/projects")) return "Projects";
    if (location.pathname.startsWith("/dashboard/tracker")) return "Tracker";
    return "Central";
  }, [location.pathname]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#f7f7f7] border-r border-[#d9d9d9] flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-[70px] flex items-center justify-start px-8 py-4">
            <div className="main-logo flex items-center gap-1.5">
              <img src={logoImage} alt="TIKO" className="h-8" />
              <img src={logoDot} alt="" className="w-[14.6px] h-[14.6px]" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px relative">
            <img src={dividerImage} alt="" className="w-full h-full" />
          </div>

          {/* Navigation */}
          <nav className="pt-8 px-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeName === item.name;
              const handleNavClick = () => {
                if (item.path === "/dashboard/briefs") {
                  // Always show list view when clicking Briefs in the sidebar
                  if (isCreatingBrief) {
                    setIsCreatingBrief(false);
                    setBriefView("templates");
                    return;
                  }
                }
                navigate(item.path);
              };
              return (
                <button
                  key={item.name}
                  onClick={handleNavClick}
                  className={`w-full flex items-center gap-2 px-4 py-4 rounded-lg transition relative ${
                    isActive ? "bg-white" : "bg-transparent hover:bg-white/50"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-black" : "text-black"} />
                  <span className={`text-sm leading-[19.6px] ${isActive ? "font-semibold" : "font-normal"} text-black`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-4 pb-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-4 rounded-lg transition hover:bg-white/50"
          >
            <LogOut size={20} className="text-black" />
            <span className="text-sm leading-[19.6px] font-normal text-black">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-4 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-4 py-4 rounded-lg">
            {isCreatingBrief && (briefView === "form" || briefView === "deliverables" || briefView === "ai-response") ? (
              <>
                <button onClick={() => {
                  if (briefView === "ai-response") setBriefView("deliverables");
                  else if (briefView === "deliverables") setBriefView("form");
                  else setBriefView("templates");
                }} className="flex items-center gap-2">
                  <ArrowLeft size={20} className="text-black" />
                </button>
                <span className="text-sm leading-[19.6px] text-black">New brief</span>
              </>
            ) : (
              <>
                <FileText size={20} className="text-black" />
                <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6 pr-[30px]">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 relative cursor-pointer">
                  <Bell size={24} className="text-[#848487]" />
                  <div className="absolute -left-1 -top-1 min-w-[20px] h-5 bg-[#ff4337] border-2 border-[#f7f7f7] rounded-full flex items-center justify-center px-1">
                    <span className="text-[10px] font-bold leading-[14px] text-white">3</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent 
                align="end" 
                sideOffset={10}
                className="w-80 p-0 bg-white border border-[#e0e0e0] shadow-lg"
              >
                <div className="p-4 border-b border-[#e0e0e0]">
                  <h3 className="text-base font-bold leading-[21.28px] text-black">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Mock notification items */}
                  <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">
                          New brief submitted
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#646464]">
                          Sarah Johnson submitted a new brief for review
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#848487] mt-1">
                          2 hours ago
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
                    </div>
                  </div>
                  <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">
                          Project milestone reached
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#646464]">
                          "Fold Toolkit Q3 2025" has reached 50% completion
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#848487] mt-1">
                          5 hours ago
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
                    </div>
                  </div>
                  <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">
                          Brief approved
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#646464]">
                          Your brief "S Series OOH Campaign" has been approved
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#848487] mt-1">
                          1 day ago
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-[#e0e0e0]">
                  <button className="w-full text-xs font-semibold leading-[15.96px] text-[#646464] hover:text-black transition">
                    View all notifications
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Tokens */}
            <div className="flex items-center gap-1">
              <Coins size={20} className="text-[#848487]" />
              <span className="text-xs leading-[15.96px] text-[#646464]">372 Tokens</span>
            </div>

            {/* User Profile */}
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            >
              <HBAvatar size={40} />
              <div className="flex flex-col">
                <p className="text-sm font-bold leading-[18.62px] text-[#646464]">Henry Bray</p>
                <p className="text-xs leading-[15.96px] text-[#646464]">Marcomms</p>
              </div>
              <ChevronDown size={24} className="text-[#646464] rotate-90" />
            </button>
          </div>
        </header>

        {/* Briefs Content */}
        <section className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
          {isCreatingBrief ? (
            briefView === "templates" ? (
              <TemplateSelectionScreen 
                onCancel={() => setIsCreatingBrief(false)} 
                onCreateBrief={() => setBriefView("form")}
              />
            ) : briefView === "form" ? (
              <NewBriefForm 
                onCancel={() => setBriefView("templates")} 
                onNext={() => setBriefView("deliverables")}
              />
            ) : briefView === "deliverables" ? (
              <DeliverablesSelectionScreen 
                onCancel={() => setBriefView("form")}
                onBack={() => setBriefView("form")}
                onNavigateToAiResponse={(inputText) => {
                  setAiInputText(inputText);
                  setBriefView("ai-response");
                }}
              />
            ) : (
              <AIResponseScreen 
                userInput={aiInputText}
                onBack={() => setBriefView("deliverables")}
                onCancel={() => setBriefView("form")}
              />
            )
          ) : (
            <div className="space-y-10">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-[32px] font-bold leading-[38.4px] text-black">Briefs overview</h1>
                  <p className="text-lg leading-[23.94px] text-black">Kickstart your next project with clarity and ease</p>
                </div>
                <div className="flex gap-2.5 items-center">
                  <button 
                    onClick={() => navigate("/dashboard/calculator")}
                    className="w-[216px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
                  >
                    <Calculator size={16} className="text-black" />
                    <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">Quick calculator</span>
                  </button>
                  <button 
                    onClick={() => setIsCreatingBrief(true)}
                    className="w-[216px] backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] py-[18px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
                  >
                    <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">Create brief</span>
                    <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { 
                    title: "Draft briefs", 
                    value: 5,
                    icon: (
                      <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M33.3775 0H6.62252C2.96358 0 0 2.96358 0 6.62252V36.7881C0 40.447 2.96358 43.4106 6.62252 43.4106H33.3775C37.0364 43.4106 40 40.447 40 36.7881V6.62252C40 2.96358 37.0364 0 33.3775 0ZM29.8758 34.3295H10.1159C8.75829 34.3295 7.66556 33.2285 7.66556 31.8791C7.66556 30.5215 8.76656 29.4288 10.1159 29.4288H29.8758C31.2334 29.4288 32.3262 30.5298 32.3262 31.8791C32.3262 33.2368 31.2252 34.3295 29.8758 34.3295ZM29.8758 24.1557H10.1159C8.75829 24.1557 7.66556 23.0547 7.66556 21.7053C7.66556 20.3477 8.76656 19.255 10.1159 19.255H29.8758C31.2334 19.255 32.3262 20.356 32.3262 21.7053C32.3262 23.0629 31.2252 24.1557 29.8758 24.1557ZM29.8758 13.9818H10.1159C8.75829 13.9818 7.66556 12.8808 7.66556 11.5315C7.66556 10.1739 8.76656 9.08115 10.1159 9.08115H29.8758C31.2334 9.08115 32.3262 10.1822 32.3262 11.5315C32.3262 12.8891 31.2252 13.9818 29.8758 13.9818Z" fill="#FFB546"/>
                      </svg>
                    )
                  },
                  { 
                    title: "In review", 
                    value: 4,
                    icon: (
                      <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M24.9632 32C35.1852 32 44.1478 26.6294 49.1935 18.5562C50.1707 16.9932 50.1707 15.0095 49.1935 13.4438C44.1478 5.37061 35.1852 0 24.9632 0C14.7412 0 5.77867 5.37061 0.732901 13.4438C-0.2443 15.0068 -0.2443 16.9905 0.732901 18.5562C5.77867 26.6294 14.7412 32 24.9632 32Z" fill="#E5E5E5"/>
                      </svg>
                    )
                  },
                  { 
                    title: "SOW Ready to sign", 
                    value: 3,
                    icon: (
                      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2"/>
                      </svg>
                    )
                  },
                ].map((card) => (
                  <div key={card.title} className="bg-white rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-start justify-between pb-1">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold leading-[18.62px] text-black">{card.title}</h3>
                      </div>
                    </div>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">{card.value}</p>
                    {card.icon}
                  </div>
                ))}
              </div>

              {/* To action on */}
              <div className="space-y-4">
                <h2 className="text-base font-semibold leading-[21.28px] text-black">To action on</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      title: "W Summer Festival 2025",
                      content: " Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
                      badgeIcon: (
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.14686 12H1.7428C0.779082 12 0 11.23 0 10.2774V9.56528C0 9.17804 0.238677 8.83086 0.603451 8.68843L4.47636 6.8724C5.27796 6.55638 5.27795 5.43917 4.48085 5.11869L0.598943 3.26706C0.238673 3.12463 0 2.77745 0 2.39021V1.72255C0 0.770031 0.779082 0 1.7428 0H7.14686C7.52514 0 7.89441 0.120181 8.19614 0.347184L12.8076 4.62463C13.7308 5.31454 13.7308 6.68101 12.8076 7.37092L8.19614 11.6484C7.89441 11.8754 7.52514 11.9955 7.14686 11.9955V12Z" fill="#03B3E2"/>
                        </svg>
                      ),
                      notificationBadge: (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
                          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
                          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
                        </svg>
                      ),
                      statusBadge: (
                        <span className="text-xs py-[2px] px-2 rounded-[12px]" style={{ width: '61px', height: '20px', backgroundColor: '#0177C70D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '12px', lineHeight: '15.96px', fontWeight: 400, color: '#0177C7', width: '45px', height: '16px' }}>Creation</span>
                        </span>
                      ),
                    },
                    {
                      title: "Fold Toolkit Q3 2025",
                      content: "Visual guide for the Fold Toolkit Q3 2025. Create full set of campaign visuals, formats, and variations for digital and print media, ensuring consistent visual identity across all touchpoints.",
                      badgeIcon: (
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5"/>
                        </svg>
                      ),
                      notificationBadge: (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
                          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
                          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
                        </svg>
                      ),
                      statusBadge: (
                        <span className="text-xs py-[2px] px-2 rounded-[12px]" style={{ width: '50px', height: '20px', backgroundColor: '#00C3B10F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '12px', lineHeight: '15.96px', fontWeight: 400, color: '#00C3B1', width: '34px', height: '16px' }}>Resize</span>
                        </span>
                      ),
                    },
                    {
                      title: "Buds3 Campaign Toolkit",
                      content: "Develop visual guide for Buds 3 Campaign. Create full set of assets and design templates to support marketing rollout across multiple channels.",
                      badgeIcon: (
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.14686 12H1.7428C0.779082 12 0 11.23 0 10.2774V9.56528C0 9.17804 0.238677 8.83086 0.603451 8.68843L4.47636 6.8724C5.27796 6.55638 5.27795 5.43917 4.48085 5.11869L0.598943 3.26706C0.238673 3.12463 0 2.77745 0 2.39021V1.72255C0 0.770031 0.779082 0 1.7428 0H7.14686C7.52514 0 7.89441 0.120181 8.19614 0.347184L12.8076 4.62463C13.7308 5.31454 13.7308 6.68101 12.8076 7.37092L8.19614 11.6484C7.89441 11.8754 7.52514 11.9955 7.14686 11.9955V12Z" fill="#03B3E2"/>
                        </svg>
                      ),
                      notificationBadge: (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
                          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
                          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
                        </svg>
                      ),
                      statusBadge: (
                        <span className="text-xs py-[2px] px-2 rounded-[12px]" style={{ width: '50px', height: '20px', backgroundColor: '#00C3B10F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '12px', lineHeight: '15.96px', fontWeight: 400, color: '#00C3B1', width: '34px', height: '16px' }}>Resize</span>
                        </span>
                      ),
                    },
                    {
                      title: "Adapt AI Toolkit Q3 2025",
                      content: "Adapt all AI master campaign assets into formats optimized for print and add localized variations for different markets, ensuring visual consistency and high production quality across all deliverables."                      ,
                      badgeIcon: (
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.14686 12H1.7428C0.779082 12 0 11.23 0 10.2774V9.56528C0 9.17804 0.238677 8.83086 0.603451 8.68843L4.47636 6.8724C5.27796 6.55638 5.27795 5.43917 4.48085 5.11869L0.598943 3.26706C0.238673 3.12463 0 2.77745 0 2.39021V1.72255C0 0.770031 0.779082 0 1.7428 0H7.14686C7.52514 0 7.89441 0.120181 8.19614 0.347184L12.8076 4.62463C13.7308 5.31454 13.7308 6.68101 12.8076 7.37092L8.19614 11.6484C7.89441 11.8754 7.52514 11.9955 7.14686 11.9955V12Z" fill="#03B3E2"/>
                        </svg>
                      ),
                      notificationBadge: (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
                          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
                          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
                        </svg>
                      ),
                      statusBadge: (
                        <span className="text-xs py-[2px] px-2 rounded-[12px]" style={{ width: '75px', height: '20px', backgroundColor: '#8092DC0D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '12px', lineHeight: '15.96px', fontWeight: 400, color: '#8092DC', width: '59px', height: '16px' }}>Adaptation</span>
                        </span>
                      ),
                    },
                  ].map((card, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 flex flex-col gap-3 border border-[#ececec] h-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold leading-[18.62px] text-black">{card.title}</h3>
                        <div className="relative">
                          {card.badgeIcon}
                          {card.notificationBadge}
                        </div>
                      </div>
                      <p
                        className="text-sm leading-[18.62px] text-[#646464] min-h-[38px] overflow-hidden"
                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                      >
                        {card.content}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        {card.statusBadge}
                        <div className="flex -space-x-2">
                          {[0,1,2].map((a) => {
                            const seed = `avatar_${i}_${a}`;
                            return (
                              <Avatar key={a} className="w-6 h-6 border-2 border-white">
                                <AvatarImage 
                                  src={`https://api.dicebear.com/7.x/personas/png?seed=${seed}&size=64`} 
                                  alt={`Avatar ${a + 1}`}
                                />
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-200 to-blue-300">
                                  {String.fromCharCode(65 + a)}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      </div>
                      <div className="h-px bg-[#ececec]" />
                      <div className="flex items-center justify-between text-xs text-[#848487]">
                        <div className="flex items-center gap-1">
                          <span>💬</span>
                          <span>12</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>Nov 28</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All briefs */}
              <AllBriefsSection />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function TemplateSelectionScreen({ onCancel, onCreateBrief }: { onCancel: () => void; onCreateBrief: () => void }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"All" | "Popular" | "Recent" | "New">("All");
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const allTemplates = [
    { id: "asset-adaptation", title: "Asset adaptation", icon: iconAssetAdaptation, hasRotation: true, category: "popular" },
    { id: "bau-campaign", title: "BAU Campaign", icon: iconBAU, category: "all" },
    { id: "point-of-sale", title: "Point Of Sale", icon: iconPOS, category: "all" },
    { id: "digital-pos", title: "Digital POS", icon: iconDigitalPOS, category: "all" },
    { id: "feature-asset", title: "Feature asset", icon: iconFeatureAsset, category: "all" },
    { id: "toolkit", title: "Toolkit", icon: iconToolkit, category: "popular" },
    { id: "partnerships", title: "Partnerships", icon: iconPartnerships, hasRotation: true, category: "all" },
    { id: "social-content", title: "Social content", icon: iconSocialContent, category: "popular" },
  ];

  // Filter templates based on active tab
  const templates = allTemplates.filter((template) => {
    if (activeTab === "All") return template.category === "all" || template.category === "popular";
    if (activeTab === "Popular") return template.category === "popular";
    if (activeTab === "Recent") return template.category === "recent";
    if (activeTab === "New") return template.category === "new";
    return true;
  });

  const handleTemplateClick = (templateId: string) => {
    toast.success(`Selected template: ${templateId}`);
    // Navigate to next step or create brief with template
    onCancel();
  };

  return (
    <div className="flex flex-col gap-20 items-center justify-center w-full py-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-[32px] font-bold leading-[38.4px] text-black text-center">
            Write your next brief in minutes
          </h1>
          <p className="text-sm leading-[18.62px] text-black text-center max-w-[600px]">
            Custom briefs, fast and easy.
            <br />
            Not sure where to begin? Try the budget planner first.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2.5 items-center">
          <button 
            onClick={() => navigate("/dashboard/calculator")}
            className="w-[224px] h-10 bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] hover:opacity-90 transition"
          >
            <Calculator size={16} className="text-black" />
            <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">Quick calculator</span>
          </button>
          <button 
            onClick={onCreateBrief}
            className="w-[224px] h-10 backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
          >
            <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">Create brief</span>
            <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
          </button>
        </div>

        {/* Upload existing brief - centered below buttons */}
        <div className="flex flex-col items-center mt-2 w-full">
          <div className="flex items-center gap-2 justify-center">
            <p className="text-sm leading-[18.62px] text-black text-center">
              Already have a brief file, please upload it.
            </p>
            <input ref={uploadInputRef} type="file" className="hidden" />
            <button
              type="button"
              className="flex gap-[4px] items-start hover:opacity-80 transition cursor-pointer"
              onClick={() => uploadInputRef.current?.click()}
            >
              <div className="overflow-clip relative shrink-0 size-[20px]">
                <img src={uploadIcon} alt="Upload" className="block max-w-none size-full" />
              </div>
              <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">Upload</p>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="flex flex-col gap-6 items-start max-w-[610px] w-full">
        {/* Section Header */}
        <div className="flex flex-col gap-1 px-6">
          <h2 className="text-lg font-bold leading-[23.94px] text-black">Browse our templates collection</h2>
          <p className="text-sm leading-[18.62px] text-black">Kickstart your brief with a ready-made template.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-start px-6 gap-2">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-4 py-1.5 rounded-[28px] text-xs font-semibold leading-[14.4px] transition ${
              activeTab === "All"
                ? "bg-black text-[#fcfcff]"
                : "bg-[#f1f1f3] text-black"
            }`}
          >
            All templates
          </button>
          <button
            onClick={() => setActiveTab("Popular")}
            className={`px-4 py-1.5 rounded-[6px] text-xs leading-[14.4px] transition ${
              activeTab === "Popular"
                ? "bg-black text-[#fcfcff] font-semibold"
                : "bg-[#f1f1f3] text-black font-normal"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("Recent")}
            className={`px-4 py-1.5 rounded-[28px] text-xs font-normal leading-[14.4px] transition ${
              activeTab === "Recent"
                ? "bg-black text-[#fcfcff]"
                : "bg-[#f1f1f3] text-black"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab("New")}
            className={`px-4 py-1.5 rounded-[6px] text-xs font-normal leading-[14.4px] transition ${
              activeTab === "New"
                ? "bg-black text-[#fcfcff]"
                : "bg-[#f1f1f3] text-black"
            }`}
          >
            New
          </button>
        </div>

        {/* Template Cards */}
        <div className="flex flex-col gap-4 px-6 w-full">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template.id)}
              className="hover-brief relative overflow-hidden border border-[#e0e0e0] rounded-xl p-4 text-left hover:bg-[#f9f9f9] transition relative w-full group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold leading-[23.94px] text-black">{template.title}</h3>
                <div className={`brief-icon absolute right-4 top-1/2 -translate-y-1/2 ${template.hasRotation ? "rotate-[50.525deg]" : ""}`}>
                  <img
                    src={template.icon}
                    alt=""
                    className={`${template.hasRotation ? "h-[32.164px] w-[32.163px]" : "h-6 w-6"}`}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewBriefForm({ onCancel, onNext }: { onCancel: () => void; onNext: () => void }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectTitle: "",
    dueDate: undefined as Date | undefined,
    projectLead: "",
    objective: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleNext = () => {
    onNext();
  };

  const handleChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  useEffect(() => {
    if (showConfirmation) {
      // Trigger confetti animation - single smooth burst
      const count = 200;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 100, 
        zIndex: 9999,
        gravity: 0.8,
        decay: 0.94
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // Single burst from both sides
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: randomInRange(0.2, 0.4), y: 0.5 },
        colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487']
      });
      
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: randomInRange(0.6, 0.8), y: 0.5 },
        colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487']
      });
    }
  }, [showConfirmation]);

  return (
    <div className="flex gap-0 w-full">
      {/* Left Form Section */}
      <div className="flex flex-col gap-8 p-6 rounded-xl w-[564px]">
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-[18.62px] text-[#424242] w-full">
            Start your brief by filling out these required fields.
          </p>

          <div className="flex flex-col gap-6">
            {/* Project Title */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Project title
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  Give your brief a short, clear name
                </p>
              </div>
              <Input
                value={formData.projectTitle}
                onChange={(e) => handleChange("projectTitle", e.target.value)}
                placeholder="e.g. Spring Campaign 2025"
                className="border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto bg-[#f9f9f9]"
              />
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Due date
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  When is this project due?
                </p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 flex items-center justify-between h-auto hover:bg-[#f9f9f9]">
                    <span className="text-sm leading-[18.62px] text-[#848487]">
                      {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                    </span>
                    <CalendarIcon size={20} className="text-[#848487]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => handleChange("dueDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Project Lead */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Project lead*
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  Who will own this project?
                </p>
              </div>
              <Select value={formData.projectLead} onValueChange={(value) => handleChange("projectLead", value)}>
                <SelectTrigger className="border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto bg-[#f9f9f9] [&>span]:text-[#848487] data-[placeholder]:text-[#848487]">
                  <SelectValue placeholder="Choose a lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="henry-bray">Henry Bray</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objective */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Objective
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  What's the main goal of this project?
                </p>
              </div>
              <Textarea
                value={formData.objective}
                onChange={(e) => handleChange("objective", e.target.value)}
                placeholder="e.g. Increase signups by 20% through targeted ads"
                className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[74px] resize-none bg-[#f9f9f9]"
                rows={3}
              />
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="h-px bg-[#e0e0e0] w-full" />
              <p className="text-sm leading-[normal] opacity-[0.826] text-[#434343]">
                *You can assign multiple leads
              </p>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="px-6 py-[18px] bg-[#f9f9f9] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition w-full"
        >
          <span className="text-sm font-semibold leading-[18.62px] text-[#848487]">Next</span>
        </button>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col gap-2.5 pb-5 pr-10 pl-2.5 pt-2.5 h-[830px] w-[601px]">
        {/* Loading State */}
        <div className="bg-white flex flex-1 flex-col gap-8 items-center justify-center p-6 rounded-xl min-h-0">
          <div className="flex flex-col gap-2 items-center">
            <img src={briefLoadingIcon} alt="" className="h-[36.966px] w-[77.813px]" />
            <p className="text-sm font-bold leading-[18.62px] opacity-50 text-[#c1c1c3]">
              Brief loading...
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[9px] relative w-full shrink-0">
          <div className="absolute h-px left-[-9px] top-[4px] w-[600px] bg-[#e0e0e0]" />
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-1 items-end shrink-0">
          {/* Token Estimate */}
          <div className="flex gap-2 items-center pb-2">
            <img src={tokenIcon} alt="" className="h-5 w-5" />
            <span className="text-[13px] leading-[18.62px] text-[#848487]">0</span>
            <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onCancel}
              className="px-2 py-[18px] bg-transparent rounded-[28px] flex items-center justify-center hover:bg-[#f1f1f3] transition h-8"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black">Discard</span>
            </button>
            <div className="flex gap-1 items-center">
              <button className="px-4 py-[18px] bg-[#f9f9f9] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition h-8">
                <span className="text-[13px] font-semibold leading-[18.62px] text-[#848487]">Save draft</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate("/dashboard/briefs/review")}
                className="px-4 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition h-8"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Review brief</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md !bg-white border border-[#e0e0e0] rounded-xl p-8 [&>button]:hidden">
          <DialogHeader className="flex flex-col gap-4 items-center text-center">
            <DialogTitle className="text-[32px] font-bold leading-[38.4px] text-black text-center">
              Brief successfully submitted!
            </DialogTitle>
            <DialogDescription className="text-sm leading-[18.62px] text-[#424242] text-center">
              Your brief status has been updated to Review. We will get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <button
              onClick={handleViewAllBriefs}
              className="px-6 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition"
            >
              <span className="text-sm font-semibold leading-[18.62px] text-black">View all briefs</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DeliverablesSelectionScreen({ onCancel, onBack, onNavigateToAiResponse }: { onCancel: () => void; onBack: () => void; onNavigateToAiResponse: (inputText: string) => void }) {
  const navigate = useNavigate();
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [tokenEstimate, setTokenEstimate] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onNavigateToAiResponse(chatInput.trim());
    }
  };

  // Mock data from Figma
  const mockBriefData = {
    projectTitle: "Q7B7 Toolkit",
    launchDate: "July 23, 2025",
    projectLead: "Henry Bray",
    objective: "To create a product toolkit that provides clear guidance to help partners effectively amplify the campaign message. The toolkit should enable consistent execution, align with campaign objectives, and make it easy for users to activate the campaign across channels.",
  };

  const recommendedDeliverables = [
    { id: "1", title: "Editable Image Files Adapted Under NDA", tokens: 2 },
    { id: "2", title: "Video File Created Non NDA", tokens: 1 },
    { id: "3", title: "PDF Files Created Non NDA", tokens: 10 },
    { id: "4", title: "Non Editable Image Files Created Non NDA", tokens: 2 },
  ];

  const handleAddDeliverable = (deliverableId: string, tokens: number) => {
    if (selectedDeliverables.includes(deliverableId)) {
      setSelectedDeliverables(selectedDeliverables.filter(id => id !== deliverableId));
      setTokenEstimate(prev => prev - tokens);
    } else {
      setSelectedDeliverables([...selectedDeliverables, deliverableId]);
      setTokenEstimate(prev => prev + tokens);
    }
  };

  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  useEffect(() => {
    if (showConfirmation) {
      // Trigger confetti animation - single smooth burst
      const count = 200;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 100, 
        zIndex: 9999,
        gravity: 0.8,
        decay: 0.94
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // Single burst from both sides
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: randomInRange(0.2, 0.4), y: 0.5 },
        colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487']
      });
      
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: randomInRange(0.6, 0.8), y: 0.5 },
        colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487']
      });
    }
  }, [showConfirmation]);

  return (
    <div className="flex flex-col w-full relative h-[calc(100vh-70px)]">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col gap-[10px] p-6 w-[564px] shrink-0 overflow-y-auto relative">
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Great! Next up are the deliverables. You can either browse and select the ones you need, or start detailing them below. TIKO will summarise the deliverables and prompt you to make sure you include everything you need for this project.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold leading-[18.62px] text-[#424242] w-full">
                Browse recomended deliverables
              </p>

              <div className="flex flex-col gap-1">
                {recommendedDeliverables.map((deliverable) => {
                  const isSelected = selectedDeliverables.includes(deliverable.id);
                  return (
                    <div
                      key={deliverable.id}
                      className="bg-[#efeff0] border border-[#e0e0e0] rounded-[6px] p-3 flex items-center justify-between hover:bg-[#e5e5e5] transition"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm leading-[18.62px] text-black">
                          {deliverable.title}
                        </p>
                        <p className="text-[10px] leading-[14px] text-black">
                          {deliverable.tokens} {deliverable.tokens === 1 ? "token" : "tokens"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddDeliverable(deliverable.id, deliverable.tokens)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                          isSelected 
                            ? "bg-[#03B3E2] hover:bg-[#0299c7]" 
                            : "bg-[#f1f1f3] hover:bg-[#e5e5e5]"
                        }`}
                      >
                        <Plus 
                          size={18} 
                          className={`${isSelected ? "text-white" : "text-[#03B3E2]"}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button className="flex items-center justify-center gap-1.5 pt-2">
                <p className="text-sm font-bold leading-[18.62px] text-[#848487]">
                  More deliverables
                </p>
                <ChevronDownIcon size={19} className="text-[#848487]" />
              </button>
            </div>

            <div className="h-[9px] relative w-full">
              <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
            </div>

            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Prefer to describe it instead? Or not sure which deliverables you need yet? <br />
              <span className="font-bold">Continue describing your brief below</span>
            </p>
          </div>

          {/* AI Chat Input at Bottom - Centered */}
          <div className="mt-auto pt-4 flex flex-col items-center gap-2">
            <form onSubmit={handleSubmit} className="w-[516px] bg-white border border-[#e0e0e0] rounded-[23px] p-1 flex items-center justify-between">
              <div className="flex gap-[7px] items-center flex-1">
                <div className="h-10 w-[35.514px] shrink-0">
                  <img src={imgFrame14} alt="" className="w-full h-full" />
                </div>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type here..."
                  className="flex-1 text-sm leading-[18.62px] text-[#848487] bg-transparent border-none outline-none placeholder-[#848487]"
                />
              </div>
              <button type="submit" className="w-10 h-10 shrink-0 relative cursor-pointer hover:opacity-80 transition">
                <img src={imgFrame15} alt="Submit" className="w-full h-full" />
              </button>
            </form>

            {/* Help Text */}
            <p className="text-[12px] leading-[15.96px] text-[#424242] text-center w-[347px]">
              Need a hand? <span className="font-bold">Talk to your Iris account manager</span>
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-[#e0e0e0] shrink-0" />

        {/* Right Panel */}
        <div className="flex flex-col gap-[10px] p-[10px] pr-10 w-[601px] shrink-0 overflow-hidden">
          {/* Brief Preview */}
          <div className="bg-white flex-1 flex flex-col gap-8 p-6 rounded-xl min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <p className="text-[22px] font-bold leading-[29.26px] text-black">
                  {mockBriefData.projectTitle}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-[18.62px] text-[#09090a]">
                    <span className="font-bold">Launch date: </span>
                    <span className="font-normal">{mockBriefData.launchDate}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-[18.62px] text-[#09090a]">
                    <span className="font-bold">Project lead: </span>
                    <span className="font-normal">{mockBriefData.projectLead}</span>
                  </p>
                </div>

                <p className="text-sm leading-[18.62px] text-[#09090a]">
                  <span className="font-bold">Objective: </span>
                  <span className="font-normal">{mockBriefData.objective}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-[-9px] top-[4px] w-[600px] bg-[#e0e0e0]" />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0">
            {/* Token Estimate */}
            <div className="flex gap-2 items-center pb-2">
              <img src={tokenIcon} alt="" className="h-5 w-5" />
              <span className="text-[13px] leading-[18.62px] text-black">{tokenEstimate}</span>
              <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between w-full">
              <button
                onClick={onCancel}
                className="px-2 py-[18px] bg-transparent rounded-[28px] flex items-center justify-center hover:bg-[#f1f1f3] transition h-8"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Discard</span>
              </button>
              <div className="flex gap-1 items-center">
                <button className="px-4 py-[18px] bg-[#f1f1f3] backdrop-blur-sm rounded-[28px] flex items-center justify-center hover:bg-[#e5e5e5] transition h-8">
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black">Save draft</span>
                </button>
                <button 
                  type="button"
                  onClick={() => navigate("/dashboard/briefs/review")}
                  className="px-4 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center hover:opacity-90 transition h-8"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black">Review brief</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md !bg-white border border-[#e0e0e0] rounded-xl p-8 [&>button]:hidden">
          <DialogHeader className="flex flex-col gap-4 items-center text-center">
            <DialogTitle className="text-[32px] font-bold leading-[38.4px] text-black text-center">
              Brief successfully submitted!
            </DialogTitle>
            <DialogDescription className="text-sm leading-[18.62px] text-[#424242] text-center">
              Your brief status has been updated to Review. We will get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleViewAllBriefs}
              className="px-6 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition"
            >
              <span className="text-sm font-semibold leading-[18.62px] text-black">View all briefs</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AIResponseScreen({ userInput, onBack, onCancel }: { userInput: string; onBack: () => void; onCancel: () => void }) {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs");
  };

  useEffect(() => {
    if (showConfirmation) {
      // Trigger confetti animation - single smooth burst
      const count = 200;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 100, 
        zIndex: 9999,
        gravity: 0.8,
        decay: 0.94
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // Single burst from both sides
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: randomInRange(0.2, 0.4), y: 0.5 },
        colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487']
      });
      
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: randomInRange(0.6, 0.8), y: 0.5 },
        colors: ['#ffb546', '#03B3E2', '#ff4337', '#646464', '#848487']
      });
    }
  }, [showConfirmation]);

  // Mock data from Figma - same brief data
  const mockBriefData = {
    projectTitle: "Q7B7 Toolkit",
    launchDate: "July 23, 2025",
    projectLead: "Henry Bray",
    objective: "To create a product toolkit that provides clear guidance to help partners effectively amplify the campaign message. The toolkit should enable consistent execution, align with campaign objectives, and make it easy for users to activate the campaign across channels.",
  };

  // Mock deliverables list from Figma
  const deliverablesList = [
    {
      kvType: "Q7 KV",
      variants: [
        { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
        { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
        { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      ],
    },
    {
      kvType: "B7 KV",
      variants: [
        { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
        { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
        { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      ],
    },
    {
      kvType: "Combo KV (Q7 &B7)",
      variants: [
        { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
        { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
        { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      ],
    },
    {
      kvType: "Family KV (Q7, B7 & B7R) - (Bespoke KV)",
      variants: [
        { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
        { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
        { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      ],
    },
    {
      kvType: "B7 & B7R KV (Bespoke KV)",
      variants: [
        { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
        { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
        { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full relative h-[calc(100vh-70px)]">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col gap-6 p-6 w-[564px] shrink-0 overflow-y-auto">
          {/* User Message Bubble */}
          <div className="bg-[#efeff0] rounded-xl p-4">
            <p className="text-sm leading-[18.62px] text-[#424242] whitespace-pre-wrap">
              {userInput || "For this project we need to create like at least 5 different KVs i.e. Q7, B7, Combo, Family and B7&B7R key visual. For each of these we need a clean variant and 80/20, 70/30 variant. For the size you can use default sizes (suggest best ones) for the clean dna 70/30 and for 80/20 we need PDF, PT EXT, LS EXT."}
            </p>
          </div>

          {/* AI Response */}
          <div className="flex flex-col gap-6 px-6 py-4 h-[638px] overflow-y-auto">
            <p className="text-sm leading-[18.62px] text-[#424242]">
              Thanks for the input, review here the list of deliverables.
            </p>

            {/* Deliverables List */}
            <div className="flex flex-col gap-3 w-[516px]">
              {/* Header */}
              <div className="flex gap-2 items-center text-sm font-bold leading-[18.62px] text-black">
                <p className="flex-1">KV Type</p>
                <p className="w-[60px]">Variant</p>
                <p className="w-[200px]">Size</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e0e0e0]" />

              {/* Deliverables Items */}
              {deliverablesList.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  {item.variants.map((variant, vIdx) => (
                    <div key={vIdx}>
                      <div className="flex gap-2 items-center text-[12px] leading-[15.96px] text-black">
                        <p className={`flex-1 ${vIdx === 0 ? "font-bold" : ""}`}>
                          {vIdx === 0 ? item.kvType : " "}
                        </p>
                        <p className="w-[60px] font-normal">{variant.variant}</p>
                        <p className="w-[200px] font-normal">{variant.size}</p>
                      </div>
                      {vIdx < item.variants.length - 1 && (
                        <div className="h-px bg-[#e0e0e0] mt-2" />
                      )}
                    </div>
                  ))}
                  {idx < deliverablesList.length - 1 && (
                    <div className="h-px bg-[#e0e0e0] mt-2" />
                  )}
                </div>
              ))}
            </div>

            {/* File Format Note */}
            <p className="text-sm leading-[18.62px] text-[#424242]">
              The format of the file is missing here.<br />
              The recommended file type for these is <span className="font-bold">JPEG</span> and <span className="font-bold">PSD</span>.<br />
              <br />
              Would you like to add those?
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-[#e0e0e0] shrink-0" />

        {/* Right Panel - Same as Deliverables Screen */}
        <div className="flex flex-col gap-[10px] p-[10px] pr-10 w-[601px] shrink-0 overflow-hidden">
          {/* Brief Preview */}
          <div className="bg-white flex-1 flex flex-col gap-8 p-6 rounded-xl min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <p className="text-[22px] font-bold leading-[29.26px] text-black">
                  {mockBriefData.projectTitle}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-[18.62px] text-[#09090a]">
                    <span className="font-bold">Launch date: </span>
                    <span className="font-normal">{mockBriefData.launchDate}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-[18.62px] text-[#09090a]">
                    <span className="font-bold">Project lead: </span>
                    <span className="font-normal">{mockBriefData.projectLead}</span>
                  </p>
                </div>

                <p className="text-sm leading-[18.62px] text-[#09090a]">
                  <span className="font-bold">Objective: </span>
                  <span className="font-normal">{mockBriefData.objective}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-[-9px] top-[4px] w-[600px] bg-[#e0e0e0]" />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0">
            {/* Token Estimate */}
            <div className="flex gap-2 items-center pb-2">
              <img src={tokenIcon} alt="" className="h-5 w-5" />
              <span className="text-[13px] leading-[18.62px] text-black">10</span>
              <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between w-full">
              <button
                onClick={onCancel}
                className="px-2 py-[18px] bg-transparent rounded-[28px] flex items-center justify-center hover:bg-[#f1f1f3] transition h-8"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Discard</span>
              </button>
              <div className="flex gap-1 items-center">
                <button className="px-4 py-[18px] bg-[#f1f1f3] backdrop-blur-sm rounded-[28px] flex items-center justify-center hover:bg-[#e5e5e5] transition h-8">
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black">Save draft</span>
                </button>
                <button 
                  type="button"
                  onClick={() => navigate("/dashboard/briefs/review")}
                  className="px-4 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center hover:opacity-90 transition h-8"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black">Review brief</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md !bg-white border border-[#e0e0e0] rounded-xl p-8 [&>button]:hidden">
          <DialogHeader className="flex flex-col gap-4 items-center text-center">
            <DialogTitle className="text-[32px] font-bold leading-[38.4px] text-black text-center">
              Brief successfully submitted!
            </DialogTitle>
            <DialogDescription className="text-sm leading-[18.62px] text-[#424242] text-center">
              Your brief status has been updated to Review. We will get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleViewAllBriefs}
              className="px-6 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition"
            >
              <span className="text-sm font-semibold leading-[18.62px] text-black">View all briefs</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Chat Input at Bottom - Centered */}
      <div className="absolute bottom-[26px] left-[264px] w-[516px] bg-white border border-[#e0e0e0] rounded-[23px] p-1 flex items-center justify-between">
        <div className="flex gap-[7px] items-center flex-1">
          <div className="h-10 w-[35.514px] shrink-0">
            <img src={imgFrame14_v2} alt="" className="w-full h-full" />
          </div>
          <input
            type="text"
            placeholder="Type here..."
            className="flex-1 text-sm leading-[18.62px] text-[#848487] bg-transparent border-none outline-none placeholder-[#848487]"
          />
        </div>
        <div className="w-10 h-10 shrink-0 relative">
          <img src={imgFrame15_v2} alt="" className="w-full h-full" />
        </div>
      </div>

      {/* Help Text */}
      <p className="absolute bottom-[22px] left-[522px] text-[12px] leading-[15.96px] text-[#424242] text-center translate-x-[-50%] translate-y-[100%] w-[347px]">
        Need a hand? <span className="font-bold">Talk to your Iris account manager</span>
      </p>
    </div>
  );
}

function AllBriefsSection() {
  const [activeTab, setActiveTab] = useState<"All" | "Drafts" | "In review">("All");

  const briefs = [
    {
      id: 1,
      title: "W Summer Festival 2025",
      desc: "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
      badge: "Creation",
      date: "27 AUG",
      comments: 23,
      avatars: 2,
      status: "Draft",
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Watch Radio Campaign Q4 2025",
      desc: "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
      badge: "Adaptation",
      date: "3 Sept",
      comments: 4,
      avatars: 3,
      status: "Draft",
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546"/>
        </svg>
      ),
    },
    {
      id: 3,
      title: "W Summer Festival 2025",
      desc: "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
      badge: "Creation",
      date: "28 Aug",
      comments: 4,
      avatars: 3,
      status: "In review",
      icon: (
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5"/>
        </svg>
      ),
    },
    {
      id: 4,
      title: "Fold Toolkit Q3 2025",
      desc: "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
      badge: "Resize",
      date: "30 Aug",
      comments: 2,
      avatars: 4,
      status: "Draft",
      icon: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546"/>
        </svg>
      ),
    },
  ];

  const filtered = briefs.filter((b) =>
    activeTab === "All" ? true : activeTab === "Drafts" ? b.status === "Draft" : b.status === "In review"
  );

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold leading-[21.28px] text-black">All briefs</h2>
      <div className="flex items-center gap-2">
        {["All", "Drafts", "In review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`h-[26px] px-3 rounded-full text-xs font-semibold ${
              activeTab === tab ? "bg-black text-white" : "bg-[#f1f1f3] text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((b) => {
          // Badge styling based on type
          const getBadgeStyle = (badge: string) => {
            switch (badge) {
              case "Creation":
                return {
                  width: '61px',
                  height: '20px',
                  backgroundColor: '#0177C70D',
                  color: '#0177C7',
                };
              case "Adaptation":
                return {
                  width: '75px',
                  height: '20px',
                  backgroundColor: '#8092DC0D',
                  color: '#8092DC',
                };
              case "Resize":
                return {
                  width: '50px',
                  height: '20px',
                  backgroundColor: '#00C3B10F',
                  color: '#00C3B1',
                };
              default:
                return {
                  width: 'auto',
                  height: '20px',
                  backgroundColor: '#f9f9f9',
                  color: '#646464',
                };
            }
          };

          const badgeStyle = getBadgeStyle(b.badge);

          return (
            <div key={b.id} className="bg-white rounded-xl p-5 flex flex-col gap-3 border border-[#ececec] h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold leading-[18.62px] text-black">{b.title}</h3>
                <div className="flex items-center">{b.icon}</div>
              </div>
              <p
                className="text-sm leading-[18.62px] text-[#646464] min-h-[38px] overflow-hidden"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              >
                {b.desc}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span 
                  className="text-xs py-[2px] px-2 rounded-[12px] flex items-center justify-center"
                  style={badgeStyle}
                >
                  {b.badge}
                </span>
                <div className="flex -space-x-2">
                  {Array.from({ length: b.avatars }).map((_, a) => {
                    const seed = `brief_${b.id}_avatar_${a}`;
                    return (
                      <Avatar key={a} className="w-6 h-6 border-2 border-white">
                        <AvatarImage 
                          src={`https://api.dicebear.com/7.x/personas/png?seed=${seed}&size=64`} 
                          alt={`Avatar ${a + 1}`}
                        />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-200 to-blue-300">
                          {String.fromCharCode(65 + a)}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                </div>
              </div>
              <div className="h-px bg-[#ececec]" />
              <div className="flex items-center justify-between text-xs text-[#848487]">
                <div className="flex items-center gap-1">
                  <span>💬</span>
                  <span>{b.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{b.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
