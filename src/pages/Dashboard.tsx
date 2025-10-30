import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HBAvatar from "@/components/common/HBAvatar";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Calculator, Coins } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Figma image URLs
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";
const briefsVector1 = "https://www.figma.com/api/mcp/asset/c3d9cf0a-062c-4d11-83eb-cab601f0ed31";
const briefsVector2 = "https://www.figma.com/api/mcp/asset/862d739b-abb1-4a57-a57c-854b7c9d2dce";
const briefsVector3 = "https://www.figma.com/api/mcp/asset/c97bed00-0373-4dd4-9c22-a0b5fd884097";
const projectsVector = "https://www.figma.com/api/mcp/asset/5e2d54d4-2d3d-4c1e-99a9-d369def9bc84";
const createBriefArrowIcon = "https://www.figma.com/api/mcp/asset/33c5c1d3-721c-423d-8e72-cd89fd07637c";

export default function TikoDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { name: "Central", icon: Home, path: "/dashboard" },
      { name: "Briefs", icon: FileText, path: "/dashboard/briefs" },
      { name: "Projects", icon: Folder, path: "/dashboard/projects" },
      { name: "Tracker", icon: BarChart2, path: "/dashboard/tracker" },
    ],
    []
  );

  const active = useMemo(() => {
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
              const isActive = active === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
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
            <Home size={20} className="text-black" />
            <span className="text-sm leading-[19.6px] text-black">{active}</span>
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

        {/* Dashboard Content */}
        <section className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
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

                    // Add orange color + bounce animation
                    button.classList.add("animate-bounce-once", "bg-[#ffb546]");

                    // Wait for animation to complete (~600ms)
                    await new Promise((resolve) => setTimeout(resolve, 600));

                    // Remove the animation so it resets next time
                    button.classList.remove("animate-bounce-once", "bg-[#ffb546]");

                    // Navigate after animation
                    navigate("/dashboard/calculator");
                  }}
                  className="w-[216px] bg-[#f1f1f3] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:bg-[#e5e5e5] transition"
                >
                  <Calculator size={16} />
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
        </section>
      </main>
    </div>
  );
}
