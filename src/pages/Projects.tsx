import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HBAvatar from "@/components/common/HBAvatar";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotificationsPopover from "@/components/layout/NotificationsPopover";
import { BRAND } from "@/constants/branding";
import { getPriorityColor, getProgressBarColor } from "@/lib/utils";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

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

  // nav items centralized via DashboardLayout

  const activeName = useMemo(() => {
    if (location.pathname.startsWith("/dashboard/briefs")) return "Briefs";
    if (location.pathname === "/dashboard") return "Central";
    if (location.pathname.startsWith("/dashboard/projects")) return "Projects";
    if (location.pathname.startsWith("/dashboard/tracker")) return "Tracker";
    return "Central";
  }, [location.pathname]);

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
      <Folder size={20} className="text-black" />
      <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
    </div>
  );

  return (
    <DashboardLayout
      title={titleNode}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="pt-[40px] pb-[40px]">
        <div className="w-[90%] mx-auto space-y-[30px]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[32px] font-bold leading-[38.4px] text-black">Work at a glance</h1>
              <p className="text-base leading-[24px] text-black">A clear view of your team's active projects and priorities.</p>
            </div>
            <Button variant="outline" className="h-10 px-6 border border-[#d9d9d9] bg-white hover:bg-gray-50 gap-2">
              <span className="text-sm font-normal leading-[24px] text-black">See all projects</span>
              <ArrowRight size={20} className="text-black" />
            </Button>
          </div>

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

          <div className="bg-white rounded-xl overflow-hidden">
            <div className="p-[16px] space-y-0">
              {projects.map((project, index) => (
                <div key={project.id}>
                  <div className="flex items-center py-[12px] px-[8px] gap-4">
                    <div className="flex items-center gap-2 w-[35%]">
                      <div className="flex flex-col gap-[4px]">
                        <p className={`text-sm leading-[19px] text-black ${project.hasWarning ? "font-bold" : "font-normal"}`}>{project.name}</p>
                        <p className="text-xs leading-[16px] text-[#646464]">{project.team}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-[5%]">
                      {project.hasWarning && (
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <AlertTriangle size={16} className="text-amber-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2 w-[20%]">
                      <div className="flex -space-x-2">
                        {project.owners.map((owner, idx) => {
                          const seed = `${owner}_${project.id}_${idx}`;
                          return (
                            <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                              <AvatarImage src={`https://api.dicebear.com/7.x/personas/png?seed=${seed}&size=64`} alt={owner} />
                              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-200 to-blue-300">{owner}</AvatarFallback>
                            </Avatar>
                          );
                        })}
                      </div>
                    </div>
                    <div className="w-[10%]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getPriorityColor(project.priority) }} />
                        <span className="text-xs font-normal" style={{ color: getPriorityColor(project.priority) }}>{project.priority}</span>
                      </div>
                    </div>
                    <div className="w-[30%]">
                      <div className="flex items-center gap-2">
                        <div className="relative h-2 flex-1 bg-[#f1f1f3] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, backgroundColor: getProgressBarColor(project.progress) }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < projects.length - 1 && <div className="h-px bg-[#ececec] mx-[16px]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

