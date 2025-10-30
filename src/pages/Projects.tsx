import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HBAvatar from "@/components/common/HBAvatar";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Figma image URLs
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

interface Project {
  id: number;
  name: string;
  team: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  hasWarning?: boolean;
  owners: string[];
}

export default function ProjectsPage() {
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

  // Mock project data based on Figma design
  const projects: Project[] = [
    {
      id: 1,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 34,
      priority: "High",
      owners: ["AB", "CD"],
    },
    {
      id: 2,
      name: "Watch Radio Campaign Q3 2025",
      team: "Digital team",
      progress: 31,
      priority: "High",
      hasWarning: true,
      owners: ["EF", "GH"],
    },
    {
      id: 3,
      name: "S Series OOH Campaign Q2 2025",
      team: "Marcomms",
      progress: 100,
      priority: "Low",
      owners: ["IJ", "KL", "MN"],
    },
    {
      id: 4,
      name: "A Series Promotional Campaign Q3 2025",
      team: "Marcomms",
      progress: 84,
      priority: "High",
      owners: ["OP", "QR", "ST"],
    },
    {
      id: 5,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 38,
      priority: "Medium",
      owners: ["UV", "WX"],
    },
    {
      id: 6,
      name: "S Series OOH Campaign Q2 2025",
      team: "Marcomms",
      progress: 100,
      priority: "Low",
      hasWarning: true,
      owners: ["YZ", "AA", "BB"],
    },
    {
      id: 7,
      name: "A Series Promotional Campaign Q3 2025",
      team: "Marcomms",
      progress: 84,
      priority: "High",
      owners: ["CC", "DD"],
    },
    {
      id: 8,
      name: "Watch Radio Campaign Q3 2025",
      team: "Digital team",
      progress: 31,
      priority: "High",
      owners: ["EE", "FF"],
    },
    {
      id: 9,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 38,
      priority: "Medium",
      owners: ["GG"],
    },
    {
      id: 10,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 34,
      priority: "High",
      owners: ["HH", "II"],
    },
    {
      id: 11,
      name: "S Series OOH Campaign Q2 2025",
      team: "Marcomms",
      progress: 100,
      priority: "Low",
      owners: ["JJ", "KK", "LL"],
    },
    {
      id: 12,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 38,
      priority: "Medium",
      owners: ["MM"],
    },
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const complete = projects.filter((p) => p.progress === 100).length;
    const inProgress = projects.filter((p) => p.progress > 0 && p.progress < 100).length;
    const forReview = projects.filter((p) => p.priority === "High" && p.progress < 50).length;
    return { complete, inProgress, forReview };
  }, []);

  const getPriorityColor = (priority: Project["priority"]) => {
    switch (priority) {
      case "High":
        return "#FF4337"; // Red for high priority
      case "Medium":
        return "#8092DC"; // Purple/blue for medium priority
      case "Low":
        return "#0177C7"; // Blue for low priority
      default:
        return "#0177C7";
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress < 33) {
      return "#FF4337"; // Red for low progress
    } else if (progress >= 33 && progress <= 70) {
      return "#FFB546"; // Amber/orange for medium progress
    } else {
      return "#00C3B1"; // Teal/green for high progress
    }
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
            <span className="text-sm leading-[19.6px] font-normal text-black">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-4 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-4 py-4 rounded-lg">
            <Folder size={20} className="text-black" />
            <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
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

        {/* Projects Content */}
        <section className="flex-1 overflow-y-auto pt-[40px] pb-[40px]">
          <div className="w-[90%] mx-auto space-y-[30px]">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-[32px] font-bold leading-[38.4px] text-black">Work at a glance</h1>
                <p className="text-base leading-[24px] text-black">
                  A clear view of your team's active projects and priorities.
                </p>
              </div>
              <Button
                variant="outline"
                className="h-10 px-6 border border-[#d9d9d9] bg-white hover:bg-gray-50 gap-2"
              >
                <span className="text-sm font-normal leading-[24px] text-black">See all projects</span>
                <ArrowRight size={20} className="text-black" />
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="bg-white rounded-[60px] h-[118px] p-[40px] flex flex-col justify-center">
                <div className="flex flex-col gap-[24px]">
                  <h3 className="text-base leading-[24px] text-black font-normal">Complete</h3>
                  <p className="text-[46px] leading-[46px] font-medium text-black">{stats.complete}</p>
                </div>
              </div>
              <div className="bg-white rounded-[60px] h-[118px] p-[40px] flex flex-col justify-center">
                <div className="flex flex-col gap-[24px]">
                  <h3 className="text-base leading-[24px] text-black font-normal">In progress</h3>
                  <p className="text-[46px] leading-[46px] font-medium text-black">{stats.inProgress}</p>
                </div>
              </div>
              <div className="bg-white rounded-[60px] h-[118px] p-[40px] flex flex-col justify-center">
                <div className="flex flex-col gap-[24px]">
                  <h3 className="text-base leading-[24px] text-black font-normal">For review</h3>
                  <p className="text-[46px] leading-[46px] font-medium text-black">{stats.forReview}</p>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="p-[16px] space-y-0">
                {projects.map((project, index) => (
                  <div key={project.id}>
                    <div className="flex items-center py-[12px] px-[8px] gap-4">
                      {/* Project Name - 35% */}
                      <div className="flex items-center gap-2 w-[35%]">
                        <div className="flex flex-col gap-[4px]">
                          <p className={`text-sm leading-[19px] text-black ${project.hasWarning ? "font-bold" : "font-normal"}`}>
                            {project.name}
                          </p>
                          <p className="text-xs leading-[16px] text-[#646464]">{project.team}</p>
                        </div>
                      </div>

                      {/* Sign - Exclamation point in circle - 5% */}
                      <div className="flex items-center justify-center w-[5%]">
                        {project.hasWarning && (
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertTriangle size={16} className="text-amber-600" />
                          </div>
                        )}
                      </div>

                      {/* Owners - 20% */}
                      <div className="flex items-center justify-center gap-2 w-[20%]">
                        <div className="flex -space-x-2">
                          {project.owners.map((owner, idx) => {
                            // Generate a unique seed for each avatar based on owner and project
                            const seed = `${owner}_${project.id}_${idx}`;
                            return (
                              <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                                <AvatarImage 
                                  src={`https://api.dicebear.com/7.x/personas/png?seed=${seed}&size=64`} 
                                  alt={owner}
                                />
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-200 to-blue-300">
                                  {owner}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                        </div>
                      </div>

                      {/* Priority/Status - 10% */}
                      <div className="w-[10%]">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: getPriorityColor(project.priority) }}
                          />
                          <span 
                            className="text-xs font-normal"
                            style={{ color: getPriorityColor(project.priority) }}
                          >
                            {project.priority}
                          </span>
                        </div>
                      </div>

                      {/* Timeline/Progress - 30% */}
                      <div className="w-[30%]">
                        <div className="flex items-center gap-2">
                          <div className="relative h-2 flex-1 bg-[#f1f1f3] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${project.progress}%`,
                                backgroundColor: getProgressBarColor(project.progress)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < projects.length - 1 && (
                      <div className="h-px bg-[#ececec] mx-[16px]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

