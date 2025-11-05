import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { triggerSuccessConfetti } from "@/lib/animations";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND, TEMPLATE_ICONS } from "@/constants/branding";
import { PillPrimary, PillAccent, PillSubtle, PillGhost } from "@/components/common/buttons";
import StatCard from "@/components/common/StatCard";
import BriefCard from "@/components/common/BriefCard";
import { Field } from "@/components/common/Field";
import DateField from "@/components/common/DateField";
import ChatInput from "@/components/common/ChatInput";
import FormFooter from "@/components/common/FormFooter";
import TokenEstimate from "@/components/common/TokenEstimate";
import { getBadgeStyle } from "@/lib/utils";
import { ALL_TEMPLATES } from "@/constants/templates";
import { RECOMMENDED_DELIVERABLES, DELIVERABLES_LIST } from "@/constants/deliverables";
import { Icons } from "@/constants/icons";
import { BRIEFS_ASSETS } from "@/constants/briefs-assets";
import Badge from "@/components/common/Badge";
import AvatarStack from "@/components/common/AvatarStack";
import SuccessDialog from "@/components/common/SuccessDialog";
import BriefPreviewPanel from "@/components/briefs/BriefPreviewPanel";
import { StyledInput } from "@/components/common/StyledInput";
import TabFilter from "@/components/common/TabFilter";

// Reuse images from Dashboard for consistent visuals
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

// Template icons from Figma
const iconAssetAdaptation = TEMPLATE_ICONS.assetAdaptation;
const iconBAU = TEMPLATE_ICONS.bau;
const iconPOS = TEMPLATE_ICONS.pos;
const iconDigitalPOS = TEMPLATE_ICONS.digitalPos;
const iconFeatureAsset = TEMPLATE_ICONS.featureAsset;
const iconToolkit = TEMPLATE_ICONS.toolkit;
const iconPartnerships = TEMPLATE_ICONS.assetAdaptation;
const iconSocialContent = TEMPLATE_ICONS.pos;
const arrowRightIcon = BRIEFS_ASSETS.arrowRightIcon;

// New brief form images from Figma
const briefLoadingIcon = BRIEFS_ASSETS.briefLoadingIcon;
const tokenIcon = BRIEFS_ASSETS.tokenIcon;
const createBriefArrowIcon = BRIEFS_ASSETS.createBriefArrowIcon;

// Deliverables screen images from Figma
const imgFrame14 = BRIEFS_ASSETS.imgFrame14;
const imgFrame15 = BRIEFS_ASSETS.imgFrame15;
const imgLine10 = BRIEFS_ASSETS.imgLine10;
const imgLineStroke = BRIEFS_ASSETS.imgLineStroke;

// AI Response screen images from Figma
const imgLine11 = BRIEFS_ASSETS.imgLine11;
const imgLine12 = BRIEFS_ASSETS.imgLine12;
const imgFrame14_v2 = BRIEFS_ASSETS.imgFrame14_v2;
const imgFrame15_v2 = BRIEFS_ASSETS.imgFrame15_v2;
// Upload icon (match profile picture dialog)
const uploadIcon = BRIEFS_ASSETS.uploadIcon;

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

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const topbarRight = <DashboardTopbarRight />;

  const pageTitle = isCreatingBrief && (briefView === "form" || briefView === "deliverables" || briefView === "ai-response") ? "New brief" : activeName;

  const titleNode = (
    isCreatingBrief && (briefView === "form" || briefView === "deliverables" || briefView === "ai-response") ? (
      <div className="flex items-center gap-2">
        <button onClick={() => briefView === "deliverables" || briefView === "ai-response" ? setBriefView("form") : setBriefView("templates")} className="hover:opacity-70 transition">
          <ArrowLeft size={20} className="text-black" />
        </button>
        <span className="text-sm leading-[19.6px] text-black">{pageTitle}</span>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <Icons.briefs size={20} className="text-black" />
        <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
      </div>
    )
  );

  return (
    <DashboardLayout
      title={titleNode}
      onNavigate={(path) => {
        if (path === "/dashboard/briefs") {
          if (isCreatingBrief) {
            setIsCreatingBrief(false);
            setBriefView("templates");
            return;
          }
        }
        navigate(path);
      }}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      {/* Briefs Content */}
      <div className="px-4 md:px-6 pt-[24px] md:pt-[40px] pb-[24px] md:pb-[40px]">
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
            <div className="space-y-6 md:space-y-10">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:items-center">
                <div className="flex flex-col gap-1 md:text-center lg:text-left">
                  <h1 className="h1-heading text-2xl md:text-h1 text-black">Briefs overview</h1>
                  <p className="text-sm md:text-body text-black">Kickstart your next project with clarity and ease</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center md:justify-center lg:justify-start">
                  <button
                    onClick={() => navigate("/dashboard/calculator")}
                    className="btn w-full sm:w-[216px] h-[48px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
                  >
                    <Icons.calculator size={16} className="text-black" />
                    <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      Quick calculator
                    </span>
                  </button>
                  <button 
                    onClick={() => setIsCreatingBrief(true)}
                    className="btn w-full sm:w-[216px] h-[48px] backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] py-[18px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
                  >
                    <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      Create brief
                    </span>
                    <svg className="h-[14px] w-[15.567px]" width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#000"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { 
                    title: "Draft briefs",
                    titleBold: true,
                    value: 5,
                    icon: (
                      <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M33.3775 0H6.62252C2.96358 0 0 2.96358 0 6.62252V36.7881C0 40.447 2.96358 43.4106 6.62252 43.4106H33.3775C37.0364 43.4106 40 40.447 40 36.7881V6.62252C40 2.96358 37.0364 0 33.3775 0ZM29.8758 34.3295H10.1159C8.75829 34.3295 7.66556 33.2285 7.66556 31.8791C7.66556 30.5215 8.76656 29.4288 10.1159 29.4288H29.8758C31.2334 29.4288 32.3262 30.5298 32.3262 31.8791C32.3262 33.2368 31.2252 34.3295 29.8758 34.3295ZM29.8758 24.1557H10.1159C8.75829 24.1557 7.66556 23.0547 7.66556 21.7053C7.66556 20.3477 8.76656 19.255 10.1159 19.255H29.8758C31.2334 19.255 32.3262 20.356 32.3262 21.7053C32.3262 23.0629 31.2252 24.1557 29.8758 24.1557ZM29.8758 13.9818H10.1159C8.75829 13.9818 7.66556 12.8808 7.66556 11.5315C7.66556 10.1739 8.76656 9.08115 10.1159 9.08115H29.8758C31.2334 9.08115 32.3262 10.1822 32.3262 11.5315C32.3262 12.8891 31.2252 13.9818 29.8758 13.9818Z" fill="#FFB546"/>
                      </svg>
                    )
                  },
                  { 
                    title: "In review",
                    titleBold: true,
                    value: 4,
                    icon: (
                      <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M24.9632 32C35.1852 32 44.1478 26.6294 49.1935 18.5562C50.1707 16.9932 50.1707 15.0095 49.1935 13.4438C44.1478 5.37061 35.1852 0 24.9632 0C14.7412 0 5.77867 5.37061 0.732901 13.4438C-0.2443 15.0068 -0.2443 16.9905 0.732901 18.5562C5.77867 26.6294 14.7412 32 24.9632 32Z" fill="#E5E5E5"/>
                      </svg>
                    )
                  },
                  { 
                    title: "SOW Ready to sign",
                    titleBold: true,
                    value: 3,
                    icon: (
                      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2"/>
                      </svg>
                    )
                  },
                ].map((card) => {
                  const isSOWCard = card.title === "SOW Ready to sign";
                  
                  if (isSOWCard) {
                    return (
                      <button
                        key={card.title}
                        onClick={() => navigate("/dashboard/sow")}
                        className="card-brief relative overflow-hidden hover:opacity-90 transition cursor-pointer w-full text-left"
                      >
                        <StatCard title={card.title} value={card.value} className="rounded-xl p-6" titleBold={card.titleBold} />
                        {card.icon}
                      </button>
                    );
                  }
                  
                  return (
                    <div key={card.title} className="relative overflow-hidden">
                      <StatCard title={card.title} value={card.value} className="rounded-xl p-6" titleBold={card.titleBold} />
                      {card.icon}
                    </div>
                  );
                })}
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
                    <BriefCard
                      key={i}
                      title={card.title}
                      description={card.content}
                      right={
                        <div className="relative">
                          {card.badgeIcon}
                          {card.notificationBadge}
                        </div>
                      }
                      meta={
                        <div className="flex items-center justify-between">
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
                      }
                      className="h-full"
                    >
                      <div className="h-px bg-[#ececec]" />
                      <div className="flex items-center justify-between text-xs text-[#848487]">
                        <div className="flex items-center gap-1">
                          <span>💬</span>
                          <span>12</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🕒</span>
                          <span>3h</span>
                        </div>
                      </div>
                    </BriefCard>
                  ))}
                </div>
              </div>

              {/* All briefs */}
              <AllBriefsSection />
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}

function TemplateSelectionScreen({ onCancel, onCreateBrief }: { onCancel: () => void; onCreateBrief: () => void }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"All" | "Popular" | "Recent" | "New">("All");
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const templates = ALL_TEMPLATES.filter((template) => {
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
          <h1 className="h1-heading text-h1 text-black text-center">
            Write your next brief in minutes
          </h1>
          <p className="text-sm leading-[18.62px] text-black text-center max-w-[600px]">
            Custom briefs, fast and easy.
            <br />
            Not sure where to begin? Try the budget planner first.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center w-full sm:w-auto">
          <button
            onClick={() => navigate("/dashboard/calculator")}
            className="btn w-full sm:w-[216px] h-[48px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
          >
            <Icons.calculator size={16} className="text-black" />
            <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
              Quick calculator
            </span>
          </button>
          <button 
            onClick={onCreateBrief}
            className="btn w-full sm:w-[216px] h-[48px] backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] py-[18px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
          >
            <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">
              Create brief
            </span>
        <svg className="h-[14px] w-[15.567px]" width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#000"></path></svg>
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
                 <svg className="h-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
<path d="M18.5 20L18.5 14M18.5 14L21 16.5M18.5 14L16 16.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
               
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
        <div className="px-6">
          <TabFilter
            tabs={["All", "Popular", "Recent", "New"]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
          />
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
                <div className={`brief-icon`}>
                   <div
                      className="template-icon"
                      dangerouslySetInnerHTML={{ __html: template.icon }}
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
  const [showSaveDraftConfirmation, setShowSaveDraftConfirmation] = useState(false);

  // Check if form is complete
  const isFormComplete = formData.projectTitle.trim() !== "" && 
                         formData.dueDate !== undefined && 
                         formData.projectLead.trim() !== "" && 
                         formData.objective.trim() !== "";

  const handleNext = () => {
    if (isFormComplete) {
    onNext();
    }
  };

  const handleChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  const handleViewAllBriefsFromSave = () => {
    setShowSaveDraftConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  const handleSaveDraft = () => {
    setShowSaveDraftConfirmation(true);
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  return (
    <>
      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex items-center justify-center w-full h-[85vh] px-6 lg:px-[10%] xl:px-[15%] overflow-hidden">
        <div className="flex flex-row gap-4 w-full h-full">
      {/* Left Form Section */}
        <div className="flex flex-col gap-2 p-4 md:p-6 rounded-xl flex-[1_1_0%] min-w-0 h-full overflow-hidden">
          <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto p-2">
          <p className="text-sm leading-[18.62px] text-[#424242] w-full">
            Start your brief by filling out these required fields.
          </p>

          <div className="flex flex-col gap-6">
            {/* Project Title */}
            <Field label="Project title" helpText="Give your brief a short, clear name">
              <StyledInput
                value={formData.projectTitle}
                onChange={(e) => handleChange("projectTitle", e.target.value)}
                placeholder="e.g. Spring Campaign 2025"
                variant="brief"
              />
            </Field>

            {/* Due Date */}
            <DateField
              label={
                <div className="flex items-center gap-2">
                  <span>Due date</span>
                </div>
              }
              helpText="When is this project due?"
              value={formData.dueDate}
              onChange={(date) => handleChange("dueDate", date)}
            />

            {/* Project Lead */}
            <Field label="Project lead*" helpText="Who will own this project?">
              <Select value={formData.projectLead} onValueChange={(value) => handleChange("projectLead", value)}>
                <SelectTrigger className={`border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto bg-[#f9f9f9] ${formData.projectLead ? '[&_span]:text-black' : '[&_span]:text-[#848487]'}`}>
                  <SelectValue placeholder="Choose a lead" />
                </SelectTrigger>
                <SelectContent className="bg-[#f9f9f9]">
                  <SelectItem value="henry-bray" className="text-black">Henry Bray</SelectItem>
                  <SelectItem value="john-doe" className="text-black">John Doe</SelectItem>
                  <SelectItem value="jane-smith" className="text-black">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Objective */}
            <Field label="Objective" helpText="What's the main goal of this project?">
              <Textarea
                value={formData.objective}
                onChange={(e) => handleChange("objective", e.target.value)}
                placeholder="e.g. Increase signups by 20% through targeted ads"
                className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[74px] resize-none bg-[#f9f9f9] text-black placeholder:text-[#848487]"
                rows={3}
              />
            </Field>
            </div>
          </div>

          {/* Separator line */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
        </div>

          {/* Note and Next Button */}
          <div className="flex flex-col gap-2 shrink-0">
            <p className="text-sm leading-[normal] opacity-[0.826] text-[#434343]">
              *You can assign multiple leads
            </p>
            <button
          onClick={handleNext}
              disabled={!isFormComplete}
              className={`w-full h-10 px-5 rounded-[28px] flex items-center justify-center transition ${
                isFormComplete
                  ? "bg-[#ffb546] hover:opacity-90 cursor-pointer"
                  : "bg-[#f9f9f9] cursor-not-allowed opacity-50"
              }`}
            >
              <span className={`text-sm font-semibold leading-[18.62px] ${
                isFormComplete ? "text-black" : "text-[#848487]"
              }`}>Next</span>
            </button>
          </div>
      </div>

        {/* Right Panel - Desktop only */}
        <div className="flex flex-col gap-2.5 pb-5 pl-2.5 pt-2.5 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
        {/* Loading State */}
          <div className="bg-white flex flex-col gap-8 items-center justify-center p-6 rounded-xl overflow-hidden h-[89%]">
          <div className="flex flex-col gap-2 items-center">
            <img src={briefLoadingIcon} alt="" className="h-[36.966px] w-[77.813px]" />
            <p className="text-sm font-bold leading-[18.62px] opacity-50 text-[#c1c1c3]">
              Brief loading...
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
        </div>

        {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0 w-full">
          {/* Token Estimate */}
            <div className="flex gap-2 items-center pb-2 w-full">
            <img src={tokenIcon} alt="" className="h-5 w-5" />
            <span className="text-[13px] leading-[18.62px] text-[#848487]">0</span>
            <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
          </div>

          {/* Action Buttons */}
            <div className="flex items-center w-full min-w-0">
              <button
                onClick={onCancel}
                className="w-[25%] min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap truncate">Discard</span>
              </button>
              <div className="w-[15%] shrink-0" />
              <div className="flex gap-1 items-center w-[60%] min-w-0">
                <button 
                  onClick={handleSaveDraft}
                  className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap truncate">Save draft</span>
                  <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
                </button>
                <button
                type="button"
                onClick={() => navigate("/dashboard/briefs/review")}
                  className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap truncate">Review brief</span>
                  <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
                </button>
              </div>
            </div>
            </div>
        </div>
        </div>
      </div>

      {/* Tablet/iPad Layout - Vertical stack: Form -> Line -> Document -> Line -> Buttons */}
      <div className="flex lg:hidden flex-col items-center w-full min-h-[85vh] overflow-y-auto px-4 md:px-6 lg:px-[10%] xl:px-[15%] pb-8 pt-4">
        {/* Form Section */}
        <div className="flex flex-col gap-2 rounded-xl w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Start your brief by filling out these required fields.
            </p>

            <div className="flex flex-col gap-6">
              {/* Project Title */}
              <Field label="Project title" helpText="Give your brief a short, clear name">
                <StyledInput
                  value={formData.projectTitle}
                  onChange={(e) => handleChange("projectTitle", e.target.value)}
                  placeholder="e.g. Spring Campaign 2025"
                  variant="brief"
                />
              </Field>

              {/* Due Date */}
              <DateField
                label={
                  <div className="flex items-center gap-2">
                    <span>Due date</span>
                  </div>
                }
                helpText="When is this project due?"
                value={formData.dueDate}
                onChange={(date) => handleChange("dueDate", date)}
              />

              {/* Project Lead */}
              <Field label="Project lead*" helpText="Who will own this project?">
                <Select value={formData.projectLead} onValueChange={(value) => handleChange("projectLead", value)}>
                  <SelectTrigger className={`border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto bg-[#f9f9f9] ${formData.projectLead ? '[&_span]:text-black' : '[&_span]:text-[#848487]'}`}>
                    <SelectValue placeholder="Choose a lead" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#f9f9f9]">
                    <SelectItem value="henry-bray" className="text-black">Henry Bray</SelectItem>
                    <SelectItem value="john-doe" className="text-black">John Doe</SelectItem>
                    <SelectItem value="jane-smith" className="text-black">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* Objective */}
              <Field label="Objective" helpText="What's the main goal of this project?">
                <Textarea
                  value={formData.objective}
                  onChange={(e) => handleChange("objective", e.target.value)}
                  placeholder="e.g. Increase signups by 20% through targeted ads"
                  className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[74px] resize-none bg-[#f9f9f9] text-black placeholder:text-[#848487]"
                  rows={3}
                />
              </Field>
            </div>
          </div>

          {/* Separator line */}
          <div className="h-[9px] relative w-full shrink-0 mt-4">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* Note */}
          <div className="shrink-0">
            <p className="text-sm leading-[normal] opacity-[0.826] text-[#434343]">
              *You can assign multiple leads
            </p>
          </div>
        </div>

        {/* White Document - Shown on mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 pb-5 w-full max-w-4xl mt-5">
          {/* Loading State - Double height */}
          <div className="bg-white flex flex-col gap-8 items-center justify-center rounded-xl min-h-[600px]">
            <div className="flex flex-col gap-2 items-center">
              <img src={briefLoadingIcon} alt="" className="h-[36.966px] w-[77.813px]" />
              <p className="text-sm font-bold leading-[18.62px] opacity-50 text-[#c1c1c3]">
                Brief loading...
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>
        </div>

        {/* Buttons section for mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 w-full max-w-4xl pb-5">
          {/* Token Estimate */}
          <div className="flex gap-2 items-center pb-2 w-full justify-end">
            <img src={tokenIcon} alt="" className="h-5 w-5" />
            <span className="text-[13px] leading-[18.62px] text-[#848487]">0</span>
            <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
          </div>

          {/* Action Buttons - Order: Next, Discard, Save draft, Review brief - Stacked on mobile, row on tablet */}
          <div className="flex flex-col md:flex-row items-center gap-2.5 w-full min-w-0">
            <button
              onClick={handleNext}
              disabled={!isFormComplete}
              className={`w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 rounded-[28px] flex items-center justify-center transition ${
                isFormComplete
                  ? "bg-[#ffb546] hover:opacity-90 cursor-pointer"
                  : "bg-[#f9f9f9] cursor-not-allowed opacity-50"
              }`}
            >
              <span className={`text-[13px] font-semibold leading-[18.62px] whitespace-nowrap ${
                isFormComplete ? "text-black" : "text-[#848487]"
              }`}>Next</span>
            </button>
            <button
              onClick={onCancel}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Discard</span>
            </button>
            <button 
              onClick={handleSaveDraft}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
              <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/briefs/review")}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
              <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <SuccessDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleViewAllBriefs}
      />

      {/* Save Draft Confirmation Dialog */}
      <SuccessDialog
        open={showSaveDraftConfirmation}
        onOpenChange={setShowSaveDraftConfirmation}
        onConfirm={handleViewAllBriefsFromSave}
        title="Brief successfully drafted!"
      />
    </>
  );
}

function DeliverablesSelectionScreen({ onCancel, onBack, onNavigateToAiResponse }: { onCancel: () => void; onBack: () => void; onNavigateToAiResponse: (inputText: string) => void }) {
  const navigate = useNavigate();
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [tokenEstimate, setTokenEstimate] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSaveDraftConfirmation, setShowSaveDraftConfirmation] = useState(false);

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

  const handleViewAllBriefsFromSave = () => {
    setShowSaveDraftConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  const handleSaveDraft = () => {
    setShowSaveDraftConfirmation(true);
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  return (
    <>
      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex items-center justify-center w-full h-[85vh] px-6 lg:px-[10%] xl:px-[15%] overflow-hidden">
        <div className="flex flex-row gap-4 w-full max-w-full h-full">
        {/* Left Panel */}
          <div className="flex flex-col gap-2 p-4 md:p-6 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
            <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Great! Next up are the deliverables. You can either browse and select the ones you need, or start detailing them below. TIKO will summarise the deliverables and prompt you to make sure you include everything you need for this project.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold leading-[18.62px] text-[#424242] w-full">
                Browse recomended deliverables
              </p>

              <div className="flex flex-col gap-1">
                {RECOMMENDED_DELIVERABLES.map((deliverable) => {
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

              <button className="flex items-center justify-center gap-1.5 pt-1">
                <p className="text-sm font-bold leading-[18.62px] text-[#848487]">
                  More deliverables
                </p>
                <ChevronDownIcon size={19} className="text-[#848487]" />
              </button>
            </div>

            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Prefer to describe it instead? Or not sure which deliverables you need yet? <br />
              <span className="font-bold">Continue describing your brief below</span>
            </p>
          </div>

            {/* Separator line - aligned with right side */}
            <div className="h-[9px] relative w-full shrink-0">
              <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
            </div>

            {/* AI Chat Input at Bottom */}
            <div className="shrink-0">
            <ChatInput
              value={chatInput}
              onChange={setChatInput}
              onSubmit={(v) => { if (v.trim()) { onNavigateToAiResponse(v.trim()); } }}
              leftIconSrc={imgFrame14}
              rightIconSrc={imgFrame15}
              helpText="Need a hand? Talk to your Iris account manager"
            />
          </div>
        </div>

        {/* Right Panel */}
          <div className="flex flex-col gap-2.5 pb-5 pl-2.5 pt-2.5 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
          {/* Brief Preview - made smaller to prevent scroll */}
          <div className="h-[89%] overflow-hidden">
          <BriefPreviewPanel
            projectTitle={mockBriefData.projectTitle}
            launchDate={mockBriefData.launchDate}
            projectLead={mockBriefData.projectLead}
            objective={mockBriefData.objective}
          />
          </div>

          {/* Separator - matching left side line width and position */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0 w-full">
            {/* Token Estimate */}
            <TokenEstimate value={tokenEstimate} />

            {/* Action Buttons */}
            <div className="flex items-center w-full gap-2 min-w-0">
              <button
                onClick={onCancel}
                className="flex-shrink-0 h-8 px-3 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Discard</span>
              </button>
              <div className="flex gap-1 items-center flex-1 min-w-0">
                <button 
                  onClick={handleSaveDraft}
                  className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
                  <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
                </button>
                <button
                  onClick={() => navigate("/dashboard/briefs/review")}
                  className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
                  <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Tablet/iPad Layout - Vertical stack: Form -> Line -> Document -> Line -> Buttons */}
      <div className="flex lg:hidden flex-col items-center w-full min-h-[85vh] overflow-y-auto px-4 md:px-6 lg:px-[10%] xl:px-[15%] pb-8 pt-4">
        {/* Form Section */}
        <div className="flex flex-col gap-2 rounded-xl w-full max-w-4xl">
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Great! Next up are the deliverables. You can either browse and select the ones you need, or start detailing them below. TIKO will summarise the deliverables and prompt you to make sure you include everything you need for this project.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold leading-[18.62px] text-[#424242] w-full">
                Browse recomended deliverables
              </p>

              <div className="flex flex-col gap-1">
                {RECOMMENDED_DELIVERABLES.map((deliverable) => {
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

              <button className="flex items-center justify-center gap-1.5 pt-1">
                <p className="text-sm font-bold leading-[18.62px] text-[#848487]">
                  More deliverables
                </p>
                <ChevronDownIcon size={19} className="text-[#848487]" />
              </button>
            </div>

            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Prefer to describe it instead? Or not sure which deliverables you need yet? <br />
              <span className="font-bold">Continue describing your brief below</span>
            </p>
          </div>

          {/* Separator line */}
          <div className="h-[9px] relative w-full shrink-0 mt-4">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>
        </div>

        {/* White Document - Shown on mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 pb-5 w-full max-w-4xl mt-5">
          {/* Brief Preview - Double height */}
          <div className="bg-white flex flex-col p-6 rounded-xl min-h-[600px] overflow-y-auto">
            <BriefPreviewPanel
              projectTitle={mockBriefData.projectTitle}
              launchDate={mockBriefData.launchDate}
              projectLead={mockBriefData.projectLead}
              objective={mockBriefData.objective}
            />
          </div>

          {/* Separator */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>
        </div>

        {/* Buttons section for mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 w-full max-w-4xl pb-5">
          {/* AI Chat Input above buttons */}
          <div className="shrink-0 pb-2 w-full">
            <ChatInput
              value={chatInput}
              onChange={setChatInput}
              onSubmit={(v) => { if (v.trim()) { onNavigateToAiResponse(v.trim()); } }}
              leftIconSrc={imgFrame14}
              rightIconSrc={imgFrame15}
              helpText="Need a hand? Talk to your Iris account manager"
              className="w-full md:w-[516px]"
              containerClassName="w-full"
            />
          </div>
          {/* Token Estimate */}
          <div className="flex gap-2 items-center pb-2 w-full justify-end">
            <TokenEstimate value={tokenEstimate} />
          </div>

          {/* Action Buttons - Order: Discard, Save draft, Review brief - Stacked on mobile, row on tablet */}
          <div className="flex flex-col md:flex-row items-center gap-2.5 w-full min-w-0">
            <button
              onClick={onCancel}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Discard</span>
            </button>
            <button 
              onClick={handleSaveDraft}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
              <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/briefs/review")}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
              <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <SuccessDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleViewAllBriefs}
      />

      {/* Save Draft Confirmation Dialog */}
      <SuccessDialog
        open={showSaveDraftConfirmation}
        onOpenChange={setShowSaveDraftConfirmation}
        onConfirm={handleViewAllBriefsFromSave}
        title="Brief successfully drafted!"
      />
    </>
  );
}

function AIResponseScreen({ userInput, onBack, onCancel }: { userInput: string; onBack: () => void; onCancel: () => void }) {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSaveDraftConfirmation, setShowSaveDraftConfirmation] = useState(false);
  
  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs");
  };

  const handleViewAllBriefsFromSave = () => {
    setShowSaveDraftConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  const handleSaveDraft = () => {
    setShowSaveDraftConfirmation(true);
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
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
  const deliverablesList = DELIVERABLES_LIST;

  return (
    <>
      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex items-center justify-center w-full h-[85vh] px-6 lg:px-[10%] xl:px-[15%] overflow-hidden">
        <div className="flex flex-row gap-4 w-full max-w-full h-full">
        {/* Left Panel */}
          <div className="flex flex-col gap-2 p-4 md:p-6 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
          <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-y-auto">
          {/* User Message Bubble */}
          <div className="bg-[#efeff0] rounded-xl p-4">
            <p className="text-sm leading-[18.62px] text-[#424242] whitespace-pre-wrap">
              {userInput || "For this project we need to create like at least 5 different KVs i.e. Q7, B7, Combo, Family and B7&B7R key visual. For each of these we need a clean variant and 80/20, 70/30 variant. For the size you can use default sizes (suggest best ones) for the clean dna 70/30 and for 80/20 we need PDF, PT EXT, LS EXT."}
            </p>
          </div>

          {/* AI Response */}
            <div className="flex flex-col gap-6 px-6 py-4">
            <p className="text-sm leading-[18.62px] text-[#424242]">
              Thanks for the input, review here the list of deliverables.
            </p>

            {/* Deliverables List */}
              <div className="flex flex-col gap-3 w-full">
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

          {/* Separator line - aligned with right side */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* AI Chat Input at Bottom */}
          <div className="shrink-0">
            <ChatInput
              leftIconSrc={imgFrame14_v2}
              rightIconSrc={imgFrame15_v2}
              helpText="Need a hand? Talk to your Iris account manager"
            />
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-2.5 pb-5 pl-2.5 pt-2.5 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
          {/* Brief Preview - made smaller to prevent scroll */}
          <div className="h-[89%] overflow-hidden">
          <BriefPreviewPanel
            projectTitle={mockBriefData.projectTitle}
            launchDate={mockBriefData.launchDate}
            projectLead={mockBriefData.projectLead}
            objective={mockBriefData.objective}
          />
          </div>

          {/* Separator - matching left side line width and position */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0 w-full">
            {/* Token Estimate */}
            <TokenEstimate value={10} />

            {/* Action Buttons */}
            <div className="flex items-center w-full gap-2 min-w-0">
              <button
                onClick={onCancel}
                className="flex-shrink-0 h-8 px-3 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Discard</span>
              </button>
              <div className="flex gap-1 items-center flex-1 min-w-0">
                <button 
                  onClick={handleSaveDraft}
                  className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
                  <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
                </button>
                <button
                  onClick={() => navigate("/dashboard/briefs/review")}
                  className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
                  <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Vertical stack: Form -> Line -> Document -> Line -> Buttons */}
      <div className="flex lg:hidden flex-col items-center w-full min-h-[85vh] overflow-y-auto px-4 md:px-6 lg:px-[10%] xl:px-[15%] pb-8 pt-4">
        {/* Form Section */}
        <div className="flex flex-col gap-2 rounded-xl w-full max-w-4xl">
          <div className="flex flex-col gap-6">
            {/* User Message Bubble */}
            <div className="bg-[#efeff0] rounded-xl p-4">
              <p className="text-sm leading-[18.62px] text-[#424242] whitespace-pre-wrap">
                {userInput || "For this project we need to create like at least 5 different KVs i.e. Q7, B7, Combo, Family and B7&B7R key visual. For each of these we need a clean variant and 80/20, 70/30 variant. For the size you can use default sizes (suggest best ones) for the clean dna 70/30 and for 80/20 we need PDF, PT EXT, LS EXT."}
              </p>
            </div>

            {/* AI Response */}
            <div className="flex flex-col gap-6 px-0 py-0">
              <p className="text-sm leading-[18.62px] text-[#424242]">
                Thanks for the input, review here the list of deliverables.
              </p>

              {/* Deliverables List */}
              <div className="flex flex-col gap-3 w-full">
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

          {/* Separator line */}
          <div className="h-[9px] relative w-full shrink-0 mt-4">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>
        </div>

        {/* White Document - Shown on mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 pb-5 w-full max-w-4xl mt-5">
          {/* Brief Preview - Double height */}
          <div className="bg-white flex flex-col p-6 rounded-xl min-h-[600px] overflow-y-auto">
            <BriefPreviewPanel
              projectTitle={mockBriefData.projectTitle}
              launchDate={mockBriefData.launchDate}
              projectLead={mockBriefData.projectLead}
              objective={mockBriefData.objective}
            />
          </div>

          {/* Separator */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* AI Chat Input below white document on mobile */}
          <div className="flex lg:hidden shrink-0 pb-2 pt-2 w-full">
            <ChatInput
              leftIconSrc={imgFrame14_v2}
              rightIconSrc={imgFrame15_v2}
              helpText="Need a hand? Talk to your Iris account manager"
              className="w-full md:w-[516px]"
              containerClassName="w-full"
            />
          </div>
        </div>

        {/* Buttons section for mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 w-full max-w-4xl pb-5">
          {/* Token Estimate */}
          <div className="flex gap-2 items-center pb-2 w-full justify-end">
            <TokenEstimate value={10} />
          </div>

          {/* Action Buttons - Order: Discard, Save draft, Review brief - Stacked on mobile, row on tablet */}
          <div className="flex flex-col md:flex-row items-center gap-2.5 w-full">
            <button
              onClick={onCancel}
              className="w-full md:flex-1 h-8 px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
            >
              <span className="text-[13px] font-semibold leading-[18.62px]">Discard</span>
            </button>
            <button 
              onClick={handleSaveDraft}
              className="w-full md:flex-1 h-8 px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-[10px] transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black">Save draft</span>
              <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
            </button>
            <button
              onClick={() => navigate("/dashboard/briefs/review")}
              className="w-full md:flex-1 h-8 px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-[10px] transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black">Review brief</span>
              <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <SuccessDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleViewAllBriefs}
      />

      {/* Save Draft Confirmation Dialog */}
      <SuccessDialog
        open={showSaveDraftConfirmation}
        onOpenChange={setShowSaveDraftConfirmation}
        onConfirm={handleViewAllBriefsFromSave}
        title="Brief successfully drafted!"
      />
    </>
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
      <TabFilter
        tabs={["All", "Drafts", "In review"]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        variant="compact"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((b) => {
          // Badge styling based on type
          const badgeStyle = getBadgeStyle(b.badge);

          return (
            <BriefCard
              key={b.id}
              title={b.title}
              description={b.desc}
              right={b.icon}
              meta={
                <div className="flex items-center justify-between">
                  <Badge
                    label={b.badge}
                    intent={b.badge === "Creation" ? "creation" : b.badge === "Adaptation" ? "adaptation" : b.badge === "Resize" ? "resize" : "default"}
                    width={b.badge === "Creation" ? "creation" : b.badge === "Adaptation" ? "adaptation" : b.badge === "Resize" ? "resize" : "auto"}
                  />
                  <AvatarStack count={b.avatars} seedPrefix={`brief_${b.id}_avatar`} />
                </div>
              }
            >
              <div className="h-px bg-[#ececec]" />
              <div className="flex items-center justify-between text-xs text-[#848487]">
                <div className="flex items-center gap-1">
                  <span>💬</span>
                  <span>{b.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🕒</span>
                  <span>{b.date}</span>
                </div>
              </div>
            </BriefCard>
          );
        })}
      </div>
    </div>
  );
}
