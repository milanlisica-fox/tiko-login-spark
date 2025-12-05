import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

interface NotificationAction {
  id: number;
  message: string;
}

interface Project {
  id: number;
  name: string;
  team: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  owners: string[];
  notifications?: number;
  notificationActions?: NotificationAction[];
  hasProjectNotification?: boolean;
  dueDate?: string;
}

type SortField = "name" | "rag" | "progress" | "dueDate" | null;
type SortDirection = "asc" | "desc" | null;

// Helper function to get RAG color (red, amber, green)
function getRAGColor(priority: "High" | "Medium" | "Low"): string {
  switch (priority) {
    case "High":
      return "#FF4337"; // red
    case "Medium":
      return "#FFB546"; // amber
    case "Low":
      return "#00C3B1"; // green
    default:
      return "#00C3B1";
  }
}

// Helper function to get RAG sort value (for sorting: High=3, Medium=2, Low=1)
function getRAGSortValue(priority: "High" | "Medium" | "Low"): number {
  switch (priority) {
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
    default:
      return 1;
  }
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  // Mock project data based on Figma design
  const projectsData: Project[] = [
    {
      id: 1,
      name: "Fold Toolkit Q3 2025",
      team: "Digital team",
      progress: 34,
      priority: "High",
      owners: ["AB", "CD"],
      dueDate: "Dec 12, 2025",
      hasProjectNotification: true,
    },
    {
      id: 2,
      name: "Watch Radio Campaign Q3 2025",
      team: "Digital team",
      progress: 31,
      priority: "High",
      owners: ["EF", "GH"],
      notifications: 2,
      notificationActions: [
        { id: 1, message: "Assets ready for client review" },
        { id: 2, message: "Assets uploaded to SMC" },
      ],
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
      hasProjectNotification: true,
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
      notificationActions: [
        { id: 1, message: "Assets ready for client review" },
      ],
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
      notificationActions: [
        { id: 1, message: "Assets ready for client review" },
        { id: 2, message: "Assets uploaded to SMC" },
        { id: 3, message: "Review feedback received" },
      ],
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
      hasProjectNotification: true,
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

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort projects
  const projects = useMemo(() => {
    if (!sortField || !sortDirection) return projectsData;

    const sorted = [...projectsData].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "rag":
          aValue = getRAGSortValue(a.priority);
          bValue = getRAGSortValue(b.priority);
          break;
        case "progress":
          aValue = a.progress;
          bValue = b.progress;
          break;
        case "dueDate":
          aValue = new Date(a.dueDate || "").getTime();
          bValue = new Date(b.dueDate || "").getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [projectsData, sortField, sortDirection]);

  // Calculate stats
  const stats = useMemo(() => {
    const complete = projectsData.filter((p) => p.progress === 100).length;
    const inProgress = projectsData.filter((p) => p.progress > 0 && p.progress < 100).length;
    const forReview = projectsData.filter((p) => p.priority === "High" && p.progress < 50).length;
    return { complete, inProgress, forReview };
  }, [projectsData]);

  // Get sort icon for column headers
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-[#646464]" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="text-black" />
    ) : (
      <ArrowDown size={14} className="text-black" />
    );
  };

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
              <p className="text-sm md:text-base leading-[24px] text-black">A clear view of your team's active projects and priorities</p>
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
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-[800px] p-[16px] space-y-0">
                <div className="grid grid-cols-[minmax(200px,35%)_minmax(40px,5%)_minmax(120px,20%)_minmax(60px,10%)_minmax(140px,20%)_minmax(100px,10%)] items-center py-[12px] px-[8px] gap-4 text-xs font-semibold uppercase text-[#646464] tracking-wide">
                  <div className="col-span-2 text-center">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center justify-center gap-1 hover:text-black transition-colors"
                    >
                      Projects
                      {getSortIcon("name")}
                    </button>
                  </div>
                  <div className="text-center">Members</div>
                  <div className="text-center">
                    <button
                      onClick={() => handleSort("rag")}
                      className="flex items-center justify-center gap-1 hover:text-black transition-colors mx-auto"
                    >
                      RAG
                      {getSortIcon("rag")}
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => handleSort("progress")}
                      className="flex items-center justify-center gap-1 hover:text-black transition-colors mx-auto"
                    >
                      Progress
                      {getSortIcon("progress")}
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => handleSort("dueDate")}
                      className="flex items-center justify-center gap-1 hover:text-black transition-colors mx-auto"
                    >
                      Delivery date
                      {getSortIcon("dueDate")}
                    </button>
                  </div>
                </div>
                {projects.map((project, index) => (
                  <div key={project.id}>
                    <div className="grid grid-cols-[minmax(200px,35%)_minmax(40px,5%)_minmax(120px,20%)_minmax(60px,10%)_minmax(140px,20%)_minmax(100px,10%)] items-center py-[12px] px-[8px] gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-[4px]">
                          <p className={`text-sm leading-[19px] text-black ${project.notifications || project.hasProjectNotification ? "font-bold" : "font-normal"}`}>{project.name}</p>
                          <p className="text-xs leading-[16px] text-[#646464]">{project.team}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        {((project.notifications && project.notifications > 0) || project.hasProjectNotification) && (() => {
                          // Calculate notification count
                          const notificationCount = project.notifications || (project.hasProjectNotification ? 1 : 0);
                          
                          // Get actions or create default ones to match the count
                          let actions = project.notificationActions || [];
                          
                          // If no actions but hasProjectNotification, create default actions
                          if (project.hasProjectNotification && actions.length === 0) {
                            actions = Array.from({ length: notificationCount }, (_, i) => ({
                              id: i + 1,
                              message: "Action required"
                            }));
                          }
                          
                          // Ensure actions array length matches notification count
                          // If actions are fewer than count, pad with defaults
                          // If actions are more than count, limit to count
                          if (actions.length < notificationCount) {
                            const additionalActions = Array.from({ length: notificationCount - actions.length }, (_, i) => ({
                              id: actions.length + i + 1,
                              message: "Action required"
                            }));
                            actions = [...actions, ...additionalActions];
                          } else if (actions.length > notificationCount) {
                            actions = actions.slice(0, notificationCount);
                          }
                          
                          return (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center hover:bg-amber-200 transition-colors cursor-pointer relative">
                                  <Bell size={16} className="text-amber-600" />
                                  {notificationCount > 0 && (
                                    <div className="absolute -right-1 -top-1 min-w-[16px] h-4 bg-[#ff4337] border-2 border-white rounded-full flex items-center justify-center px-0.5">
                                      <span className="text-[9px] font-bold leading-[12px] text-white">
                                        {notificationCount}
                                      </span>
                                    </div>
                                  )}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="start" sideOffset={8} className="w-80 p-0 bg-white border border-[#e0e0e0] shadow-lg">
                                <div className="p-4 border-b border-[#e0e0e0]">
                                  <h3 className="text-base font-bold leading-[21.28px] text-black">Actions required</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                  {actions.length > 0 ? (
                                    actions.map((action) => (
                                      <div key={action.id} className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] transition">
                                        <p className="text-sm leading-[18.62px] text-black">{action.message}</p>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-4">
                                      <p className="text-sm leading-[18.62px] text-black">No actions available</p>
                                    </div>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        })()}
                      </div>
                      <div className="flex items-center justify-center gap-2">
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
                      <div className="flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRAGColor(project.priority) }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col w-full items-center">
                          <span className="text-xs font-medium text-black mb-1">{project.progress}% Done</span>
                          <div className="relative h-2 w-full bg-[#f1f1f3] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, backgroundColor: getProgressBarColor(project.progress) }} />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-black font-medium text-center">
                        {project.dueDate}
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

