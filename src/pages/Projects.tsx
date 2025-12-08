import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

type RAGStatus = "High" | "Medium" | "Low";
type ProgressRange = "0" | "1-25" | "26-50" | "51-75" | "76-99" | "100";

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
  const [selectedRAGStatuses, setSelectedRAGStatuses] = useState<Set<RAGStatus>>(new Set());
  const [selectedProgressRanges, setSelectedProgressRanges] = useState<Set<ProgressRange>>(new Set());
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);

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
        { id: 1, message: "Supply master asset" },
        { id: 2, message: "Assets ready to review" },
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
        { id: 1, message: "Supply master asset" },
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
        { id: 1, message: "Supply master asset" },
        { id: 2, message: "Assets ready to review" },
        { id: 3, message: "Provide additional information" },
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

  // Handle RAG status filter toggle
  const handleRAGFilterToggle = (status: RAGStatus) => {
    setSelectedRAGStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

  // Handle progress range filter toggle
  const handleProgressFilterToggle = (range: ProgressRange) => {
    setSelectedProgressRanges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(range)) {
        newSet.delete(range);
      } else {
        newSet.add(range);
      }
      return newSet;
    });
  };

  // Check if project matches progress range
  const matchesProgressRange = (progress: number, range: ProgressRange): boolean => {
    switch (range) {
      case "0":
        return progress === 0;
      case "1-25":
        return progress >= 1 && progress <= 25;
      case "26-50":
        return progress >= 26 && progress <= 50;
      case "51-75":
        return progress >= 51 && progress <= 75;
      case "76-99":
        return progress >= 76 && progress <= 99;
      case "100":
        return progress === 100;
      default:
        return false;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedRAGStatuses(new Set());
    setSelectedProgressRanges(new Set());
  };

  // Check if any filters are active
  const hasActiveFilters = selectedRAGStatuses.size > 0 || selectedProgressRanges.size > 0;

  // Filter and sort projects
  const projects = useMemo(() => {
    // Apply filters
    let filtered = projectsData.filter((project) => {
      // RAG status filter
      if (selectedRAGStatuses.size > 0 && !selectedRAGStatuses.has(project.priority)) {
        return false;
      }

      // Progress range filter
      if (selectedProgressRanges.size > 0) {
        const matchesAnyRange = Array.from(selectedProgressRanges).some((range) =>
          matchesProgressRange(project.progress, range)
        );
        if (!matchesAnyRange) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
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
    }

    return filtered;
  }, [projectsData, sortField, sortDirection, selectedRAGStatuses, selectedProgressRanges]);

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

          {/* Filter Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => setIsFilterDialogOpen(true)}
              className="w-8 h-8 rounded-full bg-[#ffb546] flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M11.026 0.0996094C11.3327 0.0996094 11.5816 0.348498 11.5816 0.655165C11.5816 0.962572 11.3327 1.21072 11.026 1.21072H0.655653C0.348987 1.21072 0.100098 0.962572 0.100098 0.655165C0.100098 0.348498 0.348987 0.0996094 0.655653 0.0996094H11.026ZM5.2801 4.91146C5.58602 4.91146 5.83565 5.16035 5.83565 5.46702C5.83565 5.77442 5.58602 6.02257 5.2801 6.02257L0.655653 6.02554C0.348987 6.02554 0.100098 5.77739 0.100098 5.46998C0.100098 5.16331 0.348987 4.91442 0.655653 4.91442L5.2801 4.91146ZM5.2801 9.72776C5.58602 9.72776 5.83565 9.97665 5.83565 10.2833C5.83565 10.5907 5.58602 10.8389 5.2801 10.8389L0.655653 10.8404C0.348987 10.8404 0.100098 10.5922 0.100098 10.2848C0.100098 9.97813 0.348987 9.72924 0.655653 9.72924L5.2801 9.72776ZM11.1031 4.63294C11.4008 4.63294 11.5119 4.80331 11.546 4.87665C11.5801 4.94998 11.6386 5.14479 11.4453 5.37146L9.7401 7.31739V10.6129C9.7401 10.9189 9.49121 11.1678 9.18528 11.1678C8.87936 11.1678 8.63047 10.9189 8.63047 10.6129V7.30998L6.9238 5.37146C6.73121 5.14479 6.78899 4.94998 6.82306 4.87665C6.85713 4.80331 6.96825 4.63294 7.26676 4.63294H11.1031Z" fill="black" stroke="black" strokeWidth="0.2"/>
              </svg>
            </button>
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
                            const defaultMessages = ["Supply master asset", "Assets ready to review", "Provide additional information"];
                            actions = Array.from({ length: notificationCount }, (_, i) => ({
                              id: i + 1,
                              message: defaultMessages[i % defaultMessages.length]
                            }));
                          }
                          
                          // Ensure actions array length matches notification count
                          // If actions are fewer than count, pad with defaults
                          // If actions are more than count, limit to count
                          if (actions.length < notificationCount) {
                            const defaultMessages = ["Supply master asset", "Assets ready to review", "Provide additional information"];
                            const additionalActions = Array.from({ length: notificationCount - actions.length }, (_, i) => ({
                              id: actions.length + i + 1,
                              message: defaultMessages[(actions.length + i) % defaultMessages.length]
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

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-[661px] p-[40px] rounded-[26px] shadow-[0px_13px_61px_0px_rgba(169,169,169,0.37)] bg-white">
          <DialogHeader className="relative">
            <DialogTitle className="text-[28px] font-bold leading-[37.24px] text-black">
              Filters
            </DialogTitle>
            <button
              onClick={() => setIsFilterDialogOpen(false)}
              className="absolute right-[0px] top-[0px] w-[58px] p-4 flex items-center justify-center hover:bg-[#f1f1f3] rounded-[8px] transition"
            >
              <div className="w-6 h-6 overflow-hidden relative">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M8.31075 7.24875L14.2818 1.27975C14.5748 0.98675 14.5748 0.51275 14.2818 0.21975C13.9888 -0.07325 13.5127 -0.07325 13.2207 0.21975L7.24975 6.18775L1.28075 0.21975C0.98775 -0.07325 0.51275 -0.07325 0.21975 0.21975C-0.07325 0.51275 -0.07325 0.98675 0.21975 1.27975L6.18975 7.24875L0.21975 13.2198C-0.07325 13.5128 -0.07325 13.9867 0.21975 14.2797C0.36675 14.4268 0.55775 14.4987 0.74975 14.4987C0.94275 14.4987 1.13375 14.4268 1.28075 14.2797L7.24975 8.31075L13.2207 14.2797C13.3667 14.4268 13.5588 14.4987 13.7508 14.4987C13.9428 14.4987 14.1348 14.4268 14.2818 14.2797C14.5748 13.9867 14.5748 13.5128 14.2818 13.2198L8.31075 7.24875Z" fill="black"/>
                </svg>
              </div>
            </button>
          </DialogHeader>

          <div className="flex flex-col gap-[10px] mt-0">
            <div className="flex flex-col gap-[40px]">
              {/* RAG Status Filter */}
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">
                  Select RAG Status
                </p>
                <div className="flex flex-wrap gap-[10px]">
                  {(["High", "Medium", "Low"] as RAGStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleRAGFilterToggle(status)}
                      className={`px-[16px] py-[6px] rounded-[85px] text-[12px] leading-[15.96px] transition-all duration-200 border ${
                        selectedRAGStatuses.has(status)
                          ? "bg-[#03B3E2] text-white border-[#03B3E2] scale-105"
                          : "bg-white text-black border-[#e0e0e0] hover:bg-[#f9f9f9] hover:scale-105 active:scale-95"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRAGColor(status) }} />
                        {status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Range Filter */}
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">
                  Select Progress Range
                </p>
                <div className="flex flex-wrap gap-[10px]">
                  {(
                    [
                      { range: "0" as ProgressRange, label: "Not started (0%)" },
                      { range: "1-25" as ProgressRange, label: "Early (1-25%)" },
                      { range: "26-50" as ProgressRange, label: "Mid (26-50%)" },
                      { range: "51-75" as ProgressRange, label: "Late (51-75%)" },
                      { range: "76-99" as ProgressRange, label: "Near complete (76-99%)" },
                      { range: "100" as ProgressRange, label: "Complete (100%)" },
                    ] as const
                  ).map(({ range, label }) => (
                    <button
                      key={range}
                      onClick={() => handleProgressFilterToggle(range)}
                      className={`px-[16px] py-[6px] rounded-[85px] text-[12px] leading-[15.96px] transition-all duration-200 border ${
                        selectedProgressRanges.has(range)
                          ? "bg-[#03B3E2] text-white border-[#03B3E2] scale-105"
                          : "bg-white text-black border-[#e0e0e0] hover:bg-[#f9f9f9] hover:scale-105 active:scale-95"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[10px] mt-4">
              <Button
                variant="outline"
                onClick={() => setIsFilterDialogOpen(false)}
                className="flex-1 h-[32px] bg-gray-200 hover:bg-gray-300 backdrop-blur-[6px] rounded-[28px] px-6 py-[18px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">
                  Close
                </span>
              </Button>
              {hasActiveFilters && (
                <Button
                  onClick={() => {
                    clearFilters();
                    setIsFilterDialogOpen(false);
                  }}
                  className="flex-1 h-[32px] bg-[#ffb546] hover:opacity-90 backdrop-blur-[6px] rounded-[28px] px-6 py-[18px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">
                    Clear filters
                  </span>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

