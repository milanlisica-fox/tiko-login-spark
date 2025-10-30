import {
  Bell,
  Coins,
  User,
  Home,
  FileText,
  Folder,
  BarChart2,
  Calculator,
  ChevronDown,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

export const Icons = {
  notifications: Bell,
  tokens: Coins,
  user: User,
  home: Home,
  briefs: FileText,
  projects: Folder,
  tracker: BarChart2,
  calculator: Calculator,
  chevronDown: ChevronDown,
  arrowRight: ArrowRight,
  plus: Plus,
  close: X,
} as const;

export type IconKey = keyof typeof Icons;


