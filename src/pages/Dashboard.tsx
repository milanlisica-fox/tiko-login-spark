import { useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, Bell, ChevronDown, ArrowRight, Calculator, Coins } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import HorizontalBarChart from "@/components/common/HorizontalBarChart";
import { BRAND } from "@/constants/branding";
import { DASHBOARD_ASSETS } from "@/constants/dashboard-assets";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;
const briefsVector1 = DASHBOARD_ASSETS.briefsVector1;
const briefsVector2 = DASHBOARD_ASSETS.briefsVector2;
const briefsVector3 = DASHBOARD_ASSETS.briefsVector3;
const projectsVector = DASHBOARD_ASSETS.projectsVector;
const createBriefArrowIcon = DASHBOARD_ASSETS.createBriefArrowIcon;

export default function TikoDashboard() {
  const navigate = useNavigate();

  // nav items centralized via DashboardLayout
  const { activeName: active } = useActiveNav();

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
              <h1 className="h1-heading text-2xl md:text-h1 text-black">
                Welcome back, <span className="text-[#00C3B1]">Henry!</span>
              </h1>
              <p className="text-sm md:text-body text-black">
                Create briefs, track progress, and keep momentum flowing.
              </p>
            </div>

            {/* Briefs Section */}
            <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-[22px] font-bold leading-[29.26px] text-[#03b3e2]">Briefs</h2>
                <p className="text-sm leading-[18.62px] text-black">
                  Kickstart your next project with clarity and ease
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Cards Section - 75% on desktop */}
                <div className="flex-1 lg:flex-[3] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Draft briefs */}
                  <div className="flex-1 bg-[#f9f9f9] rounded-[12px] p-4 md:p-[20px] flex flex-col gap-[10px] relative overflow-clip">
                    <p className="text-xs md:text-sm font-bold leading-[18.62px] text-black">Draft briefs</p>
                    <p className="text-2xl md:text-[40px] font-medium leading-[45.6px] text-black">5</p>
                    <img src={briefsVector1} alt="" className="absolute right-[-10px] md:right-[-20px] top-[10px] md:top-[20px] w-6 h-6 md:w-[45px] md:h-10" />
                  </div>

                  {/* In review */}
                  <div className="flex-1 bg-[#f9f9f9] rounded-[12px] p-4 md:p-[20px] flex flex-col gap-[10px] relative overflow-clip">
                    <p className="text-xs md:text-sm font-bold leading-[18.62px] text-black">In review</p>
                    <p className="text-2xl md:text-[40px] font-medium leading-[45.6px] text-black">4</p>
                    <img src={briefsVector2} alt="" className="absolute right-[-10px] md:right-[-20px] top-[10px] md:top-[20px] w-6 h-6 md:w-[45px] md:h-10" />
                  </div>

                  {/* SOW Ready to sign */}
                  <button
                    onClick={() => navigate("/dashboard/sow")}
                    className="card-item flex-1 bg-[#f9f9f9] rounded-[12px] p-4 md:p-[20px] flex flex-col gap-[10px] relative overflow-clip hover:bg-[#f0f0f0] transition cursor-pointer text-left"
                  >
                    <p className="text-xs md:text-sm font-bold leading-[18.62px] text-black">SOW Ready to sign</p>
                    <p className="text-2xl md:text-[40px] font-medium leading-[45.6px] text-black">3</p>
                    <img src={briefsVector3} alt="" className="absolute right-[-10px] md:right-[-20px] top-[10px] md:top-[20px] w-6 h-6 md:w-[45px] md:h-10" />
                  </button>
                </div>

                {/* Buttons Section - 25% on desktop */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:w-[25%]">
                  <button 
                    onClick={() => navigate("/dashboard/briefs", { state: { createBrief: true } })}
                    className="btn w-full sm:flex-1 lg:flex-none h-[48px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
                  >
                    <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      Create brief
                    </span>
                    <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
                  </button>
                  <button
                    onClick={async (e) => {
                      const button = e.currentTarget;

                      // Add bounce animation with brand color
                      button.classList.add("animate-bounce-once", "bg-[#03b3e2]");

                      // Wait for animation to complete (~600ms)
                      await new Promise((resolve) => setTimeout(resolve, 600));

                      // Remove the animation so it resets next time
                      button.classList.remove("animate-bounce-once", "bg-[#03b3e2]");

                      // Navigate after animation
                      navigate("/dashboard/calculator");
                    }}
                    className="btn w-full sm:flex-1 lg:flex-none h-[48px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
                  >
                    <Calculator size={16} className="text-black" />
                    <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      Quick calculator
                    </span>
                  </button>
                  <button 
                    onClick={() => navigate("/dashboard/briefs")}
                    className="btn w-full sm:flex-1 lg:flex-none h-[48px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
                  >
                    <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      View all
                    </span>
                    <ArrowRight size={16} className="text-black" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tracker Section */}
            <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 pb-1">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg md:text-[22px] font-bold leading-[29.26px] text-[#03b3e2]">Tracker</h2>
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

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Token Summary */}
                <div className="flex-1 bg-[#f9f9f9] rounded-xl px-4 md:px-8 py-4 md:py-6">
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
                </div>

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

            {/* Projects Section */}
            <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 pb-1">
                <div className="flex flex-col gap-1">
                  <h2 className="text-[22px] font-bold leading-[29.26px] text-[#03b3e2]">Projects</h2>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Complete */}
                <div className="board-card board-b bg-[#f9f9f9] rounded-xl p-5 flex flex-col gap-2.5 relative overflow-clip">
                  <p className="text-sm font-bold leading-[18.62px] text-black">Complete</p>
                  <p className="text-[40px] font-medium leading-[45.6px] text-black">3</p>
                  <img 
                    src={projectsVector} 
                    alt="" 
                    className="absolute right-[-35px] sm:right-[-38px] md:right-[-80px] top-[-33px] sm:top-[-34px] md:top-[-36px] w-[150px] h-[185px] sm:w-[175px] sm:h-[190px] md:w-[212px] md:h-[189px]"
                    style={{ filter: 'brightness(0) saturate(100%) invert(67%) sepia(89%) saturate(2146%) hue-rotate(169deg) brightness(98%) contrast(101%)' }}
                  />
                </div>
                {/* In progress */}
                <div className="board-card board-c bg-[#f9f9f9] rounded-xl p-5 flex flex-col gap-2.5 relative overflow-clip">
                  <p className="text-sm font-bold leading-[18.62px] text-black">In progress</p>
                  <p className="text-[40px] font-medium leading-[45.6px] text-black">9</p>
                  <img src={projectsVector} alt="" className="absolute right-[-35px] sm:right-[-38px] md:right-[-80px] top-[-33px] sm:top-[-34px] md:top-[-36px] w-[150px] h-[185px] sm:w-[175px] sm:h-[190px] md:w-[212px] md:h-[189px]" />
                </div>
                {/* For review */}
                <div className="board-card board-o bg-[#f9f9f9] rounded-xl p-5 flex flex-col gap-2.5 relative overflow-clip">
                  <p className="text-sm font-bold leading-[18.62px] text-black">For review</p>
                  <p className="text-[40px] font-medium leading-[45.6px] text-black">4</p>
                  <img 
                    src={projectsVector} 
                    alt="" 
                    className="absolute right-[-35px] sm:right-[-38px] md:right-[-80px] top-[-33px] sm:top-[-34px] md:top-[-36px] w-[150px] h-[185px] sm:w-[175px] sm:h-[190px] md:w-[212px] md:h-[189px]"
                    style={{ filter: 'brightness(0) saturate(100%) invert(71%) sepia(95%) saturate(1352%) hue-rotate(329deg) brightness(102%) contrast(96%)' }}
                  />
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
        </div>
      </div>
    </DashboardLayout>
  );
}
