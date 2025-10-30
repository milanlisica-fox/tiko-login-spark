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
      <div className="px-6 pt-[40px] pb-[40px]">
        <div className="space-y-10">
            {/* Header with action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-h1 text-black">
                  Welcome back, Henry!
                </h1>
                <p className="text-body text-black">
                  Create briefs, track progress, and keep momentum flowing.
                </p>
              </div>

              <div className="flex gap-2.5 items-center">
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
                  className="w-[216px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
                >
                  <Calculator size={16} className="text-black" />
                  <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
                    Quick calculator
                  </span>
                </button>
                <button 
                  onClick={() => navigate("/dashboard/briefs", { state: { createBrief: true } })}
                  className="w-[216px] backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] py-[18px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
                >
                  <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">
                    Create brief
                  </span>
                  <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
                </button>
              </div>
            </div>

            {/* Briefs and Projects Row */}
            <div className="flex gap-5">
              {/* Briefs Section */}
              <div className="flex-[0.7] bg-white rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between pb-1">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Briefs</h2>
                    <p className="text-sm leading-[18.62px] text-black">
                      Kickstart your next project with clarity and ease
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard/briefs")}
                    className="flex items-center gap-2 px-2 py-1 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition"
                  >
                    <span className="text-xs font-semibold leading-[23.94px] text-[#848487]">
                      View all briefs
                    </span>
                    <ArrowRight size={16} className="text-[#848487]" />
                  </button>
                </div>

                <div className="flex gap-4">
                  {/* Draft briefs */}
                  <div className="flex-[1_0_0] bg-[#f9f9f9] rounded-[12px] p-[20px] flex flex-col gap-[10px] relative overflow-clip">
                    <p className="text-sm font-bold leading-[18.62px] text-black">Draft briefs</p>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">5</p>
                    <img src={briefsVector1} alt="" className="absolute right-[-20px] top-[20px] w-[45px] h-10" />
                  </div>

                  {/* In review */}
                  <div className="flex-[1_0_0] bg-[#f9f9f9] rounded-[12px] p-[20px] flex flex-col gap-[10px] relative overflow-clip">
                    <p className="text-sm font-bold leading-[18.62px] text-black">In review</p>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">4</p>
                    <img src={briefsVector2} alt="" className="absolute right-[-20px] top-[20px] w-[45px] h-10" />
                  </div>

                  {/* SOW Ready to sign */}
                  <div className="flex-[1_0_0] bg-[#f9f9f9] rounded-[12px] p-[20px] flex flex-col gap-[10px] relative overflow-clip">
                    <p className="text-sm font-bold leading-[18.62px] text-black">SOW Ready to sign</p>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">3</p>
                    <img src={briefsVector3} alt="" className="absolute right-[-20px] top-[20px] w-[45px] h-10" />
                  </div>
                </div>
              </div>

              {/* Projects Section */}
              <div className="flex-[0.3] bg-white rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between pb-1">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Projects</h2>
                    <p className="text-sm leading-[18.62px] text-black">
                      Never miss a thing, keep things moving
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard/projects")}
                    className="flex items-center gap-2 px-2 py-1 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition"
                  >
                    <span className="text-xs font-semibold leading-[23.94px] text-[#848487]">
                      View all projects
                    </span>
                    <ArrowRight size={16} className="text-[#848487]" />
                  </button>
                </div>

                <div className="bg-[#f9f9f9] rounded-xl p-5 flex flex-col gap-2.5 relative overflow-hidden">
                  <p className="text-sm font-bold leading-[18.62px] text-black">In progress</p>
                  <p className="text-[40px] font-medium leading-[45.6px] text-black">10</p>
                  <img src={projectsVector} alt="" className="absolute right-[-46px] top-[-36px] w-[212px] h-[189px]" />
                </div>
              </div>
            </div>

            {/* Tracker Section */}
            <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between pb-1">
                <div className="flex flex-col gap-1">
                  <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Tracker</h2>
                  <p className="text-sm leading-[18.62px] text-black">
                    Get the full picture of your team's performance
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/dashboard/tracker")}
                  className="flex items-center gap-2 px-2 py-1 rounded-[28px] backdrop-blur-sm hover:bg-gray-50 transition"
                >
                  <span className="text-xs font-semibold leading-[23.94px] text-[#848487]">
                    View all insights
                  </span>
                  <ArrowRight size={16} className="text-[#848487]" />
                </button>
              </div>

              <div className="flex gap-4">
                {/* Token Summary */}
                <div className="flex-1 bg-[#f9f9f9] rounded-xl px-8 py-6">
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
                <div className="flex-1 bg-[#f9f9f9] rounded-xl px-8 py-6">
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
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
