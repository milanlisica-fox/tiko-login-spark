import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, Bell, ChevronDown, ArrowRight, Calculator, Coins, Wallet, HelpCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import HorizontalBarChart from "@/components/common/HorizontalBarChart";
import { BRAND } from "@/constants/branding";
import { DASHBOARD_ASSETS } from "@/constants/dashboard-assets";
import draftBriefsIcon from "@/assets/images/Vector-yellow.png";
import inReviewIcon from "@/assets/images/Vector-gray.png";
import sowReadyIcon from "@/assets/images/Vector-blue.png";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;
const briefsVector1 = draftBriefsIcon;
const briefsVector2 = inReviewIcon;
const briefsVector3 = sowReadyIcon;
const projectsVector = DASHBOARD_ASSETS.projectsVector;
const createBriefArrowIcon = DASHBOARD_ASSETS.createBriefArrowIcon;

export default function TikoDashboard() {
  const navigate = useNavigate();
  const [budgetView, setBudgetView] = useState<"quarter" | "annual">("quarter");
const [open, setOpen] = useState(false);
  // nav items centralized via DashboardLayout
  const { activeName: active } = useActiveNav();

  // Mock data for budget wallet (quarter view)
  const quarterBudgetData = {
    totalBudget: 10000,
    tokensSpent: 2750,
    tokensCommitted: 2000,
    tokensRemaining: 4500,
    tokensPending: 750,
  };

  // Mock data for budget wallet (annual view)
  const annualBudgetData = {
    totalBudget: 40000,
    tokensSpent: 11000,
    tokensCommitted: 8000,
    tokensRemaining: 18000,
    tokensPending: 3000,
  };

  const topbarRight = <DashboardTopbarRight />;

  const titleNode = (
    <div className="flex items-center gap-2">
      <Home size={20} className="text-black" />
      <span className="text-sm leading-[19.6px] text-black">{active}</span>
    </div>
  );

  return (
    <DashboardLayout
      title={titleNode}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="px-4 md:px-6 pt-[24px] md:pt-[40px] pb-[24px] md:pb-[40px]">
        <div className="space-y-6 md:space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-1 md:text-center lg:text-left">
               <h1 className="h1-heading text-2xl md:text-h1 text-black wavy-text">
    {/* Animate "Welcome back," */}
    {"Welcome back, ".split("").map((char, i) => (
      <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ))}

    {/* Animate " Murray!" separately */}
    <span className="text-[#00C3B1]">
      {" Murray!".split("").map((char, i) => (
        <span
          key={`murray-${i}`}
          style={{ animationDelay: `${(i + 12) * 0.1}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  </h1>
            <p className="text-sm md:text-body text-black">
              Create briefs, track progress, and keep momentum flowing.
            </p>
            </div>

            <div className="sections-wrap gap-4">

              {/* Briefs Section */}
              <div className="section bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 border-o">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 pb-1">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[22px] font-bold leading-[29.26px] text-[#fa9f41]">Briefs</h2>
                    <p className="text-sm leading-[18.62px] text-black">
                      Kickstart your next project with clarity and ease
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard/briefs")}
                    className="hidden sm:flex card-brief items-center gap-2 px-4 py-2 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition self-auto bg-[#ffb546]"
                  >
                    <span className="text-sm font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      View all
                    </span>
                    <ArrowRight size={18} className="text-black" />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 cards-section">
                  {/* Cards Section - 75% on desktop */}
                  <div className="cs-item grid-col-item  flex-1 lg:flex-[3] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Draft briefs */}
                    <div className="flex-1 bg-[#f9f9f9] rounded-[12px] p-4 md:p-[20px] flex flex-col gap-[10px] relative overflow-clip">
                      <p className="text-xs md:text-sm font-bold leading-[18.62px] text-black pr-4">Draft briefs</p>
                      <p className="text-2xl md:text-[40px] font-medium leading-[45.6px] text-black">5</p>
                      <img 
                        src={briefsVector1} 
                        alt="" 
                        className="absolute right-0 top-[10px] md:top-[20px] w-[35px] h-[45px]"
                      />
                    </div>

                    {/* In review */}
                    <div className="flex-1 bg-[#f9f9f9] rounded-[12px] p-4 md:p-[20px] flex flex-col gap-[10px] relative overflow-clip">
                      <p className="text-xs md:text-sm font-bold leading-[18.62px] text-black pr-4">In review</p>
                      <p className="text-2xl md:text-[40px] font-medium leading-[45.6px] text-black">4</p>
                      <img 
                        src={briefsVector2} 
                        alt="" 
                        className="absolute right-0 top-[10px] md:top-[20px] w-[35px] h-[45px]"
                      />
                    </div>

                    {/* SOW ready to sign */}
                    <button
                      onClick={() => navigate("/dashboard/sow")}
                      className="card-item flex-1 bg-[#f9f9f9] rounded-[12px] p-4 md:p-[20px] flex flex-col gap-[10px] relative overflow-clip hover:bg-[#f0f0f0] transition cursor-pointer text-left"
                    >
                      <p className="text-xs md:text-sm font-bold leading-[18.62px] text-black pr-4">SOW ready to sign</p>
                      <p className="text-2xl md:text-[40px] font-medium leading-[45.6px] text-black">3</p>
                      <img 
                        src={briefsVector3} 
                        alt="" 
                        className="absolute right-0 top-[10px] md:top-[20px] w-[35px] h-[45px]"
                      />
                    </button>
                  </div>

                  {/* Buttons Section - 25% on desktop */}
                {/* Desktop version (visible on sm and above) */}
      <div className="cs-item hidden sm:flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:w-[25%] items-center sm:justify-center lg:items-center">
        {/* Create brief */}
        <button
          onClick={() =>
            navigate("/dashboard/briefs", { state: { createBrief: true } })
          }
          className="btn w-full sm:flex-1 lg:flex-none h-[48px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
        >
          <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
            Create brief
          </span>
          <svg
            className="h-[14px] w-[15.567px]"
            width="45"
            height="40"
            viewBox="0 0 45 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z"
              fill="#000"
            ></path>
          </svg>
        </button>

        {/* Quick calculator */}
        <button
          onClick={async (e) => {
            const button = e.currentTarget;
            button.classList.add("animate-bounce-once", "bg-[#03b3e2]");
            await new Promise((resolve) => setTimeout(resolve, 600));
            button.classList.remove("animate-bounce-once", "bg-[#03b3e2]");
            navigate("/dashboard/calculator");
          }}
          className="btn w-full sm:flex-1 lg:flex-none h-[48px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
        >
          <Calculator size={16} className="text-black" />
          <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
            Quick calculator
          </span>
        </button>
      </div>

      {/* Mobile floating button (only visible below sm) */}
      <div className="sm:hidden relative bottom-0 right-0 flex flex-col items-end z-50">
        {open && (
          <div className="flex flex-col gap-2.5 mb-3 bg-white/70 backdrop-blur-md rounded-[20px] p-3 shadow-lg absolute bottom-[45px] right-0">
            {/* Same buttons from above */}
            <button
              onClick={() =>
                navigate("/dashboard/briefs", { state: { createBrief: true } })
              }
              className="btn w-full h-[48px] bg-[#ffb546] rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
            >
              <span className="text-base font-semibold text-black whitespace-nowrap">
                Create brief
              </span>
              <svg
                className="h-[14px] w-[15.567px]"
                width="45"
                height="40"
                viewBox="0 0 45 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z"
                  fill="#000"
                ></path>
              </svg>
            </button>

            <button
              onClick={() => navigate("/dashboard/calculator")}
              className="btn w-full h-[48px] bg-[#03b3e2] rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
            >
              <Calculator size={16} className="text-black" />
              <span className="text-base font-semibold text-black whitespace-nowrap">
                Quick calculator
              </span>
            </button>

            <button
              onClick={() => navigate("/dashboard/briefs")}
              className="btn w-full h-[48px] bg-[#ffb546] rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
            >
              <span className="text-base font-semibold text-black whitespace-nowrap">
                View all
              </span>
              <ArrowRight size={16} className="text-black" />
            </button>
          </div>
        )}

        {/* Floating + button */}
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#fa9f41] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#fa9f41] transition"
        >
          <Plus
            size={24}
            className={`transform transition-transform duration-300 ${
              open ? "rotate-45" : "rotate-0"
            }`}
          />
        </button>
      </div>
                </div>
              </div>

              {/* Projects Section */}
              <div className="section bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 border-c">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 pb-1">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[22px] font-bold leading-[29.26px] text-[#18c3b1]">Projects</h2>
                    <p className="text-sm leading-[18.62px] text-black">
                      Never miss a thing, keep things moving
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard/projects")}
                    className="hidden sm:flex card-brief items-center gap-2 px-4 py-2 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition self-auto bg-[#ffb546]"
                  >
                    <span className="text-sm font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      View all
                    </span>
                    <ArrowRight size={18} className="text-black" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3 grid-col-item">
                  {/* Complete */}
                  <div className="board-card board-b bg-[#f9f9f9] rounded-xl p-5 flex flex-col gap-2.5 relative overflow-clip">
                    <p className="text-sm font-bold leading-[18.62px] text-black">Complete</p>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">3</p>
                    <svg className="absolute right-[-45px] top-[-0px] sm:top-[-34px] md:top-[0px] w-[250px] h-[114px] sm:w-[175px] sm:h-[190px] md:w-[212px] md:h-[114px]" xmlns="http://www.w3.org/2000/svg" width="106" height="115" viewBox="0 0 106 115" fill="none">
                      <path d="M112.364 152.333H27.4008C12.2489 152.333 0 140.227 0 125.251V114.054C0 107.966 3.75254 102.507 9.48759 100.268L70.3783 71.7162C82.9812 66.7476 82.9811 49.1826 70.449 44.144L9.41672 15.0322C3.75247 12.7929 0 7.33441 0 1.24614V-9.25089C0 -24.2267 12.2489 -36.3333 27.4008 -36.3333H112.364C118.312 -36.3333 124.118 -34.4437 128.861 -30.8748L201.364 36.3762C215.879 47.2232 215.879 68.7071 201.364 79.554L128.861 146.805C124.118 150.374 118.312 152.263 112.364 152.263V152.333Z" fill="#00C3B1"/>
                    </svg>
                  </div>
                  {/* In progress */}
                  <div className="board-card board-c bg-[#f9f9f9] rounded-xl p-5 flex flex-col gap-2.5 relative overflow-clip">
                    <p className="text-sm font-bold leading-[18.62px] text-black">In progress</p>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">9</p>
                    <svg className="absolute right-[-45px] top-[-0px] sm:top-[-34px] md:top-[0px] w-[250px] h-[114px] sm:w-[175px] sm:h-[190px] md:w-[212px] md:h-[114px]"  xmlns="http://www.w3.org/2000/svg" width="106" height="115" viewBox="0 0 106 115" fill="none">
                      <path d="M112.364 152.333H27.4008C12.2489 152.333 0 140.227 0 125.251V114.054C0 107.966 3.75254 102.507 9.48759 100.268L70.3783 71.7162C82.9812 66.7476 82.9811 49.1826 70.449 44.144L9.41672 15.0322C3.75247 12.7929 0 7.33441 0 1.24614V-9.25089C0 -24.2267 12.2489 -36.3333 27.4008 -36.3333H112.364C118.312 -36.3333 124.118 -34.4437 128.861 -30.8748L201.364 36.3762C215.879 47.2232 215.879 68.7071 201.364 79.554L128.861 146.805C124.118 150.374 118.312 152.263 112.364 152.263V152.333Z" fill="#00C3B1"/>
                    </svg>
                  </div>
                  {/* For review */}
                  <div className="board-card board-o bg-[#f9f9f9] rounded-xl p-5 flex flex-col gap-2.5 relative overflow-clip">
                    <p className="text-sm font-bold leading-[18.62px] text-black">For review</p>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">4</p>
                      <svg className="absolute right-[-45px] top-[-0px] sm:top-[-34px] md:top-[0px] w-[250px] h-[114px] sm:w-[175px] sm:h-[190px] md:w-[212px] md:h-[114px]"  xmlns="http://www.w3.org/2000/svg" width="106" height="115" viewBox="0 0 106 115" fill="none">
                      <path d="M112.364 152.333H27.4008C12.2489 152.333 0 140.227 0 125.251V114.054C0 107.966 3.75254 102.507 9.48759 100.268L70.3783 71.7162C82.9812 66.7476 82.9811 49.1826 70.449 44.144L9.41672 15.0322C3.75247 12.7929 0 7.33441 0 1.24614V-9.25089C0 -24.2267 12.2489 -36.3333 27.4008 -36.3333H112.364C118.312 -36.3333 124.118 -34.4437 128.861 -30.8748L201.364 36.3762C215.879 47.2232 215.879 68.7071 201.364 79.554L128.861 146.805C124.118 150.374 118.312 152.263 112.364 152.263V152.333Z" fill="#00C3B1"/>
                    </svg>
                  </div>
                </div>
                
                {/* View all button for mobile */}
                <button 
                  onClick={() => navigate("/dashboard/projects")}
                  className="flex sm:hidden items-center justify-center gap-2 px-4 py-2 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition bg-[#ffb546]"
                >
                  <span className="text-sm font-semibold leading-[23.94px] text-black whitespace-nowrap">
                    View all
                  </span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>

              {/* Tracker Section */}
              <div className="section bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 border-bl">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 pb-1">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg md:text-[22px] font-bold leading-[29.26px] text-[#36bbfb]">Tracker</h2>
                    <p className="text-xs md:text-sm leading-[18.62px] text-black">
                      Get the full picture of your team's performance
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard/tracker")}
                    className="hidden sm:flex card-brief items-center gap-2 px-4 py-2 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition self-auto bg-[#ffb546]"
                  >
                    <span className="text-sm font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      View all
                    </span>
                    <ArrowRight size={18} className="text-black" />
                  </button>
                </div>

                  <div className="flex inner-wrap gap-4">
                  <div className="flex flex-col gap-4 inner-6">
                    {/* Token Summary */}
                    {/* <div className="flex-1 bg-[#f9f9f9] rounded-xl px-4 md:px-8 py-4 md:py-6">
                      <HorizontalBarChart
                        title="Token summary"
                        bars={[
                          { value: 3100, color: "#0177c7", label: "Spent" },
                          { value: 1700, color: "#03b3e2", label: "Commited" },
                          { value: 6800, color: "#00c3b1", label: "Remaining" },
                        ]}
                        legend={[
                          { color: "#0177c7", label: "Spent" },
                          { color: "#03b3e2", label: "Commited" },
                          { color: "#00c3b1", label: "Remaining" },
                        ]}
                        totalText="Total: 11,600 tokens"
                      />
                    </div> */}
                    {/* Brief Quality Score */}
                    <div className="flex-1 bg-[#f9f9f9] rounded-xl px-4 md:px-8 py-4 md:py-6">
                      <HorizontalBarChart
                        title="Brief quality score"
                        bars={[
                          { value: 52, color: "#0177c7", label: "Excellent" },
                          { value: 67, color: "#03b3e2", label: "Good" },
                          { value: 31, color: "#8092dc", label: "Needs improvement" },
                          { value: 15, color: "#00c3b1", label: "Poor" },
                        ]}
                        legend={[
                          { color: "#0177c7", label: "Excellent" },
                          { color: "#03b3e2", label: "Good" },
                          { color: "#8092dc", label: "Needs improvement" },
                          { color: "#00c3b1", label: "Poor" },
                        ]}
                        totalText="Total: 165 briefs"
                      />
                    </div>
                  </div>

                  {/* Wallet Component */}
                  <div className="inner-6">
                  <TooltipProvider>
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wallet size={20} className="text-[#03b3e2]" />
                            <CardTitle className="text-base font-bold leading-[21.28px] text-black">Wallet</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 bg-[#f1f1f3] rounded-md p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setBudgetView("quarter")}
                              className={`h-8 px-3 text-sm ${budgetView === "quarter" ? "bg-white text-black shadow-sm" : "text-[#646464]"}`}
                            >
                              Quarter
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setBudgetView("annual")}
                              className={`h-8 px-3 text-sm ${budgetView === "annual" ? "bg-white text-black shadow-sm" : "text-[#646464]"}`}
                            >
                              Annual
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {(() => {
                          const budgetData = budgetView === "quarter" ? quarterBudgetData : annualBudgetData;
                          const periodLabel = budgetView === "quarter" ? "this quarter" : "per annum";
                          
                          return (
                            <>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-black">Total Budget {periodLabel}</span>
                                  <span className="text-lg font-bold text-black">{budgetData.totalBudget.toLocaleString()} tokens</span>
                                </div>
                                
                                {/* Metrics Grid - 2x2 */}
                                <div className="grid grid-cols-4 gap-4">
                                  {/* Tokens Spent */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens Spent</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Tokens used for completed projects. This amount reflects budget already spent.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-black">{budgetData.tokensSpent.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensSpent / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>

                                  {/* Tokens Committed */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens Committed</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Tokens allocated to projects currently in progress. If a project is paused or stopped, unused tokens may be reinstated depending on its stage.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-black">{budgetData.tokensCommitted.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensCommitted / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>

                                  {/* Tokens Remaining */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens Remaining</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Tokens still available in your overall budget that have not yet been used or allocated.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-[#03b3e2]">{budgetData.tokensRemaining.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensRemaining / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>

                                  {/* Tokens Pending */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens Pending</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Estimated token amounts assigned to briefs in progress that are awaiting confirmation or project start.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-black">{budgetData.tokensPending.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensPending / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </TooltipProvider>
                  </div>
                  </div>
                
                {/* View all button for mobile */}
                <button 
                  onClick={() => navigate("/dashboard/tracker")}
                  className="flex sm:hidden items-center justify-center gap-2 px-4 py-2 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition bg-[#ffb546]"
                >
                  <span className="text-sm font-semibold leading-[23.94px] text-black whitespace-nowrap">
                    View all
                  </span>
                  <ArrowRight size={18} className="text-black" />
                </button>
              </div>

            
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}