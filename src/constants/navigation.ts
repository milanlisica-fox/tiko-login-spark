import { Home, FileText, Folder, BarChart2, type LucideIcon } from "lucide-react";

export type NavItem = { name: string; icon: LucideIcon; path: string };

export const DASHBOARD_NAV: NavItem[] = [
  { name: "Central", icon: Home, path: "/dashboard" },
  { name: "Tracker", icon: BarChart2, path: "/dashboard/tracker" },
  { name: "Briefs", icon: FileText, path: "/dashboard/briefs" },
  { name: "Projects", icon: Folder, path: "/dashboard/projects" },
];

export function matchActiveName(pathname: string): string {
  if (pathname.startsWith("/dashboard/briefs")) return "Briefs";
  if (pathname.startsWith("/dashboard/scope")) return "Briefs";
  if (pathname.startsWith("/dashboard/projects")) return "Projects";
  if (pathname.startsWith("/dashboard/tracker")) return "Tracker";
  if (pathname.startsWith("/dashboard/calculator")) return "Calculator";
  if (pathname.startsWith("/dashboard/profile")) return "My account";
  return "Central";
}


