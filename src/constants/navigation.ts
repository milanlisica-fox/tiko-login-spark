import { Home, FileText, Folder, BarChart2, type LucideIcon } from "lucide-react";

export type NavItem = { name: string; icon: LucideIcon; path: string };

export const DASHBOARD_NAV: NavItem[] = [
  { name: "Central", icon: Home, path: "/dashboard" },
  { name: "Briefs", icon: FileText, path: "/dashboard/briefs" },
  { name: "Projects", icon: Folder, path: "/dashboard/projects" },
  { name: "Tracker", icon: BarChart2, path: "/dashboard/tracker" },
];

export function matchActiveName(pathname: string): string {
  if (pathname.startsWith("/dashboard/briefs")) return "Briefs";
  if (pathname.startsWith("/dashboard/projects")) return "Projects";
  if (pathname.startsWith("/dashboard/tracker")) return "Tracker";
  return "Central";
}


