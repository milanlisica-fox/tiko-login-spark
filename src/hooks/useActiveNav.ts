import { useLocation } from "react-router-dom";
import { DASHBOARD_NAV, matchActiveName } from "@/constants/navigation";

export function useActiveNav(pathname?: string) {
  const location = useLocation();
  const currentPath = pathname ?? location.pathname;
  const activeName = matchActiveName(currentPath);
  const activeItem = DASHBOARD_NAV.find((n) => n.name === activeName) ?? DASHBOARD_NAV[0];
  return { activeName, activeItem };
}


