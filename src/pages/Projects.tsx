import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND } from "@/constants/branding";
import { getPriorityColor, getProgressBarColor } from "@/lib/utils";
import { Icons } from "@/constants/icons";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

interface Project {
  id: number;
  name: string;
  team: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  owners: string[];
  notifications?: number;
  dueDate?: string;
}

export default function ProjectsPage() {
  const navigate = useNavigate();

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  // Mock project data based on Figma design
  const projects: Project[] = [
    {
      id: 1,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 34,
      priority: "High",
      owners: ["AB", "CD"],
      dueDate: "Dec 12, 2025",
    },
    {
      id: 2,
      name: "Watch Radio Campaign Q3 2025",
      team: "Digital team",
      progress: 31,
      priority: "High",
      owners: ["EF", "GH"],
      notifications: 2,
      dueDate: "Jan 05, 2026",
    },
    {
      id: 3,
      name: "S Series OOH Campaign Q2 2025",
      team: "Marcomms",
      progress: 100,
      priority: "Low",
      owners: ["IJ", "KL", "MN"],
      dueDate: "Dec 22, 2025",
    },
    {
      id: 4,
      name: "A Series Promotional Campaign Q3 2025",
      team: "Marcomms",
      progress: 84,
      priority: "High",
      owners: ["OP", "QR", "ST"],
      dueDate: "Jan 15, 2026",
    },
    {
      id: 5,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 38,
      priority: "Medium",
      owners: ["UV", "WX"],
      dueDate: "Dec 18, 2025",
    },
    {
      id: 6,
      name: "S Series OOH Campaign Q2 2025",
      team: "Marcomms",
      progress: 100,
      priority: "Low",
      owners: ["YZ", "AA", "BB"],
      notifications: 1,
      dueDate: "Dec 29, 2025",
    },
    {
      id: 7,
      name: "A Series Promotional Campaign Q3 2025",
      team: "Marcomms",
      progress: 84,
      priority: "High",
      owners: ["CC", "DD"],
      dueDate: "Jan 20, 2026",
    },
    {
      id: 8,
      name: "Watch Radio Campaign Q3 2025",
      team: "Digital team",
      progress: 31,
      priority: "High",
      owners: ["EE", "FF"],
      notifications: 3,
      dueDate: "Dec 15, 2025",
    },
    {
      id: 9,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 38,
      priority: "Medium",
      owners: ["GG"],
      dueDate: "Dec 20, 2025",
    },
    {
      id: 10,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 34,
      priority: "High",
      owners: ["HH", "II"],
      dueDate: "Jan 08, 2026",
    },
    {
      id: 11,
      name: "S Series OOH Campaign Q2 2025",
      team: "Marcomms",
      progress: 100,
      priority: "Low",
      owners: ["JJ", "KK", "LL"],
      dueDate: "Dec 24, 2025",
    },
    {
      id: 12,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 38,
      priority: "Medium",
      owners: ["MM"],
      dueDate: "Jan 02, 2026",
    },
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const complete = projects.filter((p) => p.progress === 100).length;
    const inProgress = projects.filter((p) => p.progress > 0 && p.progress < 100).length;
    const forReview = projects.filter((p) => p.priority === "High" && p.progress < 50).length;
    return { complete, inProgress, forReview };
  }, [projects]);

  const topbarRight = <DashboardTopbarRight />;

  const titleNode = (
    <div className="flex items-center gap-2">
      <Icons.projects size={20} className="text-black" />
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
      <div className="px-4 md:px-6 pt-[24px] md:pt-[40px] pb-[24px] md:pb-[40px]">
        <div className="space-y-6 md:space-y-[30px]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="h1-heading text-2xl md:text-h1 text-black">Work at a glance</h1>
              <p className="text-sm md:text-base leading-[24px] text-black">A clear view of your team's active projects and priorities.</p>
            </div>
            <Button variant="outline" className="h-10 px-6 border-none bg-[#ffb546] hover:opacity-90 gap-2">
              <span className="text-sm font-semibold leading-[24px] text-black">View all</span>
              <ArrowRight size={20} className="text-black" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <button
              type="button"
              onClick={() => navigate("/dashboard/tracker?tab=project-performance")}
              className="bg-white rounded-[60px] h-[118px] p-[40px] flex flex-col justify-center text-center md:text-center lg:text-left transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-[24px]">
                <h3 className="text-base leading-[24px] text-black font-normal">Complete</h3>
                <p className="text-[46px] leading-[46px] font-medium text-black">{stats.complete}</p>
              </div>
            </button>
            <div className="bg-white rounded-[60px] h-[118px] p-[40px] flex flex-col justify-center text-center md:text-center lg:text-left">
              <div className="flex flex-col gap-[24px]">
                <h3 className="text-base leading-[24px] text-black font-normal">In progress</h3>
                <p className="text-[46px] leading-[46px] font-medium text-black">{stats.inProgress}</p>
              </div>
            </div>
            <div className="bg-white rounded-[60px] h-[118px] p-[40px] flex flex-col justify-center text-center md:text-center lg:text-left">
              <div className="flex flex-col gap-[24px]">
                <h3 className="text-base leading-[24px] text-black font-normal">For review</h3>
                <p className="text-[46px] leading-[46px] font-medium text-black">{stats.forReview}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[600px] p-[16px] space-y-0">
                {projects.map((project, index) => (
                  <div key={project.id}>
                    <div className="flex items-center py-[12px] px-[8px] gap-4">
                      <div className="flex items-center gap-2 w-[35%]">
                        <div className="flex flex-col gap-[4px]">
                          <p className={`text-sm leading-[19px] text-black ${project.notifications ? "font-bold" : "font-normal"}`}>{project.name}</p>
                          <p className="text-xs leading-[16px] text-[#646464]">{project.team}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-[5%]">
                        {project.notifications && project.notifications > 0 && (
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-600">
                            {project.notifications}
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
                      <div className="w-[20%]">
                        <div className="flex items-center gap-2">
                          <div className="relative h-2 flex-1 bg-[#f1f1f3] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, backgroundColor: getProgressBarColor(project.progress) }} />
                          </div>
                        </div>
                      </div>
                      <div className="w-[10%]">
                        <span className="text-xs text-black font-medium flex justify-center">{project.dueDate}</span>
                      </div>
                    </div>
                    {index < projects.length - 1 && <div className="h-px bg-[#ececec] mx-[16px]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

