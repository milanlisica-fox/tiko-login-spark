import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HBAvatar from "@/components/common/HBAvatar";
import { Home, FileText, Folder, BarChart2, Bell, ChevronDown, ArrowRight, Calculator, Coins } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotificationsPopover from "@/components/layout/NotificationsPopover";
import { BRAND } from "@/constants/branding";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;
const dividerImage = BRAND.divider;
const briefsVector1 = "https://www.figma.com/api/mcp/asset/c3d9cf0a-062c-4d11-83eb-cab601f0ed31";
const briefsVector2 = "https://www.figma.com/api/mcp/asset/862d739b-abb1-4a57-a57c-854b7c9d2dce";
const briefsVector3 = "https://www.figma.com/api/mcp/asset/c97bed00-0373-4dd4-9c22-a0b5fd884097";
const projectsVector = "https://www.figma.com/api/mcp/asset/5e2d54d4-2d3d-4c1e-99a9-d369def9bc84";
const createBriefArrowIcon = "https://www.figma.com/api/mcp/asset/33c5c1d3-721c-423d-8e72-cd89fd07637c";

export default function TikoDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // nav items centralized via DashboardLayout

  const active = useMemo(() => {
    if (location.pathname.startsWith("/dashboard/briefs")) return "Briefs";
    if (location.pathname === "/dashboard") return "Central";
    if (location.pathname.startsWith("/dashboard/projects")) return "Projects";
    if (location.pathname.startsWith("/dashboard/tracker")) return "Tracker";
    return "Central";
  }, [location.pathname]);

  const topbarRight = (
    <>
      <NotificationsPopover />
      <div className="flex items-center gap-1">
        <Coins size={20} className="text-[#848487]" />
        <span className="text-xs leading-[15.96px] text-[#646464]">372 Tokens</span>
      </div>
      <button onClick={() => navigate("/dashboard/profile")} className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
        <HBAvatar size={40} />
        <div className="flex flex-col">
          <p className="text-sm font-bold leading-[18.62px] text-[#646464]">Henry Bray</p>
          <p className="text-xs leading-[15.96px] text-[#646464]">Marcomms</p>
        </div>
        <ChevronDown size={24} className="text-[#646464] rotate-90" />
      </button>
    </>
  );

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
      dividerSrc={dividerImage}
      TopbarRight={topbarRight}
    >
      <div className="px-6 pt-[40px] pb-[40px]">
        <div className="space-y-10">
            {/* Header with action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-[32px] font-bold leading-[38.4px] text-black">
                  Welcome back, Henry!
                </h1>
                <p className="text-lg leading-[23.94px] text-black">
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
                <div className="flex-1 bg-[#f9f9f9] rounded-xl px-8 py-6 flex flex-col gap-8 min-w-0">
                  <h3 className="text-lg font-bold leading-[23.94px] text-black">Token summary</h3>
                  
                  <div className="flex flex-col gap-6">
                    {/* Horizontal bars */}
                    <div className="flex items-center h-[87px] gap-0">
                      <div className="h-full bg-[#0177c7] rounded-[12.718px] flex items-center justify-center flex-[0.2672] min-w-[60px]">
                        <span className="text-base font-bold leading-[21.28px] text-white">3,100</span>
                      </div>
                      <div className="h-full bg-[#03b3e2] rounded-[12.718px] flex items-center justify-center flex-[0.1466] min-w-[60px]">
                        <span className="text-base font-bold leading-[21.28px] text-white">1,700</span>
                      </div>
                      <div className="h-full bg-[#00c3b1] rounded-[12.718px] flex items-center justify-center flex-[0.5862] min-w-[60px]">
                        <span className="text-base font-bold leading-[21.28px] text-white">6,800</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-[#0177c7] rounded-[2.5px]" />
                          <span className="text-xs leading-[15.96px] text-black">Spent</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-[#03b3e2] rounded-[2.5px]" />
                          <span className="text-xs leading-[15.96px] text-black">Commited</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-[#00c3b1] rounded-[2.5px]" />
                          <span className="text-xs leading-[15.96px] text-black">Remaining</span>
                        </div>
                      </div>
                      <p className="text-xs leading-[15.96px] text-black">
                        Total: 11,600 tokens
                      </p>
                    </div>
                  </div>
                </div>

                {/* Brief Quality Score */}
                <div className="flex-1 bg-[#f9f9f9] rounded-xl px-8 py-6 flex flex-col gap-8 min-w-0">
                  <h3 className="text-lg font-bold leading-[23.94px] text-black">Brief quality score</h3>
                  
                  <div className="flex flex-col gap-6">
                    {/* Horizontal bars */}
                    <div className="flex items-center h-[87px] gap-0">
                      <div className="h-full bg-[#0177c7] rounded-[12.718px] flex items-center justify-center flex-[0.3152] min-w-[40px]">
                        <span className="text-base font-bold leading-[21.28px] text-white">52</span>
                      </div>
                      <div className="h-full bg-[#03b3e2] rounded-[12.718px] flex items-center justify-center flex-[0.4061] min-w-[40px]">
                        <span className="text-base font-bold leading-[21.28px] text-white">67</span>
                      </div>
                      <div className="h-full bg-[#8092dc] rounded-[12.718px] flex items-center justify-center flex-[0.1879] min-w-[40px]">
                        <span className="text-base font-bold leading-[21.28px] text-white">31</span>
                      </div>
                      <div className="h-full bg-[#00c3b1] rounded-[12.718px] flex items-center justify-center flex-[0.0909] min-w-[40px]">
                        <span className="text-base font-bold leading-[21.28px] text-white">15</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-[#0177c7] rounded-[2.5px]" />
                          <span className="text-xs leading-[15.96px] text-black">Excellent</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-[#03b3e2] rounded-[2.5px]" />
                          <span className="text-xs leading-[15.96px] text-black">Good</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-[#8092dc] rounded-[2.5px]" />
                          <span className="text-xs leading-[15.96px] text-black">Needs improvement</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 bg-[#00c3b1] rounded-[2.5px]" />
                          <span className="text-xs leading-[15.96px] text-black">Poor</span>
                        </div>
                      </div>
                      <p className="text-xs leading-[15.96px] text-black">
                        Total: 165 briefs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
