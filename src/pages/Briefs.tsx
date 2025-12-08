import { useMemo, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Calculator, Coins, X, Calendar as CalendarIcon, ArrowLeft, Plus, Minus, ChevronDown as ChevronDownIcon, HelpCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format, parse } from "date-fns";
import { triggerSuccessConfetti } from "@/lib/animations";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND, TEMPLATE_ICONS } from "@/constants/branding";
import { PillPrimary, PillAccent, PillSubtle, PillGhost } from "@/components/common/buttons";
import StatCard from "@/components/common/StatCard";
import BriefCard from "@/components/common/BriefCard";
import { Field } from "@/components/common/Field";
import DateField from "@/components/common/DateField";
import ChatInput from "@/components/common/ChatInput";
import TokenEstimate from "@/components/common/TokenEstimate";
import { ALL_TEMPLATES } from "@/constants/templates";
import { RECOMMENDED_DELIVERABLES, DELIVERABLES_LIST } from "@/constants/deliverables";
import { Icons } from "@/constants/icons";
import { BRIEFS_ASSETS } from "@/constants/briefs-assets";
import Badge from "@/components/common/Badge";
import AvatarStack from "@/components/common/AvatarStack";
import SuccessDialog from "@/components/common/SuccessDialog";
import BriefPreviewPanel from "@/components/briefs/BriefPreviewPanel";
import { StyledInput } from "@/components/common/StyledInput";
import TabFilter from "@/components/common/TabFilter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { READY_TO_SIGN_SCOPES } from "./SOW";

// Reuse images from Dashboard for consistent visuals
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

// Template icons from Figma
const iconAssetAdaptation = TEMPLATE_ICONS.assetAdaptation;
const iconBAU = TEMPLATE_ICONS.bau;
const iconPOS = TEMPLATE_ICONS.pos;
const iconDigitalPOS = TEMPLATE_ICONS.digitalPos;
const iconFeatureAsset = TEMPLATE_ICONS.featureAsset;
const iconToolkit = TEMPLATE_ICONS.toolkit;
const iconPartnerships = TEMPLATE_ICONS.assetAdaptation;
const iconSocialContent = TEMPLATE_ICONS.pos;
const arrowRightIcon = BRIEFS_ASSETS.arrowRightIcon;

export const FORM_TEMPLATE_OPTIONS: { id: string; title: string; icon: string }[] = [
  { id: "promotional-campaign", title: "Promotional campaign", icon: iconPOS },
  { id: "bau-campaign", title: "BAU campaign", icon: iconBAU },
  { id: "flagship-campaign", title: "Flagship toolkit", icon: iconFeatureAsset },
];

// Past briefs for duplication
export const PAST_BRIEFS: Array<{
  id: string;
  title: string;
  data: Omit<NewBriefFormValues, "projectTitle" | "dueDate" | "projectLead" | "underNDA" | "targetAudience">;
}> = [
  {
    id: "past-brief-1",
    title: "Cashback Campaign 2024",
    data: {
      objective: "Increase customer engagement and retention through a cashback promotion campaign targeting existing customers.",
      workType: ["Design", "Delivery"],
      channels: ["Print", "Online", "Mobile", "Social", "Contact Centre"],
      expectedOutputs: ["Plan", "Idea", "Copy asset", "Print asset", "Execution (live to consumer)", "Furniture", "Shop Display(s)", "Point of sale", "Digital marketing asset"],
      briefSummary: "Develop a comprehensive cashback campaign to reward loyal customers and attract new ones through targeted promotions.",
      assets: [
        {
          id: "calc-1",
          name: "Master KV creation (PSD, JPEG, INDD, PDF)",
          description: "Master KV creation (PSD, JPEG, INDD, PDF)",
          tokenPrice: 8,
          assetSpecification: "1920x1080, 300dpi, CMYK",
          deliveryWeek: "Week 12",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-2",
          name: "Static KV adaption (PSD, JPEG)",
          description: "Static KV adaption (PSD, JPEG)",
          tokenPrice: 5,
          assetSpecification: "Multiple sizes for social media",
          deliveryWeek: "Week 13",
          quantity: 3,
          isCustom: false,
        },
      ],
      selectedTemplate: "promotional-campaign",
      additionalAssetDetails: "All assets should include cashback percentage prominently displayed.",
      watermarkFiles: false,
      attachedDocuments: [],
    },
  },
  {
    id: "past-brief-2",
    title: "Summer Sale BAU 2024",
    data: {
      objective: "Create standard BAU assets for summer sale promotion across all retail channels and digital platforms.",
      workType: ["Design", "Production"],
      channels: ["Retail", "Online", "Social", "Print"],
      expectedOutputs: ["Print asset", "Digital marketing asset"],
      briefSummary: "Standard BAU campaign for summer sale with consistent messaging and visual identity across all touchpoints.",
      assets: [
        {
          id: "calc-12",
          name: "Master KV",
          description: "Master KV",
          tokenPrice: 8,
          assetSpecification: "A4, A3, A2 formats",
          deliveryWeek: "Week 8",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-13",
          name: "Digital display banner",
          description: "Digital display banner",
          tokenPrice: 5,
          assetSpecification: "728x90, 300x250, 970x250",
          deliveryWeek: "Week 9",
          quantity: 5,
          isCustom: false,
        },
        {
          id: "calc-14",
          name: "Social banners static",
          description: "Social banners static",
          tokenPrice: 4,
          assetSpecification: "1080x1080, 1200x628",
          deliveryWeek: "Week 9",
          quantity: 4,
          isCustom: false,
        },
      ],
      selectedTemplate: "bau-campaign",
      additionalAssetDetails: "Ensure brand guidelines are strictly followed. All assets must be approved before final delivery.",
      watermarkFiles: true,
      attachedDocuments: [],
    },
  },
  {
    id: "past-brief-3",
    title: "Galaxy S24 Flagship Launch",
    data: {
      objective: "Launch comprehensive marketing toolkit for Galaxy S24 flagship product with full ecosystem support.",
      workType: ["Strategy", "Design", "Production", "Planning"],
      channels: ["TVC", "Online", "Social", "Retail", "Out of home"],
      expectedOutputs: ["Video asset", "Print asset", "Digital marketing asset"],
      briefSummary: "Create flagship toolkit for Galaxy S24 launch including master assets, adaptations, and localized variations for global markets.",
      assets: [
        {
          id: "calc-16",
          name: "Toolkit",
          description: "Toolkit",
          tokenPrice: 6,
          assetSpecification: "Complete brand toolkit",
          deliveryWeek: "Week 6",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-19",
          name: "Static KVs",
          description: "Static KVs",
          tokenPrice: 5,
          assetSpecification: "Multiple product angles",
          deliveryWeek: "Week 7",
          quantity: 8,
          isCustom: false,
        },
        {
          id: "calc-20",
          name: "Animated KVs",
          description: "Animated KVs",
          tokenPrice: 7,
          assetSpecification: "15s and 30s versions",
          deliveryWeek: "Week 8",
          quantity: 4,
          isCustom: false,
        },
        {
          id: "calc-23",
          name: "Digi banners",
          description: "Digi banners",
          tokenPrice: 5,
          assetSpecification: "All standard sizes",
          deliveryWeek: "Week 9",
          quantity: 6,
          isCustom: false,
        },
      ],
      selectedTemplate: "flagship-campaign",
      additionalAssetDetails: "Priority on premium quality and high-end visuals. All assets must showcase product features clearly.",
      watermarkFiles: false,
      attachedDocuments: [],
    },
  },
  {
    id: "past-brief-4",
    title: "Holiday Season Promo 2023",
    data: {
      objective: "Drive holiday sales through festive promotional campaign with seasonal messaging and visuals.",
      workType: ["Design", "Production", "Execution (Inc.Media booking)"],
      channels: ["Social", "Online", "Retail", "Print"],
      expectedOutputs: ["Digital marketing asset", "Print asset", "Copy asset"],
      briefSummary: "Holiday season promotional campaign with festive themes, gift-focused messaging, and seasonal visuals for all channels.",
      assets: [
        {
          id: "calc-1",
          name: "Master KV creation (PSD, JPEG, INDD, PDF)",
          description: "Master KV creation (PSD, JPEG, INDD, PDF)",
          tokenPrice: 8,
          assetSpecification: "Festive theme with holiday colors",
          deliveryWeek: "Week 10",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-4",
          name: "Master KV animation creation (MP4, AEP)",
          description: "Master KV animation creation (MP4, AEP)",
          tokenPrice: 10,
          assetSpecification: "30s animation loop",
          deliveryWeek: "Week 11",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-6",
          name: "PPT Files",
          description: "PPT Files",
          tokenPrice: 4,
          assetSpecification: "Presentation deck template",
          deliveryWeek: "Week 11",
          quantity: 1,
          isCustom: false,
        },
      ],
      selectedTemplate: "promotional-campaign",
      additionalAssetDetails: "Ensure festive feel while maintaining brand identity. Include gift messaging prominently.",
      watermarkFiles: false,
      attachedDocuments: [],
    },
  },
  {
    id: "past-brief-5",
    title: "Q4 Product Refresh BAU",
    data: {
      objective: "Update existing product assets for Q4 refresh with new messaging and seasonal adaptations.",
      workType: ["Design", "Production"],
      channels: ["Online", "Social", "Mobile"],
      expectedOutputs: ["Digital marketing asset"],
      briefSummary: "BAU refresh of existing product assets with updated messaging and seasonal adaptations for Q4 campaign.",
      assets: [
        {
          id: "calc-12",
          name: "Master KV",
          description: "Master KV",
          tokenPrice: 8,
          assetSpecification: "Updated product imagery",
          deliveryWeek: "Week 5",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-15",
          name: "Social banners animation",
          description: "Social banners animation",
          tokenPrice: 6,
          assetSpecification: "Stories and feed formats",
          deliveryWeek: "Week 6",
          quantity: 6,
          isCustom: false,
        },
        {
          id: "calc-3",
          name: "Static KV adaption (INDD, PDF)",
          description: "Static KV adaption (INDD, PDF)",
          tokenPrice: 5,
          assetSpecification: "Print-ready formats",
          deliveryWeek: "Week 6",
          quantity: 2,
          isCustom: false,
        },
      ],
      selectedTemplate: "bau-campaign",
      additionalAssetDetails: "Maintain consistency with existing brand assets while refreshing for Q4 messaging.",
      watermarkFiles: true,
      attachedDocuments: [],
    },
  },
  {
    id: "past-brief-6",
    title: "New Year Launch Campaign",
    data: {
      objective: "Kick off the new year with a fresh campaign launch celebrating new beginnings and product innovations.",
      workType: ["Strategy", "Design", "Production", "Planning"],
      channels: ["TVC", "Social", "Online", "Retail", "Out of home"],
      expectedOutputs: ["Video asset", "Digital marketing asset", "Copy asset"],
      briefSummary: "New Year launch campaign with fresh visuals, innovative messaging, and multi-channel approach to celebrate new beginnings.",
      assets: [
        {
          id: "calc-1",
          name: "Master KV creation (PSD, JPEG, INDD, PDF)",
          description: "Master KV creation (PSD, JPEG, INDD, PDF)",
          tokenPrice: 8,
          assetSpecification: "Fresh, modern aesthetic",
          deliveryWeek: "Week 1",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-9",
          name: "Video creation",
          description: "Video creation",
          tokenPrice: 12,
          assetSpecification: "60s hero video",
          deliveryWeek: "Week 2",
          quantity: 1,
          isCustom: false,
        },
        {
          id: "calc-5",
          name: "Master KV animation adaption (MP4, AEP)",
          description: "Master KV animation adaption (MP4, AEP)",
          tokenPrice: 7,
          assetSpecification: "15s and 30s cutdowns",
          deliveryWeek: "Week 3",
          quantity: 3,
          isCustom: false,
        },
      ],
      selectedTemplate: "promotional-campaign",
      additionalAssetDetails: "Focus on fresh, forward-looking visuals that inspire and energize. Celebrate innovation and progress.",
      watermarkFiles: false,
      attachedDocuments: [],
    },
  },
];

// Template to asset mapping - randomly select 5 assets for promotional and BAU campaigns
// Helper function to randomly select 5 assets from the list
const getRandomAssets = (count: number, excludeIds: string[] = []): string[] => {
  const allAssetIds = ["calc-1", "calc-2", "calc-3", "calc-4", "calc-5", "calc-6", "calc-7", "calc-8", "calc-9", "calc-10"];
  const availableIds = allAssetIds.filter(id => !excludeIds.includes(id));
  const shuffled = [...availableIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const TEMPLATE_ASSETS_MAP: Record<string, string[]> = {
  "promotional-campaign": getRandomAssets(5),
  "bau-campaign": getRandomAssets(5),
  "flagship-campaign": getRandomAssets(5),
  "other": [], // Empty array means show all assets
};

// New brief form images from Figma
const briefLoadingIcon = BRIEFS_ASSETS.briefLoadingIcon;
const tokenIcon = BRIEFS_ASSETS.tokenIcon;
const createBriefArrowIcon = BRIEFS_ASSETS.createBriefArrowIcon;

// Deliverables screen images from Figma
const imgFrame15 = BRIEFS_ASSETS.imgFrame15;
const imgLine10 = BRIEFS_ASSETS.imgLine10;
const imgLineStroke = BRIEFS_ASSETS.imgLineStroke;

// AI Response screen images from Figma
const imgLine11 = BRIEFS_ASSETS.imgLine11;
const imgLine12 = BRIEFS_ASSETS.imgLine12;
const imgFrame14_v2 = BRIEFS_ASSETS.imgFrame14_v2;
const imgFrame15_v2 = BRIEFS_ASSETS.imgFrame15_v2;
// Upload icon (match profile picture dialog)
const uploadIcon = BRIEFS_ASSETS.uploadIcon;

export const WORK_TYPE_OPTIONS = [
  "Strategy",
  "Design",
  "Production",
  "Planning",
  "Execution (Inc.Media booking)",
  "Delivery",
  "Purchase of goods",
  "Shelf",
  "Merchandising",
  "Sales staff",
  "Support",
  "Event",
  "Promotional activity",
  "Other",
];

export const CHANNEL_OPTIONS = [
  "TVC",
  "Print",
  "Online",
  "Social",
  "Mobile",
  "Retail",
  "Out of home",
  "Experiential",
  "B2B",
  "Contact Centre",
  "Field Force",
  "Other",
];

export const OUTPUT_OPTIONS = [
"Plan",
"Idea",
"Copy asset",
"Print asset",
"Video asset",
"Execution (live to consumer)",
"Furniture",
"Shop Display(s)",
"Point of sale",
"Digital marketing asset",
"Other",
];

const DEFAULT_CUSTOM_ASSET_PRICE = 8;

// Calculator assets - same as Quick calculator
const CALCULATOR_ASSETS_LIST: RecommendedAsset[] = [
  {
    id: "calc-1",
    name: "Master KV creation",
    description: "Master KV creation",
    tokenPrice: 30,
  },
  {
    id: "calc-2",
    name: "Static KV adaptation",
    description: "Static KV adaptation",
    tokenPrice: 3,
  },
  {
    id: "calc-3",
    name: "Status KV adaptation",
    description: "Status KV adaptation",
    tokenPrice: 3,
  },
  {
    id: "calc-4",
    name: "Master KV animation creation",
    description: "Master KV animation creation",
    tokenPrice: 100,
  },
  {
    id: "calc-5",
    name: "Master KV animation adaptation",
    description: "Master KV animation adaptation",
    tokenPrice: 3,
  },
  {
    id: "calc-6",
    name: "PPT Files",
    description: "PPT Files",
    tokenPrice: 30,
  },
  {
    id: "calc-7",
    name: "Roundel",
    description: "Roundel",
    tokenPrice: 3,
  },
  {
    id: "calc-8",
    name: "Urgency tag",
    description: "Urgency tag",
    tokenPrice: 3,
  },
  {
    id: "calc-9",
    name: "Video creation",
    description: "Video creation",
    tokenPrice: 100,
  },
  {
    id: "calc-10",
    name: "Video adaptation",
    description: "Video adaptation",
    tokenPrice: 3,
  },
  {
    id: "calc-11",
    name: "Watermarked files",
    description: "Watermarked files",
    tokenPrice: 2,
  },
];

// Flagship toolkit token prices (different from standard)
const FLAGSHIP_TOKEN_PRICES: Record<string, number> = {
  "calc-1": 70,  // Master KV creation
  "calc-2": 4,   // Static KV adaptation
  "calc-3": 4,   // Status KV adaptation
  "calc-4": 100, // Master KV animation creation
  "calc-5": 6,   // Master KV animation adaptation
};

const RECOMMENDED_ASSETS = CALCULATOR_ASSETS_LIST;
const ADDITIONAL_ASSETS: RecommendedAsset[] = [];

// Helper function to get asset with correct pricing based on template
const getAssetWithTemplatePrice = (asset: RecommendedAsset, templateId: string): RecommendedAsset => {
  if (templateId === "flagship-campaign" && FLAGSHIP_TOKEN_PRICES[asset.id]) {
    return { ...asset, tokenPrice: FLAGSHIP_TOKEN_PRICES[asset.id] };
  }
  return asset;
};

const paperclipIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
    <path d="M12.9338 6.75454L6.54463 13.1437C5.3168 14.3715 3.32782 14.3715 2.09999 13.1437C0.872163 11.9159 0.872163 9.9269 2.09999 8.69907L9.04474 1.75433C9.41311 1.38595 9.91273 1.179 10.4337 1.179C10.9546 1.179 11.4543 1.38595 11.8226 1.75433C12.191 2.1227 12.398 2.62232 12.398 3.14327C12.398 3.66423 12.191 4.16385 11.8226 4.53222L5.98905 10.3658C5.68348 10.6714 5.18346 10.6714 4.87789 10.3658C4.57232 10.0602 4.57232 9.56022 4.87789 9.25465L10.1559 3.97664L9.32253 3.14327L4.04452 8.42128C3.67615 8.78965 3.4692 9.28927 3.4692 9.81023C3.4692 10.3312 3.67615 10.8308 4.04452 11.1992C4.41289 11.5675 4.91251 11.7745 5.43347 11.7745C5.95443 11.7745 6.45405 11.5675 6.82242 11.1992L12.656 5.36559C13.8838 4.13776 13.8838 2.14879 12.656 0.920957C11.4282 -0.306874 9.4392 -0.306874 8.21137 0.920957L1.26662 7.8657C-0.422337 9.55466 -0.422337 12.2881 1.26662 13.9771C2.95559 15.666 5.68904 15.666 7.378 13.9771L13.7672 7.58791L12.9338 6.75454Z" fill="#1F1F22"/>
  </svg>
);

const sendArrowIcon = (
  <div className="w-10 h-10 rounded-full bg-[#ffb546] flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
      <path d="M4.55075 0.753984C4.5167 0.883758 4.50851 1.01933 4.52664 1.15293C4.54478 1.28653 4.58889 1.41553 4.65644 1.53253C4.72399 1.64953 4.81365 1.75223 4.92028 1.83473C5.02692 1.91724 5.14842 1.97794 5.27783 2.01334L11.2417 3.6559L0.502435 9.85624C0.269925 9.99048 0.101013 10.2129 0.0328563 10.4745C-0.0353009 10.7361 0.00287702 11.0156 0.138997 11.2513C0.275116 11.4871 0.498027 11.6599 0.758686 11.7317C1.01935 11.8035 1.2964 11.7684 1.52891 11.6341L12.2682 5.43381L10.7096 11.4215C10.6413 11.6835 10.6796 11.9635 10.8159 12.1996C10.9523 12.4358 11.1756 12.6089 11.4367 12.6808C11.6978 12.7527 11.9754 12.7176 12.2083 12.5831C12.4412 12.4486 12.6104 12.2259 12.6787 11.9638L14.8593 3.59313C14.8933 3.46336 14.9015 3.32778 14.8834 3.19418C14.8653 3.06058 14.8212 2.93158 14.7536 2.81458C14.6861 2.69758 14.5964 2.59488 14.4898 2.51238C14.3831 2.42987 14.2616 2.36917 14.1322 2.33377L5.79271 0.0369374C5.66341 0.00108577 5.52867 -0.0087951 5.3962 0.00786099C5.26374 0.0245171 5.13615 0.0673812 5.02077 0.133998C4.90539 0.200614 4.80447 0.289672 4.72382 0.396063C4.64316 0.502454 4.58434 0.624086 4.55075 0.753984Z" fill="white" />
    </svg>
  </div>
);

const BriefLoadingGraphic = () => (
  <svg className="h-[36.966px] w-[77.813px]" xmlns="http://www.w3.org/2000/svg" width="42" height="37" viewBox="0 0 42 37" fill="none">
    <path
      d="M21.7174 36.8857H5.29228C2.36582 36.8857 0 34.5137 0 31.5934V29.4062C0 28.2172 0.727013 27.1452 1.82982 26.7077L13.5972 21.1197C16.0308 20.1525 16.037 16.7147 13.6157 15.7289L1.81749 10.03C0.72084 9.58643 0.00616698 8.52059 0.00616698 7.33769V5.29224C0.00616698 2.36579 2.37815 0 5.29845 0H21.7235C22.8756 0 23.9969 0.375812 24.9149 1.072L38.925 14.2256C41.7282 16.345 41.7282 20.5529 38.925 22.6723L24.9149 35.826C23.9969 36.5221 22.8756 36.898 21.7235 36.898L21.7174 36.8857Z"
      fill="#E0E0E1"
      fillOpacity="0.5"
    />
  </svg>
);

type BriefStatus = "Draft" | "In review" | "Scope ready to sign";
type BriefBadge = "Promotional campaign" | "BAU campaign" | "Flagship toolkit" | "default";

// Helper function to map template ID to badge name
const getBadgeFromTemplate = (templateId: string): BriefBadge => {
  switch (templateId) {
    case "promotional-campaign":
      return "Promotional campaign";
    case "bau-campaign":
      return "BAU campaign";
    case "flagship-campaign":
      return "Flagship toolkit";
    default:
      return "default";
  }
};

export type SubmittedBriefPayload = {
  title: string;
  objective: string;
  status: "draft" | "in-review";
  dueDate?: string;
};

interface RecommendedAsset {
  id: string;
  name: string;
  description: string;
  tokenPrice: number;
}

export interface SelectedAsset extends RecommendedAsset {
  assetSpecification: string;
  deliveryWeek: string;
  quantity: number;
  isCustom?: boolean;
}

export interface BriefSummary {
  id: string;
  title: string;
  description: string;
  badge: BriefBadge;
  date: string;
  comments: number;
  avatars: number;
  status: BriefStatus;
  icon?: ReactNode;
  projectLead?: string;
}

export interface NewBriefFormValues {
  projectTitle: string;
  dueDate?: Date;
  projectLead: string[];
  underNDA: boolean;
  objective: string;
  targetAudience: string;
  workType: string[];
  channels: string[];
  expectedOutputs: string[];
  briefSummary: string;
  assets: SelectedAsset[];
  selectedTemplate: string;
  additionalAssetDetails: string;
  watermarkFiles: boolean;
  attachedDocuments: File[];
}

export const PROJECT_LEADS = [
  { value: "murray-bray", label: "Murray Gordon" },
  { value: "john-doe", label: "Henry Bray" },
  { value: "jane-smith", label: "Holly Hayes" },
];

const createBriefFormDefaults = (): NewBriefFormValues => ({
  projectTitle: "",
  dueDate: undefined,
  projectLead: [],
  underNDA: false,
  objective: "",
  targetAudience: "",
  workType: [],
  channels: [],
  expectedOutputs: [],
  briefSummary: "",
  assets: [],
  selectedTemplate: "",
  additionalAssetDetails: "",
  watermarkFiles: false,
  attachedDocuments: [],
});

const initialBriefs: BriefSummary[] = [
  // "To action on" briefs - these should appear first
  {
    id: "brief-action-1",
    title: "W Summer Festival 2025",
    description: " Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
    badge: "Promotional campaign",
    date: "12 Dec",
    comments: 12,
    avatars: 3,
    status: "Draft",
    icon: (
      <div className="relative">
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.14686 12H1.7428C0.779082 12 0 11.23 0 10.2774V9.56528C0 9.17804 0.238677 8.83086 0.603451 8.68843L4.47636 6.8724C5.27796 6.55638 5.27795 5.43917 4.48085 5.11869L0.598943 3.26706C0.238673 3.12463 0 2.77745 0 2.39021V1.72255C0 0.770031 0.779082 0 1.7428 0H7.14686C7.52514 0 7.89441 0.120181 8.19614 0.347184L12.8076 4.62463C13.7308 5.31454 13.7308 6.68101 12.8076 7.37092L8.19614 11.6484C7.89441 11.8754 7.52514 11.9955 7.14686 11.9955V12Z" fill="#03B3E2"/>
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
        </svg>
      </div>
    ),
  },
  {
    id: "brief-action-2",
    title: "Fold Toolkit Q3 2025",
    description: "Visual guide for the Fold Toolkit Q3 2025. Create full set of campaign visuals, formats, and variations for digital and print media, ensuring consistent visual identity across all touchpoints.",
    badge: "Flagship toolkit",
    date: "15 Dec",
    comments: 12,
    avatars: 3,
    status: "Draft",
    icon: (
      <div className="relative">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5"/>
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
        </svg>
      </div>
    ),
  },
  {
    id: "brief-action-3",
    title: "Buds3 Campaign Toolkit",
    description: "Develop visual guide for Buds 3 Campaign. Create full set of assets and design templates to support marketing rollout across multiple channels.",
    badge: "Flagship toolkit",
    date: "18 Dec",
    comments: 12,
    avatars: 3,
    status: "Draft",
    icon: (
      <div className="relative">
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.14686 12H1.7428C0.779082 12 0 11.23 0 10.2774V9.56528C0 9.17804 0.238677 8.83086 0.603451 8.68843L4.47636 6.8724C5.27796 6.55638 5.27795 5.43917 4.48085 5.11869L0.598943 3.26706C0.238673 3.12463 0 2.77745 0 2.39021V1.72255C0 0.770031 0.779082 0 1.7428 0H7.14686C7.52514 0 7.89441 0.120181 8.19614 0.347184L12.8076 4.62463C13.7308 5.31454 13.7308 6.68101 12.8076 7.37092L8.19614 11.6484C7.89441 11.8754 7.52514 11.9955 7.14686 11.9955V12Z" fill="#03B3E2"/>
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
        </svg>
      </div>
    ),
  },
  {
    id: "brief-action-4",
    title: "Adapt AI Toolkit Q3 2025",
    description: "Adapt all AI master campaign assets into formats optimized for print and add localized variations for different markets, ensuring visual consistency and high production quality across all deliverables.",
    badge: "BAU campaign",
    date: "20 Dec",
    comments: 12,
    avatars: 3,
    status: "Draft",
    icon: (
      <div className="relative">
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.14686 12H1.7428C0.779082 12 0 11.23 0 10.2774V9.56528C0 9.17804 0.238677 8.83086 0.603451 8.68843L4.47636 6.8724C5.27796 6.55638 5.27795 5.43917 4.48085 5.11869L0.598943 3.26706C0.238673 3.12463 0 2.77745 0 2.39021V1.72255C0 0.770031 0.779082 0 1.7428 0H7.14686C7.52514 0 7.89441 0.120181 8.19614 0.347184L12.8076 4.62463C13.7308 5.31454 13.7308 6.68101 12.8076 7.37092L8.19614 11.6484C7.89441 11.8754 7.52514 11.9955 7.14686 11.9955V12Z" fill="#03B3E2"/>
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-1 -right-1">
          <rect x="1" y="1" width="10" height="10" rx="5" fill="#FF4337"/>
          <rect x="1" y="1" width="10" height="10" rx="5" stroke="#F9F9F9" strokeWidth="2"/>
        </svg>
      </div>
    ),
  },
  // Original briefs
  {
    id: "brief-1",
    title: "W Summer Festival 2025",
    description:
      "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
    badge: "Promotional campaign",
    date: "15 Dec",
    comments: 23,
    avatars: 2,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-2",
    title: "Watch Radio Campaign Q4 2025",
    description:
      "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
    badge: "BAU campaign",
    date: "18 Dec",
    comments: 4,
    avatars: 3,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-3",
    title: "W Summer Festival 2025",
    description:
      "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
    badge: "Promotional campaign",
    date: "22 Dec",
    comments: 4,
    avatars: 3,
    status: "In review",
    icon: (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5" />
      </svg>
    ),
  },
  {
    id: "brief-4",
    title: "Fold Toolkit Q3 2025",
    description:
      "Develop visual guide for  the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media.",
    badge: "Flagship toolkit",
    date: "14 Dec",
    comments: 0,
    avatars: 3,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-5",
    title: "Galaxy S25 Launch Campaign",
    description: "Create comprehensive marketing assets for the Galaxy S25 launch event. Include print materials, digital banners, and social media content.",
    badge: "Promotional campaign",
    date: "16 Dec",
    comments: 8,
    avatars: 2,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-6",
    title: "Holiday Season BAU Assets",
    description: "Develop standard BAU assets for holiday season promotions across all retail channels and digital platforms.",
    badge: "BAU campaign",
    date: "17 Dec",
    comments: 5,
    avatars: 3,
    status: "In review",
    icon: (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5" />
      </svg>
    ),
  },
  {
    id: "brief-7",
    title: "Smart TV Ecosystem Toolkit",
    description: "Create flagship toolkit for Smart TV ecosystem launch. Include master assets, adaptations, and localized variations.",
    badge: "Flagship toolkit",
    date: "19 Dec",
    comments: 15,
    avatars: 2,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-8",
    title: "Q1 2026 Product Launch",
    description: "Develop promotional campaign materials for Q1 2026 product launch across multiple markets and channels.",
    badge: "Promotional campaign",
    date: "21 Dec",
    comments: 12,
    avatars: 3,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-9",
    title: "Wearables Campaign Adaptation",
    description: "Adapt existing wearables campaign assets for new markets and formats. Ensure brand consistency across all adaptations.",
    badge: "BAU campaign",
    date: "23 Dec",
    comments: 7,
    avatars: 2,
    status: "In review",
    icon: (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5" />
      </svg>
    ),
  },
  {
    id: "brief-10",
    title: "Enterprise Solutions Toolkit",
    description: "Create comprehensive toolkit for enterprise solutions launch. Include B2B focused assets and marketing materials.",
    badge: "Flagship toolkit",
    date: "25 Dec",
    comments: 9,
    avatars: 3,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-11",
    title: "Spring Collection Campaign",
    description: "Develop visual assets for spring collection launch. Create seasonal campaign materials for digital and retail channels.",
    badge: "Promotional campaign",
    date: "27 Dec",
    comments: 11,
    avatars: 2,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-12",
    title: "Mobile App Promotion BAU",
    description: "Create BAU assets for mobile app promotion campaigns. Standard formats for app store listings and social media.",
    badge: "BAU campaign",
    date: "28 Dec",
    comments: 6,
    avatars: 3,
    status: "In review",
    icon: (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5" />
      </svg>
    ),
  },
  {
    id: "brief-13",
    title: "Gaming Accessories Toolkit",
    description: "Develop flagship toolkit for gaming accessories line. Include product visuals, packaging designs, and marketing assets.",
    badge: "Flagship toolkit",
    date: "30 Dec",
    comments: 14,
    avatars: 2,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-14",
    title: "Back to School Campaign",
    description: "Create promotional campaign for back to school season. Develop student-focused marketing materials and digital assets.",
    badge: "Promotional campaign",
    date: "2 Jan",
    comments: 10,
    avatars: 3,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-15",
    title: "Sustainability Initiative BAU",
    description: "Develop BAU assets for sustainability initiative. Create consistent messaging across all channels and markets.",
    badge: "BAU campaign",
    date: "4 Jan",
    comments: 8,
    avatars: 2,
    status: "In review",
    icon: (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5" />
      </svg>
    ),
  },
  {
    id: "brief-16",
    title: "Premium Audio Toolkit",
    description: "Create flagship toolkit for premium audio products launch. Include high-end visuals and marketing materials.",
    badge: "Flagship toolkit",
    date: "6 Jan",
    comments: 13,
    avatars: 3,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-17",
    title: "Holiday Gift Guide Campaign",
    description: "Develop promotional campaign for holiday gift guide. Create gift-focused marketing assets and seasonal visuals.",
    badge: "Promotional campaign",
    date: "8 Jan",
    comments: 9,
    avatars: 2,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
  {
    id: "brief-18",
    title: "Smart Home Integration BAU",
    description: "Create BAU assets for smart home integration products. Standard formats for retail and digital channels.",
    badge: "BAU campaign",
    date: "10 Jan",
    comments: 7,
    avatars: 3,
    status: "In review",
    icon: (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z" fill="#E5E5E5" />
      </svg>
    ),
  },
  {
    id: "brief-19",
    title: "Professional Display Toolkit",
    description: "Develop flagship toolkit for professional display solutions. Include B2B focused assets and technical marketing materials.",
    badge: "Flagship toolkit",
    date: "12 Jan",
    comments: 16,
    avatars: 2,
    status: "Draft",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z" fill="#FFB546" />
      </svg>
    ),
  },
];

export default function BriefsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [briefs, setBriefs] = useState<BriefSummary[]>(initialBriefs);
  const [isCreatingBrief, setIsCreatingBrief] = useState(false);
  const [briefView, setBriefView] = useState<"templates" | "form" | "deliverables" | "ai-response">("templates");
  const [aiInputText, setAiInputText] = useState("");
  const [newBriefDraft, setNewBriefDraft] = useState<NewBriefFormValues>(createBriefFormDefaults());
  const [fromCalculator, setFromCalculator] = useState(false);

  const draftBriefCount = useMemo(() => briefs.filter((brief) => brief.status === "Draft").length, [briefs]);
  const inReviewBriefCount = useMemo(() => briefs.filter((brief) => brief.status === "In review").length, [briefs]);
  const scopeReadyBriefCount = READY_TO_SIGN_SCOPES.length;

  const handleBriefSubmit = useCallback(
    (data: NewBriefFormValues) => {
      const projectLeadLabels = data.projectLead
        .map((leadValue) => PROJECT_LEADS.find((lead) => lead.value === leadValue)?.label)
        .filter((label): label is string => Boolean(label))
        .join(", ");
      const dueDateLabel = data.dueDate
        ? format(data.dueDate, "d MMM").toUpperCase()
        : format(new Date(), "d MMM").toUpperCase();

      const newBrief: BriefSummary = {
        id: `brief-${Date.now()}`,
        title: data.projectTitle.trim(),
        description: data.objective.trim() || "No objective provided.",
        badge: getBadgeFromTemplate(data.selectedTemplate),
        date: dueDateLabel,
        comments: 0,
        avatars: 1,
        status: "Draft",
        icon: <Icons.briefs size={16} className="text-[#FFB546]" />,
        projectLead: projectLeadLabels || undefined,
      };

      setBriefs((prev) => [newBrief, ...prev]);
      toast.success("Brief submitted successfully");
    },
    []
  );

  // Check if we should show the form directly from navigation state or reset to overview
  const [initialActiveTab, setInitialActiveTab] = useState<"All" | "Drafts" | "In review" | "Scope ready to sign" | undefined>(undefined);

  const [isChangeRequest, setIsChangeRequest] = useState(false);

  useEffect(() => {
    const state = location.state as {
      createBrief?: boolean;
      showForm?: boolean;
      resetToOverview?: boolean;
      brief?: NewBriefFormValues;
      submittedBrief?: SubmittedBriefPayload;
      selectedTemplate?: string;
      activeTab?: "All" | "Drafts" | "In review" | "Scope ready to sign";
      calculatorAssets?: Array<{
        id: string;
        title: string;
        tokens: number;
        quantity: number;
      }>;
      duplicateBrief?: Omit<NewBriefFormValues, "projectTitle" | "dueDate" | "projectLead" | "underNDA">;
      isChangeRequest?: boolean;
    } | null;

    if (!state) {
      setInitialActiveTab(undefined);
      return;
    }

    let shouldReplace = false;

    // Handle activeTab from navigation state
    if (state.activeTab) {
      setInitialActiveTab(state.activeTab);
      shouldReplace = true;
    }

    if (state.resetToOverview) {
      setIsCreatingBrief(false);
      setBriefView("templates");
      shouldReplace = true;
    }

    if (state.brief) {
      const normalizedDraft: NewBriefFormValues = {
        ...state.brief,
        dueDate: state.brief.dueDate ? new Date(state.brief.dueDate) : undefined,
      };
      setNewBriefDraft(normalizedDraft);
      setIsChangeRequest(state.isChangeRequest || false);
      shouldReplace = true;
    } else {
      setIsChangeRequest(false);
    }

    if (state.createBrief) {
      // Handle duplicate brief - populate all fields except General information
      if (state.duplicateBrief) {
        const draftWithDuplicate: NewBriefFormValues = {
          ...createBriefFormDefaults(),
          ...state.duplicateBrief,
          // Keep General information fields empty
          projectTitle: "",
          dueDate: undefined,
          projectLead: [],
          underNDA: false,
        };
        setNewBriefDraft(draftWithDuplicate);
        setFromCalculator(false);
      }
      // Convert calculator assets to SelectedAsset format and pre-populate form
      else if (state.calculatorAssets && state.calculatorAssets.length > 0) {
        const convertedAssets: SelectedAsset[] = state.calculatorAssets.map((calcAsset) => ({
          id: `calc-${calcAsset.id}`,
          name: calcAsset.title,
          description: calcAsset.title,
          tokenPrice: calcAsset.tokens,
          assetSpecification: "",
          deliveryWeek: "",
          quantity: calcAsset.quantity,
          isCustom: false,
        }));
        
        // Create new draft with assets pre-populated
        const draftWithAssets: NewBriefFormValues = {
          ...createBriefFormDefaults(),
          assets: convertedAssets,
          selectedTemplate: "other", // Set to "other" so "build-your-own" mode shows all assets
        };
        setNewBriefDraft(draftWithAssets);
        setFromCalculator(true);
      }
      // If brief data exists (e.g., from change request), don't overwrite it
      else if (!state.brief) {
        // Create draft with selected template if provided
        const draftDefaults = createBriefFormDefaults();
        if (state.selectedTemplate) {
          draftDefaults.selectedTemplate = state.selectedTemplate;
          // Add template assets
          const assetIds = TEMPLATE_ASSETS_MAP[state.selectedTemplate] || [];
          if (assetIds.length > 0 && state.selectedTemplate !== "other") {
            const templateAssets: SelectedAsset[] = assetIds.map((assetId) => {
              const assetData = CALCULATOR_ASSETS_LIST.find((a) => a.id === assetId);
              if (!assetData) return null;
              return {
                ...assetData,
                assetSpecification: "",
                deliveryWeek: "",
                quantity: assetId === "calc-11" ? 0 : 1, // Watermarked files starts at 0
                isCustom: false,
              };
            }).filter((asset) => asset !== null) as SelectedAsset[];
            draftDefaults.assets = templateAssets;
          }
        }
        setNewBriefDraft(draftDefaults);
        setFromCalculator(false);
      }
      // If state.brief exists, it was already set above, so we don't overwrite it
      
      setIsCreatingBrief(true);
      setBriefView(state.showForm ? "form" : "templates");
      shouldReplace = true;
    }

    if (state.submittedBrief) {
      const { title, objective, status, dueDate } = state.submittedBrief;
      const formattedDate = format(new Date(), "d MMM").toUpperCase();
      const briefStatus: BriefStatus = status === "in-review" ? "In review" : "Draft";

      const icon = status === "in-review"
        ? (
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.80101 10C10.9954 10 13.7962 8.32168 15.373 5.7988C15.6784 5.31037 15.6784 4.69046 15.373 4.2012C13.7962 1.67832 10.9954 0 7.80101 0C4.60663 0 1.80583 1.67832 0.229031 4.2012C-0.0763438 4.68963 -0.0763438 5.30954 0.229031 5.7988C1.80583 8.32168 4.60663 10 7.80101 10Z"
                fill="#E5E5E5"
              />
            </svg>
          )
        : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.58249 0H7.87085C9.84785 0 11.4533 1.60548 11.4533 3.58249V8.41751C11.4533 10.3945 9.84785 12 7.87085 12H3.58249C1.60549 12 0 10.3945 0 8.41751V3.58249C0 1.60548 1.60549 0 3.58249 0Z"
                fill="#FFB546"
              />
            </svg>
          );

      const newBrief: BriefSummary = {
        id: `brief-${Date.now()}`,
        title: title.trim() || "Untitled brief",
        description: objective.trim() || "No objective provided.",
        badge: "default",
        date: formattedDate,
        comments: 0,
        avatars: 3,
        status: briefStatus,
        icon,
      };

      setBriefs((prev) => [newBrief, ...prev]);
      setIsCreatingBrief(false);
      setBriefView("templates");
      shouldReplace = true;
    }

    if (shouldReplace) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const topbarRight = <DashboardTopbarRight />;

  const pageTitle = isCreatingBrief && briefView === "form" ? "New brief" : activeName;

  const titleNode = (
    isCreatingBrief && briefView === "form" ? (
      <div className="flex items-center gap-2">
        <button onClick={() => setBriefView("templates")} className="hover:opacity-70 transition">
          <ArrowLeft size={20} className="text-black" />
        </button>
        <span className="text-sm leading-[19.6px] text-black">{pageTitle}</span>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <Icons.briefs size={20} className="text-black" />
        <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
      </div>
    )
  );

  return (
    <DashboardLayout
      title={titleNode}
      onNavigate={(path) => {
        if (path === "/dashboard/briefs") {
          if (isCreatingBrief) {
            setIsCreatingBrief(false);
            setBriefView("templates");
            return;
          }
        }
        navigate(path);
      }}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      {/* Briefs Content */}
      <div className="px-4 md:px-6 pt-[24px] md:pt-[40px] pb-[24px] md:pb-[40px] max-w-full overflow-x-hidden">
          {isCreatingBrief ? (
            briefView === "templates" ? (
              <TemplateSelectionScreen 
                onCancel={() => setIsCreatingBrief(false)} 
                onCreateBrief={() => {
                  setNewBriefDraft(createBriefFormDefaults());
                  setBriefView("form");
                }}
              />
            ) : briefView === "form" ? (
              <NewBriefForm 
                onCancel={() => {
                  setBriefView("templates");
                  setNewBriefDraft(createBriefFormDefaults());
                  setFromCalculator(false);
                }} 
                onNext={() => setBriefView("deliverables")}
                onSubmit={handleBriefSubmit}
                initialValues={newBriefDraft}
                onFormDataChange={(data) => setNewBriefDraft({ ...data })}
                fromCalculator={fromCalculator}
                isChangeRequest={isChangeRequest}
              />
            ) : briefView === "deliverables" ? (
              <DeliverablesSelectionScreen 
                onCancel={() => setBriefView("form")}
                onBack={() => setBriefView("form")}
                onNavigateToAiResponse={(inputText) => {
                  setAiInputText(inputText);
                  setBriefView("ai-response");
                }}
                briefData={newBriefDraft}
              />
            ) : (
              <AIResponseScreen 
                userInput={aiInputText}
                onBack={() => setBriefView("deliverables")}
                onCancel={() => setBriefView("form")}
                briefData={newBriefDraft}
                onGoToReview={() => navigate("/dashboard/briefs/review", { state: { brief: newBriefDraft } })}
              />
            )
          ) : (
            <div className="space-y-6 md:space-y-10">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:items-center">
                <div className="flex flex-col gap-1 md:text-center lg:text-left">
                  <h1 className="h1-heading text-2xl md:text-h1 text-black">Briefs overview</h1>
                  <p className="text-sm md:text-body text-black">Kickstart your next project with clarity and ease</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center md:justify-center lg:justify-start">
                  <button
                    onClick={() => navigate("/dashboard/calculator")}
                    className="btn w-full sm:w-[216px] h-[48px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
                  >
                    <Icons.calculator size={16} className="text-black" />
                    <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      Quick calculator
                    </span>
                  </button>
                  <button 
                    onClick={() => {
                      setNewBriefDraft(createBriefFormDefaults());
                      setIsCreatingBrief(true);
                      setBriefView("templates");
                    }}
                    className="btn w-full sm:w-[216px] h-[48px] backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] py-[18px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
                  >
                    <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">
                      Create brief
                    </span>
                    <svg className="h-[14px] w-[15.567px]" width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#000"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { 
                    title: "In draft",
                    titleBold: true,
                    value: draftBriefCount,
                    icon: (
                      <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M33.3775 0H6.62252C2.96358 0 0 2.96358 0 6.62252V36.7881C0 40.447 2.96358 43.4106 6.62252 43.4106H33.3775C37.0364 43.4106 40 40.447 40 36.7881V6.62252C40 2.96358 37.0364 0 33.3775 0ZM29.8758 34.3295H10.1159C8.75829 34.3295 7.66556 33.2285 7.66556 31.8791C7.66556 30.5215 8.76656 29.4288 10.1159 29.4288H29.8758C31.2334 29.4288 32.3262 30.5298 32.3262 31.8791C32.3262 33.2368 31.2252 34.3295 29.8758 34.3295ZM29.8758 24.1557H10.1159C8.75829 24.1557 7.66556 23.0547 7.66556 21.7053C7.66556 20.3477 8.76656 19.255 10.1159 19.255H29.8758C31.2334 19.255 32.3262 20.356 32.3262 21.7053C32.3262 23.0629 31.2252 24.1557 29.8758 24.1557ZM29.8758 13.9818H10.1159C8.75829 13.9818 7.66556 12.8808 7.66556 11.5315C7.66556 10.1739 8.76656 9.08115 10.1159 9.08115H29.8758C31.2334 9.08115 32.3262 10.1822 32.3262 11.5315C32.3262 12.8891 31.2252 13.9818 29.8758 13.9818Z" fill="#FFB546"/>
                      </svg>
                    ),
                    onClick: () => setInitialActiveTab("Drafts")
                  },
                  { 
                    title: "In review",
                    titleBold: true,
                    value: inReviewBriefCount,
                    icon: (
                      <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                      <path d="M4.125 16.6961C3.95833 16.247 3.95833 15.753 4.125 15.3039C5.74832 11.3673 8.50381 8.00137 12.0421 5.63288C15.5805 3.26439 19.7423 2 24 2C28.2577 2 32.4195 3.26439 35.9579 5.63288C39.4962 8.00137 42.2517 11.3673 43.875 15.3039C44.0417 15.753 44.0417 16.247 43.875 16.6961C42.2517 20.6327 39.4962 23.9986 35.9579 26.3671C32.4195 28.7356 28.2577 30 24 30C19.7423 30 15.5805 28.7356 12.0421 26.3671C8.50381 23.9986 5.74832 20.6327 4.125 16.6961Z" stroke="#18c3b1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M24 22.0005C27.3135 22.0005 29.9997 19.314 29.9997 16C29.9997 12.686 27.3135 9.99947 24 9.99947C20.6865 9.99947 18.0003 12.686 18.0003 16C18.0003 19.314 20.6865 22.0005 24 22.0005Z" stroke="#18c3b1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    onClick: () => setInitialActiveTab("In review")
                  },
                  { 
                    title: "Scope ready to sign",
                    titleBold: true,
                    value: scopeReadyBriefCount,
                    icon: (
                      <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-5 top-5">
                        <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#03B3E2"/>
                      </svg>
                    )
                  },
                ].map((card) => {
                  const isScopeCard = card.title === "Scope ready to sign";
                  const isDraftCard = card.title === "In draft";
                  const isReviewCard = card.title === "In review";
                  
                  // Determine border color based on card type
                  let borderClass = "";
                  if (isScopeCard) {
                    borderClass = "border-[3px] border-[#03B3E2] rounded-xl";
                  } else if (isDraftCard) {
                    borderClass = "border-[3px] border-[#FFB546] rounded-xl";
                  } else if (isReviewCard) {
                    borderClass = "border-[3px] border-[#18c3b1] rounded-xl";
                  }
                  
                  if (isScopeCard) {
                    return (
                      <button
                        key={card.title}
                        onClick={() => navigate("/dashboard/scope")}
                        className={`card-brief cb2 relative overflow-hidden hover:opacity-90 transition cursor-pointer w-full text-left ${borderClass}`}
                      >
                        <StatCard title={card.title} value={card.value} className="rounded-xl p-6 border-0" titleBold={card.titleBold} />
                        {card.icon}
                      </button>
                    );
                  }
                  
                  if (card.onClick) {
                  return (
                      <button
                        key={card.title}
                        onClick={card.onClick}
                        className={`card-brief cb2 relative overflow-hidden hover:opacity-90 transition cursor-pointer w-full text-left ${borderClass}`}
                      >
                      <StatCard title={card.title} value={card.value} className="rounded-xl p-6 border-0" titleBold={card.titleBold} />
                      {card.icon}
                      </button>
                    );
                  }
                  
                    return (
                    <div key={card.title} className={`relative overflow-hidden ${borderClass}`}>
                      <StatCard title={card.title} value={card.value} className="rounded-xl p-6 border-0" titleBold={card.titleBold} />
                      {card.icon}
                            </div>
                                  );
                                })}
              </div>

              {/* All briefs */}
              <AllBriefsSection 
                briefs={briefs} 
                initialTab={initialActiveTab}
                onTabChange={(tab) => setInitialActiveTab(tab)}
                onOpenDraftForm={(brief) => {
                  // Convert BriefSummary to NewBriefFormValues
                  let parsedDate: Date | undefined = undefined;
                  if (brief.date) {
                    try {
                      // Parse date format like "15 Dec" - need to add current year
                      const currentYear = new Date().getFullYear();
                      const dateWithYear = `${brief.date} ${currentYear}`;
                      parsedDate = parse(dateWithYear, "d MMM yyyy", new Date());
                      // If parsing fails or date is invalid, set to undefined
                      if (isNaN(parsedDate.getTime())) {
                        parsedDate = undefined;
                      }
                    } catch (e) {
                      parsedDate = undefined;
                    }
                  }
                  
                  const formValues: NewBriefFormValues = {
                    projectTitle: brief.title,
                    dueDate: parsedDate,
                    projectLead: brief.projectLead 
                      ? PROJECT_LEADS.filter(lead => brief.projectLead?.includes(lead.label)).map(lead => lead.value)
                      : [],
                    underNDA: false,
                    objective: brief.description,
                    targetAudience: "",
                    workType: [],
                    channels: [],
                    expectedOutputs: [],
                    briefSummary: "",
                    assets: [],
                    selectedTemplate: brief.badge === "Promotional campaign" ? "promotional-campaign" :
                                   brief.badge === "BAU campaign" ? "bau-campaign" :
                                   brief.badge === "Flagship toolkit" ? "flagship-campaign" : "other",
                    additionalAssetDetails: "",
                    watermarkFiles: false,
                    attachedDocuments: [],
                  };
                  setNewBriefDraft(formValues);
                  setIsCreatingBrief(true);
                  setBriefView("form");
                }}
              />
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}

function TemplateSelectionScreen({ onCancel, onCreateBrief }: { onCancel: () => void; onCreateBrief: () => void }) {
  const navigate = useNavigate();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // Use the new template options
  const templates = FORM_TEMPLATE_OPTIONS;

  const handleTemplateClick = (templateId: string) => {
    // Navigate to form with template pre-selected
    navigate("/dashboard/briefs", { 
      state: { 
        createBrief: true, 
        showForm: true,
        selectedTemplate: templateId 
      } 
    });
  };

  return (
    <div className="flex flex-col gap-20 items-center justify-center w-full py-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="h1-heading text-h1 text-black text-center">
            Write your next brief in minutes
          </h1>
          <p className="text-sm leading-[18.62px] text-black text-center max-w-[600px]">
          Use our smart briefing template to get started, or upload an existing brief and we’ll auto-populate the fields for you ensuring a streamlined, friction-free setup
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 items-center w-full">
          {/* Create Brief Button - Centered */}
          <button 
            onClick={onCreateBrief}
            className="btn w-full sm:w-[216px] h-[48px] backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] py-[18px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition"
          >
            <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">
              Create brief
            </span>
            <svg className="h-[14px] w-[15.567px]" width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#000"></path></svg>
          </button>

          {/* Upload existing brief - below Create button */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="text-sm leading-[18.62px] text-black text-center">
             
            </p>
            <input ref={uploadInputRef} type="file" className="hidden" />
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="btn w-full sm:w-[216px] h-[48px] bg-[#03b3e2] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-[10px] px-[24px] py-[18px] hover:opacity-90 transition"
            >
              <div className="overflow-clip relative shrink-0 size-[20px]">
                <svg className="h-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path d="M18.5 20L18.5 14M18.5 14L21 16.5M18.5 14L16 16.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V11" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">
                Upload brief
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="flex flex-col gap-6 items-start max-w-[610px] w-full">
        {/* Section Header */}
        <div className="flex flex-col gap-1 px-6">
          <h2 className="text-lg font-bold leading-[23.94px] text-black">Browse our templates collection</h2>
          <p className="text-sm leading-[18.62px] text-black">Kickstart your brief with a ready-made template.</p>
        </div>

        {/* Template Cards */}
        <div className="flex flex-col gap-4 px-6 w-full">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template.id)}
              className="hover-brief relative overflow-hidden border border-[#e0e0e0] rounded-xl p-4 text-left hover:bg-[#f9f9f9] transition relative w-full group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold leading-[23.94px] text-black">{template.title}</h3>
                <div className={`brief-icon`}>
                   <div
                      className="template-icon"
                      dangerouslySetInnerHTML={{ __html: template.icon }}
                    />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate Past Briefs Section */}
      <div className="flex flex-col gap-6 items-start max-w-[610px] w-full">
        {/* Section Header */}
        <div className="flex flex-col gap-1 px-6">
          <h2 className="text-lg font-bold leading-[23.94px] text-black">Duplicate past briefs</h2>
          <p className="text-sm leading-[18.62px] text-black">Start from a previous brief and customize it for your new project.</p>
        </div>

        {/* Past Briefs List */}
        <div className="flex flex-col gap-4 px-6 w-full">
          {PAST_BRIEFS.map((pastBrief) => (
            <div
              key={pastBrief.id}
              className="border border-[#e0e0e0] rounded-xl p-4 hover:bg-[#f9f9f9] transition relative w-full"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold leading-[23.94px] text-black">{pastBrief.title}</h3>
                <button
                  onClick={() => {
                    navigate("/dashboard/briefs", {
                      state: {
                        createBrief: true,
                        showForm: true,
                        duplicateBrief: pastBrief.data,
                      },
                    });
                  }}
                  className="px-4 py-2 bg-[#03b3e2] text-black hover:opacity-90 rounded-[28px] transition text-sm font-semibold whitespace-nowrap"
                >
                  Duplicate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewBriefForm({
  onCancel,
  onNext,
  onSubmit,
  initialValues,
  onFormDataChange,
  fromCalculator = false,
  isChangeRequest = false,
}: {
  onCancel: () => void;
  onNext: () => void;
  onSubmit: (data: NewBriefFormValues) => void;
  initialValues: NewBriefFormValues;
  onFormDataChange: (data: NewBriefFormValues) => void;
  fromCalculator?: boolean;
  isChangeRequest?: boolean;
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewBriefFormValues>(initialValues);
  const [originalBriefData, setOriginalBriefData] = useState<NewBriefFormValues | null>(isChangeRequest ? initialValues : null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSaveDraftConfirmation, setShowSaveDraftConfirmation] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showCustomAssetFields, setShowCustomAssetFields] = useState(false);
  const [customAssetDraft, setCustomAssetDraft] = useState({ name: "", description: "", quantity: 1 });
  const [assetsWithDetails, setAssetsWithDetails] = useState<string[]>([]);
  const [assetsToShow, setAssetsToShow] = useState(10);
  const [additionalAssetsLoaded, setAdditionalAssetsLoaded] = useState(0);
  const [pendingDraftPayload, setPendingDraftPayload] = useState<SubmittedBriefPayload | null>(null);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});
  const [deliverableSelectionMode, setDeliverableSelectionMode] = useState<"template" | "build-your-own">(fromCalculator ? "build-your-own" : "template");
  const changeRequestMode = Boolean(isChangeRequest);
  const tokenEstimate = useMemo(
    () => formData.assets
      .filter((asset) => !asset.isCustom)
      .reduce((total, asset) => total + asset.tokenPrice * asset.quantity, 0),
    [formData.assets]
  );

  const [previousTotal, setPreviousTotal] = useState(0);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [displayTokens, setDisplayTokens] = useState(0);
  const [displayPounds, setDisplayPounds] = useState(0);
  const coinAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle coin animation when total changes
  useEffect(() => {
    if (tokenEstimate !== previousTotal) {
      const totalPounds = tokenEstimate * 4.502;
      
      if (previousTotal > 0 && tokenEstimate > previousTotal) {
        // Asset added or quantity increased - show coin animation
        setShowCoinAnimation(true);
        setDisplayTokens(previousTotal);
        setDisplayPounds(previousTotal * 4.502);
        
        // Animate numbers from previous to new total
        const duration = 500; // 500ms animation
        const steps = 30;
        const stepDuration = duration / steps;
        const tokenIncrement = (tokenEstimate - previousTotal) / steps;
        const poundIncrement = (totalPounds - previousTotal * 4.502) / steps;
        let currentStep = 0;
        
        const animateNumbers = () => {
          currentStep++;
          const newTokenValue = Math.round(previousTotal + tokenIncrement * currentStep);
          const newPoundValue = Math.round(previousTotal * 4.502 + poundIncrement * currentStep);
          setDisplayTokens(newTokenValue);
          setDisplayPounds(newPoundValue);
          
          if (currentStep < steps) {
            setTimeout(animateNumbers, stepDuration);
          } else {
            setDisplayTokens(tokenEstimate);
            setDisplayPounds(totalPounds);
            // Hide coin after number animation completes
            if (coinAnimationTimeoutRef.current) {
              clearTimeout(coinAnimationTimeoutRef.current);
            }
            coinAnimationTimeoutRef.current = setTimeout(() => {
              setShowCoinAnimation(false);
            }, 200);
          }
        };
        
        // Start number animation after coin slides in (300ms)
        setTimeout(animateNumbers, 300);
      } else {
        // Asset removed, quantity decreased, or initial state - just update numbers, no coin
        setDisplayTokens(tokenEstimate);
        setDisplayPounds(totalPounds);
        setShowCoinAnimation(false);
      }
    }
    
    // Update previous total after handling animation
    if (tokenEstimate !== previousTotal) {
      setPreviousTotal(tokenEstimate);
    }
    
    return () => {
      if (coinAnimationTimeoutRef.current) {
        clearTimeout(coinAnimationTimeoutRef.current);
      }
    };
  }, [tokenEstimate, previousTotal]);

  const hasCustomAssets = useMemo(
    () => formData.assets.some((asset) => asset.isCustom),
    [formData.assets]
  );

  const selectedTemplateName = useMemo(
    () => FORM_TEMPLATE_OPTIONS.find((option) => option.id === formData.selectedTemplate)?.title || "",
    [formData.selectedTemplate]
  );

  const assetsToDisplay = useMemo(() => {
    const customAssets = formData.assets.filter((a) => a.isCustom === true);
    const selectedTemplate = formData.selectedTemplate;
    const templateAssetIds = selectedTemplate ? TEMPLATE_ASSETS_MAP[selectedTemplate] || [] : [];
    
    if (fromCalculator) {
      const calculatorAssets = formData.assets.filter(
        (a) => a.isCustom !== true && a.id.startsWith('calc-')
      );
      return [...calculatorAssets, ...customAssets];
    } else if (deliverableSelectionMode === "build-your-own" || selectedTemplate === "other") {
      // Show all assets when "build-your-own" mode is active, same as Calculator
      return [...RECOMMENDED_ASSETS, ...customAssets];
    } else if (selectedTemplate && templateAssetIds.length > 0) {
      const templateAssets = CALCULATOR_ASSETS_LIST
        .filter((a) => templateAssetIds.includes(a.id))
        .map((a) => getAssetWithTemplatePrice(a, selectedTemplate));
      return [...templateAssets, ...customAssets];
    } else {
      return [...RECOMMENDED_ASSETS.slice(0, assetsToShow), ...customAssets];
    }
  }, [formData.assets, formData.selectedTemplate, fromCalculator, assetsToShow, deliverableSelectionMode]);

  const isFormComplete =
    formData.projectTitle.trim() !== "" &&
    formData.dueDate !== undefined && 
    formData.projectLead.length > 0 &&
    (formData.assets.length > 0 || (formData.selectedTemplate && formData.selectedTemplate !== ""));

  // Check if project title matches "New Year 2026" or similar pattern
  const hasDuplicateTitle = useMemo(() => {
    const title = formData.projectTitle.trim().toLowerCase();
    if (!title) return false;
    
    // Check for "New Year 2026" or similar patterns (e.g., "New Year 2026", "New Year Launch 2026")
    const newYearPattern = /new\s*year.*2026/i;
    return newYearPattern.test(title);
  }, [formData.projectTitle]);

  const handleFieldChange = (field: keyof NewBriefFormValues, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectToggle = (field: "channels" | "expectedOutputs" | "workType" | "projectLead", value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const exists = currentValues.includes(value);
      const updated = exists ? currentValues.filter((item) => item !== value) : [...currentValues, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleAddAsset = (asset: RecommendedAsset) => {
    setFormData((prev) => {
      const existingAsset = prev.assets.find((a) => a.id === asset.id);
      const isWatermarked = asset.id === "calc-11";
      
      if (existingAsset) {
        if (isWatermarked) {
          // Toggle checkbox for watermarked files
          return {
            ...prev,
            assets: prev.assets.map((a) => (a.id === asset.id ? { ...a, quantity: a.quantity === 0 ? 1 : 0 } : a)),
          };
        } else {
        return {
          ...prev,
          assets: prev.assets.map((a) => (a.id === asset.id ? { ...a, quantity: a.quantity + 1 } : a)),
        };
        }
      }
      return {
        ...prev,
        assets: [
          ...prev.assets,
          {
            ...asset,
            assetSpecification: "",
            deliveryWeek: "",
            quantity: isWatermarked ? 1 : 1,
          },
        ],
      };
    });
    // Clear any input state for this asset when adding
    setQuantityInputs((prev) => {
      const next = { ...prev };
      delete next[asset.id];
      return next;
    });
  };

  const handleAssetFieldChange = (assetId: string, field: "assetSpecification" | "deliveryWeek", value: string) => {
    setFormData((prev) => ({
      ...prev,
      assets: prev.assets.map((asset) => (asset.id === assetId ? { ...asset, [field]: value } : asset)),
    }));
  };

  const handleAssetQuantityChange = (assetId: string, delta: number) => {
    setFormData((prev) => {
      const updatedAssets = prev.assets.map((asset) => {
        if (asset.id === assetId) {
          const newQuantity = asset.quantity + delta;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...asset, quantity: newQuantity };
        }
        return asset;
      }).filter((asset) => asset !== null) as SelectedAsset[];
      
      // Remove from details if quantity becomes 0
      if (delta < 0) {
        const asset = prev.assets.find((a) => a.id === assetId);
        if (asset && asset.quantity + delta <= 0) {
          setAssetsWithDetails((prevDetails) => prevDetails.filter((id) => id !== assetId));
          setQuantityInputs((prevInputs) => {
            const next = { ...prevInputs };
            delete next[assetId];
            return next;
          });
        }
      }
      
      return { ...prev, assets: updatedAssets };
    });
    // Clear input state when using +/- buttons
    setQuantityInputs((prev) => {
      const next = { ...prev };
      delete next[assetId];
      return next;
    });
  };

  const handleAssetQuantityInput = (assetId: string, value: string) => {
    // Update the input value state
    setQuantityInputs((prev) => ({ ...prev, [assetId]: value }));
    
    const numValue = parseInt(value, 10);
    // Only update quantity if it's a valid number >= 1
    if (value !== "" && !isNaN(numValue) && numValue >= 1) {
      setFormData((prev) => {
        const updatedAssets = prev.assets.map((asset) => {
          if (asset.id === assetId) {
            return { ...asset, quantity: numValue };
          }
          return asset;
        });
        
        return { ...prev, assets: updatedAssets };
      });
    }
  };

  const handleAssetQuantityBlur = (assetId: string, value: string) => {
    const numValue = parseInt(value.trim(), 10);
    // Clear the input state
    setQuantityInputs((prev) => {
      const next = { ...prev };
      delete next[assetId];
      return next;
    });
    
    if (value.trim() === "" || isNaN(numValue) || numValue <= 0) {
      // Remove asset if input is empty or invalid
      handleRemoveAsset(assetId);
      setAssetsWithDetails((prev) => prev.filter((id) => id !== assetId));
    } else {
      // Ensure quantity is set to the valid number
      setFormData((prev) => {
        const updatedAssets = prev.assets.map((asset) => {
          if (asset.id === assetId) {
            return { ...asset, quantity: numValue };
          }
          return asset;
        });
        
        return { ...prev, assets: updatedAssets };
      });
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        attachedDocuments: [...prev.attachedDocuments, ...files],
      }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachedDocuments: prev.attachedDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAsset = (assetId: string) => {
    setFormData((prev) => ({
      ...prev,
      assets: prev.assets.filter((asset) => asset.id !== assetId),
    }));
    setAssetsWithDetails((prev) => prev.filter((id) => id !== assetId));
    setQuantityInputs((prev) => {
      const next = { ...prev };
      delete next[assetId];
      return next;
    });
  };

  const handleClearAllAssets = () => {
    setFormData((prev) => ({
      ...prev,
      assets: [],
    }));
    setAssetsWithDetails([]);
    setQuantityInputs({});
  };

  const handleAddCustomAsset = () => {
    if (!customAssetDraft.name.trim()) {
      return;
    }

    const id = `custom-${Date.now()}`;
    const quantity = customAssetDraft.quantity > 0 ? customAssetDraft.quantity : 1;
    const newAsset: SelectedAsset = {
      id,
      name: customAssetDraft.name.trim(),
      description: customAssetDraft.description.trim() || "Custom asset",
      tokenPrice: DEFAULT_CUSTOM_ASSET_PRICE,
      assetSpecification: customAssetDraft.description.trim(),
      deliveryWeek: "",
      quantity: quantity,
      isCustom: true,
    };

    setFormData((prev) => ({
      ...prev,
      assets: [...prev.assets, newAsset],
    }));
    setCustomAssetDraft({ name: "", description: "", quantity: 1 });
    setShowCustomAssetFields(false);
    setAssetsWithDetails((prev) => [...prev, id]);
  };

  const renderedAssets = useMemo(() => {
    return assetsToDisplay.map((asset, index) => {
      const selectedAsset = formData.assets.find((a) => a.id === asset.id);
      const quantity = selectedAsset?.quantity || 0;
      const showDetails = assetsWithDetails.includes(asset.id);
      const isCustom = 'isCustom' in asset && asset.isCustom === true;
      const isWatermarked = asset.id === "calc-11";
      const isChecked = isWatermarked && quantity > 0;
      const totalTokens = quantity > 0 && selectedAsset && !isCustom ? selectedAsset.tokenPrice * (isWatermarked ? 1 : quantity) : 0;

      return (
        <div key={asset.id}>
          <div className="flex items-center justify-between px-4 md:px-6 py-2 w-full">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-4">
              <p className="text-sm leading-[18.62px] text-black truncate">{asset.name}</p>
              {!isCustom && (
                <p className="text-[16.24px] leading-[14px] text-black">
                  {asset.tokenPrice} {asset.tokenPrice === 1 ? "token" : "tokens"}
                </p>
              )}
              {isCustom && (
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle size={14} className="text-[#848487] cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[300px]">
                          IRIS will review this asset and provide token price for it. You will be informed once this is done.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              {(quantity > 0 || isWatermarked) && (
                <button
                  onClick={() => {
                    if (isWatermarked && !isChecked) {
                      handleAddAsset(asset);
                    }
                    setAssetsWithDetails((prev) => (prev.includes(asset.id) ? prev.filter((id) => id !== asset.id) : [...prev, asset.id]));
                  }}
                  className="text-xs text-[#03B3E2] hover:underline text-left mt-1"
                >
                  {showDetails ? "Hide details" : "Add details"}
                </button>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-2 md:gap-4">
                {isWatermarked ? (
                  <button
                    onClick={() => handleAddAsset(asset)}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center transition ${
                      isChecked
                        ? "bg-[#03B3E2] border-[#03B3E2]"
                        : "bg-white border-[#e0e0e0] hover:border-[#03B3E2]"
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ) : (
                  <>
                    {quantity > 0 && (
                      <>
                        <button 
                          onClick={() => {
                            if (quantity === 1) {
                              handleRemoveAsset(asset.id);
                              setAssetsWithDetails((prev) => prev.filter((id) => id !== asset.id));
                            } else {
                              handleAssetQuantityChange(asset.id, -1);
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-[#03B3E2] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                        >
                          <span className="text-[#fff] text-lg">−</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <StyledInput
                            type="number"
                            min="1"
                            value={quantityInputs[asset.id] !== undefined ? quantityInputs[asset.id] : (quantity > 0 ? quantity.toString() : "")}
                            onChange={(e) => handleAssetQuantityInput(asset.id, e.target.value)}
                            onBlur={(e) => handleAssetQuantityBlur(asset.id, e.target.value)}
                            className="w-12 h-8 text-sm font-bold text-black text-center border-[#e0e0e0] rounded-lg bg-[#f9f9f9] px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          {isCustom && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle size={14} className="text-[#848487] cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-[300px]">
                                    IRIS will review this asset and provide token price for it. You will be informed once this is done.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </>
                    )}
                    {!isCustom && (
                      <button
                        onClick={() => handleAddAsset(asset)}
                        className="w-8 h-8 rounded-full bg-[#f1f1f3] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                      >
                        <svg className="w-[17.778px] h-[17.778px]" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M13.0631 6.30331H7.41491V0.655165C7.41491 0.348498 7.16602 0.0996094 6.85936 0.0996094C6.55269 0.0996094 6.3038 0.348498 6.3038 0.655165V6.30331H0.655653C0.348987 6.30331 0.100098 6.5522 0.100098 6.85887C0.100098 7.16554 0.348987 7.41442 0.655653 7.41442H6.3038V13.0626C6.3038 13.3692 6.55269 13.6181 6.85936 13.6181C7.16602 13.6181 7.41491 13.3692 7.41491 13.0626V7.41442H13.0631C13.3697 7.41442 13.6186 7.16554 13.6186 6.85887C13.6186 6.5522 13.3697 6.30331 13.0631 6.30331Z" fill="#03B3E2" stroke="#03B3E2" strokeWidth="0.2"/>
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
              {quantity > 0 && !isCustom && (
                <p className="text-[16.24px] leading-[14px] text-black">
                  {totalTokens} {totalTokens === 1 ? "token" : "tokens"} total
                </p>
              )}
            </div>
          </div>
          {showDetails && quantity > 0 && selectedAsset && (
            <div className="px-4 md:px-6 pb-4 space-y-4 border-t border-[#e0e0e0] mt-2 pt-4">
              <Field label="Description" helpText="Describe deliverable expectations">
                <Textarea
                  value={selectedAsset.assetSpecification}
                  onChange={(e) => handleAssetFieldChange(asset.id, "assetSpecification", e.target.value)}
                  className="border-[#e0e0e0] rounded-lg px-4 py-2 min-h-[70px] bg-[#f9f9f9] text-black placeholder:text-[#848487]"
                  placeholder="Formats, ratios, markets..."
                />
              </Field>
              <Field label="Delivery week" helpText="Which sprint/week should Iris target?">
                <StyledInput
                  value={selectedAsset.deliveryWeek}
                  onChange={(e) => handleAssetFieldChange(asset.id, "deliveryWeek", e.target.value)}
                  placeholder="Week 32"
                />
              </Field>
            </div>
          )}
          {index < assetsToDisplay.length - 1 && (
            <div className="h-px bg-[#e0e0e0] mt-5 mx-4 md:mx-6" />
          )}
        </div>
      );
    });
  }, [assetsToDisplay, formData.assets, assetsWithDetails, quantityInputs, handleAddAsset, handleRemoveAsset, handleAssetQuantityChange, handleAssetQuantityInput, handleAssetQuantityBlur, handleAssetFieldChange]);

  const handleSubmit = () => {
    if (!isFormComplete) {
      return;
    }

    onSubmit(formData);
    const reset = createBriefFormDefaults();
    setFormData(reset);
    setAssetsWithDetails([]);
    setQuantityInputs({});
    onFormDataChange(reset);
    setShowConfirmation(true);
    setPreviewOpen(false);
  };

  const handleReviewBrief = () => {
    if (!isFormComplete) {
      return;
    }

    setPreviewOpen(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    const assetIds = TEMPLATE_ASSETS_MAP[templateId] || [];
    
    setFormData((prev) => {
      // Remove assets that were added by previous template (but keep custom assets)
      const customAssets = prev.assets.filter((a) => a.isCustom === true);
      const templateAssets = prev.assets.filter((a) => a.isCustom !== true && TEMPLATE_ASSETS_MAP[prev.selectedTemplate]?.includes(a.id));
      
      // If "Other" template, show all assets but don't auto-add them
      if (templateId === "other") {
        return { ...prev, selectedTemplate: templateId, assets: customAssets };
      }
      
      // For other templates, add the template assets
      const newAssets: SelectedAsset[] = assetIds.map((assetId) => {
        const existingAsset = prev.assets.find((a) => a.id === assetId);
        const assetData = CALCULATOR_ASSETS_LIST.find((a) => a.id === assetId);
        
        if (!assetData) return null;
        
        return {
          ...assetData,
          assetSpecification: existingAsset?.assetSpecification || "",
          deliveryWeek: existingAsset?.deliveryWeek || "",
          quantity: existingAsset?.quantity || (assetId === "calc-11" ? 0 : 1), // Watermarked files starts at 0 (checkbox)
          isCustom: false,
        };
      }).filter((asset) => asset !== null) as SelectedAsset[];
      
      return {
        ...prev,
        selectedTemplate: templateId,
        assets: [...customAssets, ...newAssets],
      };
    });
  };

  const handleChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as NewBriefFormValues;
      onFormDataChange(next);
      return next;
    });
  };

  useEffect(() => {
    setFormData(initialValues);
    // Update original brief data when initial values change in change request mode
    if (isChangeRequest && !originalBriefData) {
      setOriginalBriefData(initialValues);
    }
  }, [initialValues, isChangeRequest, originalBriefData]);
  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  const handleViewAllBriefsFromSave = () => {
    setShowSaveDraftConfirmation(false);
    if (pendingDraftPayload) {
      navigate("/dashboard/briefs", { state: { submittedBrief: pendingDraftPayload } });
      setPendingDraftPayload(null);
    } else {
      navigate("/dashboard/briefs", { state: { resetToOverview: true } });
    }
  };

  const handleSaveDraft = () => {
    const payload: SubmittedBriefPayload = {
      title: formData.projectTitle || "Untitled brief",
      objective: formData.objective,
      status: "draft",
      dueDate: formData.dueDate ? formData.dueDate.toISOString() : undefined,
    };
    setPendingDraftPayload(payload);
    setShowSaveDraftConfirmation(true);
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  const hasFormProgress =
    formData.projectTitle.trim() !== "" ||
    Boolean(formData.dueDate) ||
    formData.projectLead.length > 0 ||
    formData.objective.trim() !== "";

  const formattedDueDate = formData.dueDate ? format(formData.dueDate, "MMMM d, yyyy") : "";
  const projectLeadLabel = formData.projectLead.length > 0
    ? formData.projectLead
        .map((leadValue) => PROJECT_LEADS.find((lead) => lead.value === leadValue)?.label)
        .filter((label): label is string => Boolean(label))
        .join(", ")
    : "";

  // Shared preview card
  const renderPreviewPanel = () => (
    <BriefPreviewPanel
      projectTitle={formData.projectTitle}
      launchDate={formattedDueDate}
      projectLead={projectLeadLabel}
      objective={formData.objective.trim()}
    />
  );

  return (
    <>
      {formData.underNDA && (
        <div className="mb-4 rounded-xl border border-[#ffb546] bg-[#fff8ec] p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#ffb546] shrink-0 mt-0.5" />
          <p className="text-sm text-black">
            Heads up: This is NDA brief: Please ensure all communications reference the approved code word.
          </p>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 overflow-x-hidden pb-56 md:pb-24">
        <div className="flex-1 space-y-6 min-w-0 max-w-full">
          <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-6 max-w-full min-w-0">
            <div className="flex flex-col gap-2">
              <h3 className="text-[21.6px] font-semibold text-black">General information</h3>
              <p className="text-sm text-[#424242]">Start your brief by filling out these required fields.</p>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Checkbox
                id="under-nda"
                checked={formData.underNDA}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    underNDA: checked === true,
                  }));
                }}
                className="mt-0"
              />
              <label
                htmlFor="under-nda"
                className="text-sm font-medium text-black cursor-pointer"
              >
                Under NDA
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            <div className="flex flex-col gap-2">
              <Field label="Project title*" helpText="Enter a descriptive name that clearly identifies your project and campaign">
                <StyledInput
                  value={formData.projectTitle}
                    onChange={(e) => handleFieldChange("projectTitle", e.target.value)}
                  placeholder="Project name - Campaign name - Year"
                  variant="brief"
                />
              </Field>
              {hasDuplicateTitle && (
                <div className="flex items-start gap-2 px-1">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 leading-[18.62px]">
                    A brief or project with a similar title already exists. Please check with your manager or other departments.
                  </p>
                </div>
              )}
            </div>
            <DateField
                label="Delivery date*"
                helpText="Select the target completion date for this project"
              value={formData.dueDate}
                onChange={(date) => handleFieldChange("dueDate", date)}
              />
              <ProjectLeadMultiSelect
                label="Project lead*"
                helpText="Who will lead this project? *You can assign multiple leads"
                selectedValues={formData.projectLead}
                onToggle={(value) => handleMultiSelectToggle("projectLead", value)}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-6 max-w-full min-w-0">
            <div className="flex flex-col gap-2">
              <h3 className="text-[21.6px] font-semibold text-black">Project description</h3>
              <p className="text-sm text-[#424242]">Help Iris understand the context behind this request.</p>
            </div>
            <Field label="Brief summary" helpText="">
              <Textarea
                value={formData.briefSummary}
                onChange={(e) => handleFieldChange("briefSummary", e.target.value)}
                placeholder="Please summarise briefly what you are requesting from an agency"
                className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[90px] resize-none bg-[#f9f9f9] text-black placeholder:text-[#848487]"
              />
            </Field>

            <Field label="Objective" helpText="">
              <Textarea
                value={formData.objective}
                onChange={(e) => handleFieldChange("objective", e.target.value)}
                placeholder="e.g. Increase signups by 20% through targeted ads"
                className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[110px] resize-none bg-[#f9f9f9] text-black placeholder:text-[#848487]"
              />
            </Field>

            <Field label="Target audience" helpText="">
              <StyledInput
                value={formData.targetAudience}
                onChange={(e) => handleFieldChange("targetAudience", e.target.value)}
                placeholder="Who is this activity intended to appeal to."
                variant="brief"
              />
            </Field>

            {/* Work type and other fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
              <MultiSelectDropdown
                label="Work type"
                placeholder="Choose work types"
                options={WORK_TYPE_OPTIONS}
                selectedValues={formData.workType}
                onToggle={(value) => handleMultiSelectToggle("workType", value)}
              />
              <MultiSelectDropdown
                label="Channels"
                placeholder="Choose channels"
                options={CHANNEL_OPTIONS}
                selectedValues={formData.channels}
                onToggle={(value) => handleMultiSelectToggle("channels", value)}
              />
              <MultiSelectDropdown
                label="Expected outputs"
                placeholder="Select outputs"
                options={OUTPUT_OPTIONS}
                selectedValues={formData.expectedOutputs}
                onToggle={(value) => handleMultiSelectToggle("expectedOutputs", value)}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-6 max-w-full min-w-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[21.6px] font-semibold text-black">Select deliverables</h3>
                </div>
              </div>
            </div>

            {/* Two selection cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setDeliverableSelectionMode("template")}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  deliverableSelectionMode === "template"
                    ? "border-[#ffb546] bg-[#fff8ec]"
                    : "border-[#e0e0e0] bg-white hover:bg-[#f9f9f9]"
                }`}
              >
                <h4 className="text-base font-semibold text-black mb-1">Select template</h4>
                <p className="text-sm text-[#424242]">Choose from predefined templates that contain a bundle of assets.</p>
              </button>
              <button
                onClick={() => {
                  setDeliverableSelectionMode("build-your-own");
                  if (formData.selectedTemplate && formData.selectedTemplate !== "other") {
                    handleTemplateSelect("other");
                  }
                }}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  deliverableSelectionMode === "build-your-own"
                    ? "border-[#ffb546] bg-[#fff8ec]"
                    : "border-[#e0e0e0] bg-white hover:bg-[#f9f9f9]"
                }`}
              >
                <h4 className="text-base font-semibold text-black mb-1">Build your own</h4>
                <p className="text-sm text-[#424242]">Browse the list of recommended assets or add custom assets as needed.</p>
              </button>
            </div>

            {/* Show templates when "Select template" is active */}
            {deliverableSelectionMode === "template" && (
              <div className="flex flex-col gap-2 border border-[#ececec] rounded-xl p-4 min-w-0">
                <div className="overflow-x-auto pb-2 mt-2 -mx-4 px-4">
                  <div className="flex gap-3 min-w-max">
                    {FORM_TEMPLATE_OPTIONS.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`min-w-[180px] rounded-xl border px-4 py-3 text-left transition hover:bg-[#f9f9f9] ${
                          formData.selectedTemplate === template.id ? "border-[#ffb546] bg-[#fff8ec]" : "border-[#e0e0e0]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-black">{template.title}</p>
                            <p className="text-xs text-[#6b6b6f]">Tap to use</p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-[#f4f4f5] flex items-center justify-center">
                            <div className="template-icon" dangerouslySetInnerHTML={{ __html: template.icon }} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Show assets only when a template is selected (in template mode) or when build-your-own mode is active */}
            {(deliverableSelectionMode === "build-your-own" || (deliverableSelectionMode === "template" && formData.selectedTemplate && formData.selectedTemplate !== "")) && (
              <>
                {formData.assets.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleClearAllAssets}
                      className="text-sm font-semibold text-[#848487] hover:text-black transition underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  {renderedAssets}
                </div>
                <button
                  onClick={() => setShowCustomAssetFields((prev) => !prev)}
                  className="w-full rounded-[28px] border border-dashed border-[#cfcfcf] px-4 py-2 text-sm font-semibold text-[#424242] hover:border-[#a5a5a8] transition"
                >
                  Add custom requirement/deliverable
                </button>

                {showCustomAssetFields && (
              <div className="rounded-xl border border-[#ececec] p-4 space-y-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Deliverable name">
                <StyledInput
                      value={customAssetDraft.name}
                      onChange={(e) => setCustomAssetDraft((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. POS toolkit"
                />
              </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Quantity" helpText="How many of this asset do you need?">
                    <StyledInput
                      type="number"
                      min="1"
                      value={customAssetDraft.quantity > 0 ? customAssetDraft.quantity.toString() : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = parseInt(value, 10);
                        if (value === "" || (!isNaN(numValue) && numValue >= 1)) {
                          setCustomAssetDraft((prev) => ({ 
                            ...prev, 
                            quantity: value === "" ? 1 : numValue 
                          }));
                        }
                      }}
                      placeholder="1"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </Field>
                </div>
                <Field label="Description">
                <Textarea
                    value={customAssetDraft.description}
                    onChange={(e) => setCustomAssetDraft((prev) => ({ ...prev, description: e.target.value }))}
                  className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[74px] resize-none bg-[#f9f9f9] text-black placeholder:text-[#848487]"
                    placeholder="Share any context for Iris"
                />
              </Field>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddCustomAsset}
                    disabled={!customAssetDraft.name.trim()}
                    className={`rounded-[28px] px-4 py-2 text-sm font-semibold transition ${
                      customAssetDraft.name.trim()
                        ? "bg-[#ffb546] text-black hover:opacity-90"
                        : "bg-[#f4f4f5] text-[#9c9c9f] cursor-not-allowed"
                    }`}
                  >
                    Add asset
                  </button>
            </div>
          </div>
                )}
              </>
            )}

        </section>

        {/* Watermark Files Section */}
        <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-4 max-w-full min-w-0">
          <div className="flex items-start gap-3">
            <Checkbox
              id="watermark-files"
              checked={formData.watermarkFiles}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  watermarkFiles: checked === true,
                }));
              }}
              className="mt-0.5"
            />
            <div className="flex flex-col gap-1 flex-1">
              <label
                htmlFor="watermark-files"
                className="text-sm font-medium text-black cursor-pointer"
              >
                Watermark files
              </label>
              <p className="text-sm text-[#424242]">
                When selected, IRIS will automatically watermark all deliverable files.
              </p>
            </div>
          </div>
        </section>

        {/* Attach Documents Section */}
        <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-4 max-w-full min-w-0">
          <div className="flex flex-col gap-2">
            <h3 className="text-[21.6px] font-semibold text-black">Attach documents</h3>
            <p className="text-sm text-[#424242]">Upload any relevant documents to support your brief.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <input
              type="file"
              id="document-upload"
              multiple
              onChange={handleDocumentUpload}
              className="hidden"
            />
            <label
              htmlFor="document-upload"
              className="w-full rounded-[28px] border border-dashed border-[#cfcfcf] px-4 py-3 text-sm font-semibold text-[#424242] hover:border-[#a5a5a8] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload documents</span>
            </label>
            
            {formData.attachedDocuments.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {formData.attachedDocuments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#848487] shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <span className="text-sm text-black truncate">{file.name}</span>
                      <span className="text-xs text-[#848487] shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="ml-2 p-1 hover:bg-[#e5e5e5] rounded transition shrink-0"
                    >
                      <X size={16} className="text-[#848487]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Action Buttons - Fixed */}
        <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 pt-4 pb-2 px-4 md:px-6 z-10 pointer-events-none bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col gap-2.5 w-full max-w-full pointer-events-auto">
            {/* Token Estimate */}
            <div className="flex items-center gap-2 justify-end pb-2">
              <div className="flex gap-2 md:gap-4 items-center">
                <span className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0016 16.6012C13.3865 16.6012 16.1306 15.5303 16.1306 14.2093C16.1306 12.8882 13.3865 11.8173 10.0016 11.8173C6.61662 11.8173 3.87256 12.8882 3.87256 14.2093C3.87256 15.5303 6.61662 16.6012 10.0016 16.6012Z" fill="#03B3E2" />
                    <path d="M10.0016 7.54461C13.387 7.54461 16.1306 8.61587 16.1306 9.93653C16.1306 11.2572 13.387 12.3284 10.0016 12.3284C6.6161 12.3284 3.87256 11.2572 3.87256 9.93653C3.87256 8.61587 6.6161 7.54461 10.0016 7.54461Z" fill="#03B3E2" />
                    <path d="M10.0018 8.05164C13.3867 8.05164 16.1308 6.98073 16.1308 5.65972C16.1308 4.33871 13.3867 3.26782 10.0018 3.26782C6.61682 3.26782 3.87276 4.33871 3.87276 5.65972C3.87276 6.98073 6.61682 8.05164 10.0018 8.05164Z" fill="#03B3E2" />
                  </svg>
                </span>
                <div className="relative flex items-center gap-2">
                  {showCoinAnimation && (
                    <Coins 
                      size={16} 
                      className="text-[#ffb546] animate-slide-in-coin"
                    />
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-lg md:text-[26px] leading-[25px] md:leading-[37.24px] text-black font-medium cursor-help transition-all duration-300 tabular-nums">
                          {displayTokens}
                          <span className="text-[#848487] ml-1">(£{displayPounds})</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Each token is worth 4.502 pounds</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm md:text-[26px] leading-[18px] md:leading-[37.24px] text-[#848487]">Total tokens</span>
              </div>
              {hasCustomAssets && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={16} className="text-[#848487] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[300px]">
                        Your list of assets contains one or more custom assets. IRIS will review it and set the token price. You will be informed once this is done.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-2.5 w-full max-w-full">
              <button
                onClick={onCancel}
                className="w-full md:w-auto md:flex-1 md:min-w-0 h-10 px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-sm font-semibold leading-[18.62px] whitespace-nowrap">Cancel</span>
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full md:w-auto md:flex-1 md:min-w-0 h-10 px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center transition"
              >
                <span className="text-sm font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleReviewBrief}
                      disabled={!isFormComplete}
                      className={`w-full md:w-auto md:flex-1 md:min-w-0 h-10 px-4 rounded-[28px] flex items-center justify-center transition ${
                        isFormComplete ? "bg-[#ffb546] hover:opacity-90" : "bg-[#f9f9f9] cursor-not-allowed opacity-50 border border-[#e0e0e0]"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold leading-[18.62px] whitespace-nowrap ${
                          isFormComplete ? "text-black" : "text-black"
                        }`}
                      >
                        {changeRequestMode ? "Review change request" : "Review brief"}
                      </span>
                    </button>
                  </TooltipTrigger>
                  {!isFormComplete && (
                    <TooltipContent>
                      <p className="max-w-[250px]">
                      Please fill in the Project Title, Delivery Date and Project Lead, and add at least one asset so you can review your brief.
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        </div>
      </div>

      <SuccessDialog 
        open={showConfirmation} 
        onOpenChange={setShowConfirmation} 
        onConfirm={handleViewAllBriefs}
        title={changeRequestMode ? "Your change request has been sent to IRIS" : undefined}
        description={changeRequestMode ? "" : undefined}
        confirmText={changeRequestMode ? "OK" : undefined}
      />

      <SuccessDialog
        open={showSaveDraftConfirmation}
        onOpenChange={setShowSaveDraftConfirmation}
        onConfirm={handleViewAllBriefsFromSave}
        title="Brief successfully drafted!"
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[62.4rem]">
          <DialogHeader>
            <DialogTitle>{changeRequestMode ? "Change request preview" : "Brief preview"}</DialogTitle>
            <DialogDescription>
              {changeRequestMode 
                ? "Review the changes you've made to the brief. Changed fields are highlighted below." 
                : "Make sure everything looks right before submitting."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PreviewField 
                label="Project title" 
                value={formData.projectTitle || "—"} 
                originalValue={originalBriefData?.projectTitle || "—"}
              />
              <PreviewField 
                label="Delivery date" 
                value={formData.dueDate ? format(formData.dueDate, "PPP") : "—"} 
                originalValue={originalBriefData?.dueDate ? format(originalBriefData.dueDate, "PPP") : "—"}
              />
              <PreviewField
                label="Project lead"
                value={
                  formData.projectLead.length > 0
                    ? formData.projectLead
                        .map((leadValue) => PROJECT_LEADS.find((lead) => lead.value === leadValue)?.label)
                        .filter((label): label is string => Boolean(label))
                        .join(", ")
                    : "—"
                }
                originalValue={
                  originalBriefData && originalBriefData.projectLead.length > 0
                    ? originalBriefData.projectLead
                        .map((leadValue) => PROJECT_LEADS.find((lead) => lead.value === leadValue)?.label)
                        .filter((label): label is string => Boolean(label))
                        .join(", ")
                    : "—"
                }
              />
              <PreviewField 
                label="Under NDA" 
                value={formData.underNDA ? "Yes" : "No"} 
                originalValue={originalBriefData ? (originalBriefData.underNDA ? "Yes" : "No") : undefined}
              />
              <PreviewField 
                label="Work type" 
                value={formData.workType.length ? formData.workType.join(", ") : "—"} 
                originalValue={originalBriefData ? (originalBriefData.workType.length ? originalBriefData.workType.join(", ") : "—") : undefined}
              />
              <PreviewField 
                label="Channels" 
                value={formData.channels.length ? formData.channels.join(", ") : "—"} 
                originalValue={originalBriefData ? (originalBriefData.channels.length ? originalBriefData.channels.join(", ") : "—") : undefined}
              />
              <PreviewField
                label="Expected outputs"
                value={formData.expectedOutputs.length ? formData.expectedOutputs.join(", ") : "—"}
                originalValue={originalBriefData ? (originalBriefData.expectedOutputs.length ? originalBriefData.expectedOutputs.join(", ") : "—") : undefined}
              />
              <PreviewField 
                label="Selected template" 
                value={selectedTemplateName || "—"} 
                originalValue={originalBriefData ? (FORM_TEMPLATE_OPTIONS.find((t) => t.id === originalBriefData.selectedTemplate)?.title || "—") : undefined}
              />
            </div>
            <PreviewField 
              label="Brief summary" 
              value={formData.briefSummary || "—"} 
              originalValue={originalBriefData?.briefSummary || "—"}
              fullWidth 
            />
            <PreviewField 
              label="Objective" 
              value={formData.objective || "—"} 
              originalValue={originalBriefData?.objective || "—"}
              fullWidth 
            />
            <PreviewField 
              label="Target audience" 
              value={formData.targetAudience || "—"} 
              originalValue={originalBriefData?.targetAudience || "—"}
              fullWidth 
            />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-black">Assets</p>
                {changeRequestMode && originalBriefData && (
                  (() => {
                    const originalAssetIds = new Set(originalBriefData.assets.map(a => a.id));
                    const currentAssetIds = new Set(formData.assets.map(a => a.id));
                    const assetsChanged = 
                      originalBriefData.assets.length !== formData.assets.length ||
                      ![...originalAssetIds].every(id => currentAssetIds.has(id)) ||
                      ![...currentAssetIds].every(id => originalAssetIds.has(id)) ||
                      formData.assets.some(asset => {
                        const original = originalBriefData.assets.find(a => a.id === asset.id);
                        return original && (
                          original.quantity !== asset.quantity ||
                          original.assetSpecification !== asset.assetSpecification ||
                          original.deliveryWeek !== asset.deliveryWeek
                        );
                      });
                    return assetsChanged ? (
                      <span className="text-[10px] uppercase tracking-wide text-[#ffb546] font-semibold bg-[#fff8ec] px-2 py-0.5 rounded">
                        Changed
                      </span>
                    ) : null;
                  })()
                )}
              </div>
              {formData.assets.length === 0 ? (
                <p className="text-sm text-[#848487]">No assets added.</p>
              ) : (
                <div className="space-y-3">
                  {formData.assets.map((asset) => {
                    const isCustom = asset.isCustom === true;
                    const originalAsset = changeRequestMode && originalBriefData 
                      ? originalBriefData.assets.find(a => a.id === asset.id) 
                      : null;
                    const assetChanged = originalAsset && (
                      originalAsset.quantity !== asset.quantity ||
                      originalAsset.assetSpecification !== asset.assetSpecification ||
                      originalAsset.deliveryWeek !== asset.deliveryWeek ||
                      originalAsset.name !== asset.name
                    );
                    const isNewAsset = changeRequestMode && originalBriefData && !originalAsset;
                    
                    return (
                      <div 
                        key={asset.id} 
                        className={`rounded-xl border p-4 space-y-2 ${
                          assetChanged || isNewAsset
                            ? "border-[#4caf50] bg-[#e8f5e9]"
                            : "border-[#ececec] bg-[#f9f9f9]"
                        }`}
                      >
                        {assetChanged && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] uppercase tracking-wide text-[#4caf50] font-semibold bg-white px-2 py-0.5 rounded">
                              {isNewAsset ? "New Asset" : "Modified"}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-black">{asset.name}</p>
                            <p className="text-xs text-[#6b6b6f]">{asset.description}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-[#424242]">
                              {asset.quantity} ×
                            </span>
                            {isCustom ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle size={14} className="text-[#848487] cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-[300px]">
                                      IRIS will review this asset and provide token price for it. You will be informed once this is done.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <span className="text-xs text-[#424242]">
                                {asset.tokenPrice} tokens
                              </span>
                            )}
                          </div>
                        </div>
                        {assetChanged && originalAsset && (
                          <div className="bg-white rounded-lg p-2 space-y-1 mb-2">
                            <p className="text-xs text-[#848487] font-semibold">Original:</p>
                            <p className="text-xs text-[#6b6b6f] line-through opacity-60">
                              Quantity: {originalAsset.quantity} × {originalAsset.tokenPrice} tokens
                            </p>
                            {originalAsset.assetSpecification && (
                              <p className="text-xs text-[#6b6b6f] line-through opacity-60">
                                Spec: {originalAsset.assetSpecification}
                              </p>
                            )}
                            {originalAsset.deliveryWeek && (
                              <p className="text-xs text-[#6b6b6f] line-through opacity-60">
                                Delivery: {originalAsset.deliveryWeek}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-[#6b6b6f]">
                          Specification: {asset.assetSpecification?.trim() ? asset.assetSpecification : "Not provided"}
                        </p>
                        <p className="text-xs text-[#6b6b6f]">
                          Delivery week: {asset.deliveryWeek?.trim() ? asset.deliveryWeek : "Not provided"}
                        </p>
                      </div>
                    );
                  })}
                  {changeRequestMode && originalBriefData && originalBriefData.assets.some(origAsset => 
                    !formData.assets.find(a => a.id === origAsset.id)
                  ) && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#848487]">Removed Assets:</p>
                      {originalBriefData.assets
                        .filter(origAsset => !formData.assets.find(a => a.id === origAsset.id))
                        .map((removedAsset) => (
                          <div key={removedAsset.id} className="rounded-xl border border-[#ffb546] bg-[#fff8ec] p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase tracking-wide text-[#ffb546] font-semibold bg-white px-2 py-0.5 rounded">
                                Removed
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-black line-through opacity-60">{removedAsset.name}</p>
                            <p className="text-xs text-[#6b6b6f] line-through opacity-60">
                              Quantity: {removedAsset.quantity} × {removedAsset.tokenPrice} tokens
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e0e0e0] mt-4">
            <button
              onClick={() => setPreviewOpen(false)}
              className="w-full sm:flex-1 h-10 px-4 rounded-[28px] border border-[#ececec] text-[#424242] font-semibold hover:bg-[#f9f9f9] transition"
            >
              Edit brief
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete}
              className={`w-full sm:flex-1 h-10 px-4 rounded-[28px] font-semibold transition ${
                isFormComplete ? "bg-[#ffb546] text-black hover:opacity-90" : "bg-[#f9f9f9] text-[#848487] cursor-not-allowed opacity-50"
              }`}
            >
              {changeRequestMode ? "Submit change request" : "Submit Brief"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface PreviewFieldProps {
  label: string;
  value: string;
  originalValue?: string;
  fullWidth?: boolean;
  isChanged?: boolean;
}

function PreviewField({ label, value, originalValue, fullWidth, isChanged }: PreviewFieldProps) {
  const hasChanged = isChanged || (originalValue !== undefined && originalValue !== value);
  
  return (
    <div className={fullWidth ? "col-span-1 md:col-span-2 space-y-1" : "space-y-1"}>
      <div className="flex items-center gap-2">
        <p className="text-xs uppercase tracking-wide text-[#848487]">{label}</p>
        {hasChanged && (
          <span className="text-[10px] uppercase tracking-wide text-[#ffb546] font-semibold bg-[#fff8ec] px-2 py-0.5 rounded">
            Changed
          </span>
        )}
      </div>
      {hasChanged && originalValue !== undefined ? (
        <div className="space-y-2">
          <div className="bg-[#fff8ec] border border-[#ffb546] rounded-lg p-2">
            <p className="text-xs text-[#848487] mb-1">Original:</p>
            <p className="text-sm text-black whitespace-pre-line line-through opacity-60">{originalValue || "—"}</p>
          </div>
          <div className="bg-[#e8f5e9] border border-[#4caf50] rounded-lg p-2">
            <p className="text-xs text-[#848487] mb-1">New:</p>
            <p className="text-sm text-black whitespace-pre-line font-medium">{value}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-black whitespace-pre-line">{value}</p>
      )}
    </div>
  );
}

interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  helpText?: string;
}

function MultiSelectDropdown({ label, placeholder, options, selectedValues, onToggle, helpText }: MultiSelectDropdownProps) {
  return (
    <Field label={label} helpText={helpText}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full border border-[#e0e0e0] rounded-[28px] bg-[#f9f9f9] px-5 py-2.5 text-left text-sm flex items-center justify-between ${
              selectedValues.length ? "text-black" : "text-[#848487]"
            }`}
          >
            <span>{selectedValues.length ? `${selectedValues.length} selected` : placeholder}</span>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[240px] p-3 space-y-2 bg-white shadow-lg rounded-xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#f4f4f5] transition text-left cursor-pointer"
            >
              <div onClick={(e) => e.stopPropagation()} className="cursor-pointer">
                <Checkbox checked={selectedValues.includes(option)} onCheckedChange={() => onToggle(option)} />
              </div>
              <span className="text-sm text-black flex-1">{option}</span>
            </button>
          ))}
        </PopoverContent>
      </Popover>
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedValues.map((value) => (
            <span key={value} className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs text-[#424242]">
              {value}
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}

interface ProjectLeadMultiSelectProps {
  label: string;
  placeholder?: string;
  selectedValues: string[];
  onToggle: (value: string) => void;
  helpText?: string;
}

function ProjectLeadMultiSelect({ label, placeholder = "Choose leads", selectedValues, onToggle, helpText }: ProjectLeadMultiSelectProps) {
  const leadOptions = PROJECT_LEADS.map((lead) => lead.value);
  const selectedLabels = selectedValues
    .map((value) => PROJECT_LEADS.find((lead) => lead.value === value)?.label)
    .filter((label): label is string => Boolean(label));

  return (
    <Field label={label} helpText={helpText}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full border border-[#e0e0e0] rounded-[28px] bg-[#f9f9f9] px-5 py-2.5 text-left text-sm flex items-center justify-between ${
              selectedValues.length ? "text-black" : "text-[#848487]"
            }`}
          >
            <span>{selectedValues.length ? (selectedValues.length === 1 ? selectedLabels[0] : `${selectedValues.length} selected`) : placeholder}</span>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[240px] p-3 space-y-2 bg-white shadow-lg rounded-xl">
          {PROJECT_LEADS.map((lead) => (
            <button
              key={lead.value}
              type="button"
              onClick={() => onToggle(lead.value)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#f4f4f5] transition text-left cursor-pointer"
            >
              <div onClick={(e) => e.stopPropagation()} className="cursor-pointer">
                <Checkbox checked={selectedValues.includes(lead.value)} onCheckedChange={() => onToggle(lead.value)} />
              </div>
              <span className="text-sm text-black flex-1">{lead.label}</span>
            </button>
          ))}
        </PopoverContent>
      </Popover>
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedLabels.map((label, index) => (
            <span key={selectedValues[index]} className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs text-[#424242]">
              {label}
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}

function DeliverablesSelectionScreen({
  onCancel,
  onBack,
  onNavigateToAiResponse,
  briefData,
}: {
  onCancel: () => void;
  onBack: () => void;
  onNavigateToAiResponse: (inputText: string) => void;
  briefData: NewBriefFormValues;
}) {
  const navigate = useNavigate();
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [tokenEstimate, setTokenEstimate] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSaveDraftConfirmation, setShowSaveDraftConfirmation] = useState(false);
  const [pendingDraftPayload, setPendingDraftPayload] = useState<SubmittedBriefPayload | null>(null);

  const formattedLaunchDate = briefData.dueDate ? format(briefData.dueDate, "MMMM d, yyyy") : "";
  const projectLeadLabel = briefData.projectLead.length > 0
    ? briefData.projectLead
        .map((leadValue) => PROJECT_LEADS.find((lead) => lead.value === leadValue)?.label)
        .filter((label): label is string => Boolean(label))
        .join(", ")
    : "";

  const hasBriefPreview =
    briefData.projectTitle.trim() !== "" ||
    Boolean(briefData.dueDate) ||
    briefData.projectLead.length > 0 ||
    briefData.objective.trim() !== "";

  const renderBriefPreview = () => (
    <BriefPreviewPanel
      projectTitle={briefData.projectTitle}
      launchDate={formattedLaunchDate}
      projectLead={projectLeadLabel}
      objective={briefData.objective.trim()}
    />
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onNavigateToAiResponse(chatInput.trim());
    }
  };

  const handleAddDeliverable = (deliverableId: string, tokens: number) => {
    if (selectedDeliverables.includes(deliverableId)) {
      setSelectedDeliverables(selectedDeliverables.filter(id => id !== deliverableId));
      setTokenEstimate(prev => prev - tokens);
    } else {
      setSelectedDeliverables([...selectedDeliverables, deliverableId]);
      setTokenEstimate(prev => prev + tokens);
    }
  };

  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs", { state: { resetToOverview: true } });
  };

  const handleViewAllBriefsFromSave = () => {
    setShowSaveDraftConfirmation(false);
    if (pendingDraftPayload) {
      navigate("/dashboard/briefs", { state: { submittedBrief: pendingDraftPayload } });
      setPendingDraftPayload(null);
    } else {
      navigate("/dashboard/briefs", { state: { resetToOverview: true } });
    }
  };

  const handleSaveDraft = () => {
    const payload: SubmittedBriefPayload = {
      title: briefData.projectTitle || "Untitled brief",
      objective: briefData.objective,
      status: "draft",
      dueDate: briefData.dueDate ? briefData.dueDate.toISOString() : undefined,
    };
    setPendingDraftPayload(payload);
    setShowSaveDraftConfirmation(true);
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  return (
    <>
      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex items-center justify-center w-full h-[85vh] px-6 lg:px-[10%] xl:px-[15%] overflow-hidden">
        <div className="flex flex-row gap-4 w-full max-w-full h-full">
        {/* Left Panel */}
          <div className="flex flex-col gap-2 p-4 md:p-6 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
            <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Great! Next up are the deliverables. You can either browse and select the ones you need, or start detailing them below. TIKO will summarise the deliverables and prompt you to make sure you include everything you need for this project.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold leading-[18.62px] text-[#424242] w-full">
                Browse recomended deliverables
              </p>

              <div className="flex flex-col gap-1">
                {RECOMMENDED_DELIVERABLES.map((deliverable) => {
                  const isSelected = selectedDeliverables.includes(deliverable.id);
                  return (
                    <div
                      key={deliverable.id}
                      className="bg-[#efeff0] border border-[#e0e0e0] rounded-[6px] p-3 flex items-center justify-between hover:bg-[#e5e5e5] transition"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm leading-[18.62px] text-black">
                          {deliverable.title}
                        </p>
                        <p className="text-[10px] leading-[14px] text-black">
                          {deliverable.tokens} {deliverable.tokens === 1 ? "token" : "tokens"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddDeliverable(deliverable.id, deliverable.tokens)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                          isSelected 
                            ? "bg-[#03B3E2] hover:bg-[#0299c7]" 
                            : "bg-[#f1f1f3] hover:bg-[#e5e5e5]"
                        }`}
                      >
                        <Plus 
                          size={18} 
                          className={`${isSelected ? "text-white" : "text-[#03B3E2]"}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button className="flex items-center justify-center gap-1.5 pt-1">
                <p className="text-sm font-bold leading-[18.62px] text-[#848487]">
                  More deliverables
                </p>
                <ChevronDownIcon size={19} className="text-[#848487]" />
              </button>
            </div>

            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Prefer to describe it instead? Or not sure which deliverables you need yet? <br />
              <span className="font-bold">Continue describing your brief below</span>
            </p>
          </div>

            {/* Separator line - aligned with right side */}
            <div className="h-[9px] relative w-full shrink-0">
              <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
            </div>

            {/* AI Chat Input at Bottom */}
            <div className="shrink-0">
            <ChatInput
              value={chatInput}
              onChange={setChatInput}
              onSubmit={(v) => { if (v.trim()) { onNavigateToAiResponse(v.trim()); } }}
              leftIcon={paperclipIcon}
              rightIcon={sendArrowIcon}
              helpText="Need a hand? Talk to your Iris account manager"
            />
          </div>
        </div>

        {/* Right Panel */}
          <div className="flex flex-col gap-2.5 pb-5 pl-2.5 pt-2.5 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
          {/* Brief Preview - made smaller to prevent scroll */}
          <div className="h-[89%] overflow-hidden">
          {hasBriefPreview ? renderBriefPreview() : (
            <div className="flex flex-col gap-2 items-center justify-center h-full">
              <BriefLoadingGraphic />
              <p className="text-sm font-bold leading-[18.62px] opacity-50 text-[#c1c1c3]">
                Brief loading...
              </p>
            </div>
          )}
          </div>

          {/* Separator - matching left side line width and position */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0 w-full">
            {/* Token Estimate */}
            <TokenEstimate value={tokenEstimate} />

            {/* Action Buttons */}
            <div className="flex items-center w-full gap-2 min-w-0">
              <button
                onClick={onCancel}
                className="flex-shrink-0 h-8 px-3 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Discard</span>
              </button>
              <div className="flex gap-1 items-center flex-1 min-w-0">
                <button 
                  onClick={handleSaveDraft}
                  className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center transition"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
                </button>
                <button
                  onClick={() => navigate("/dashboard/briefs/review", { state: { brief: briefData } })}
                  className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 rounded-[28px] flex items-center justify-center bg-[#ffb546] hover:opacity-90 transition"
                >
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Tablet/iPad Layout - Vertical stack: Form -> Line -> Document -> Line -> Buttons */}
      <div className="flex lg:hidden flex-col items-center w-full min-h-[85vh] overflow-y-auto px-4 md:px-6 lg:px-[10%] xl:px-[15%] pb-8 pt-4">
        {/* Form Section */}
        <div className="flex flex-col gap-2 rounded-xl w-full max-w-4xl">
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Great! Next up are the deliverables. You can either browse and select the ones you need, or start detailing them below. TIKO will summarise the deliverables and prompt you to make sure you include everything you need for this project.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold leading-[18.62px] text-[#424242] w-full">
                Browse recomended deliverables
              </p>

              <div className="flex flex-col gap-1">
                {RECOMMENDED_DELIVERABLES.map((deliverable) => {
                  const isSelected = selectedDeliverables.includes(deliverable.id);
                  return (
                    <div
                      key={deliverable.id}
                      className="bg-[#efeff0] border border-[#e0e0e0] rounded-[6px] p-3 flex items-center justify-between hover:bg-[#e5e5e5] transition"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm leading-[18.62px] text-black">
                          {deliverable.title}
                        </p>
                        <p className="text-[10px] leading-[14px] text-black">
                          {deliverable.tokens} {deliverable.tokens === 1 ? "token" : "tokens"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddDeliverable(deliverable.id, deliverable.tokens)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                          isSelected 
                            ? "bg-[#03B3E2] hover:bg-[#0299c7]" 
                            : "bg-[#f1f1f3] hover:bg-[#e5e5e5]"
                        }`}
                      >
                        <Plus 
                          size={18} 
                          className={`${isSelected ? "text-white" : "text-[#03B3E2]"}`}
                        />
                      </button>
          </div>
                  );
                })}
              </div>

              <button className="flex items-center justify-center gap-1.5 pt-1">
                <p className="text-sm font-bold leading-[18.62px] text-[#848487]">
                  More deliverables
                </p>
                <ChevronDownIcon size={19} className="text-[#848487]" />
              </button>
            </div>

            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Prefer to describe it instead? Or not sure which deliverables you need yet? <br />
              <span className="font-bold">Continue describing your brief below</span>
            </p>
          </div>

          {/* Separator line */}
          <div className="h-[9px] relative w-full shrink-0 mt-4">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>
        </div>

        {/* White Document - Shown on mobile and tablet/iPad */}
        <div
          className={`bg-white rounded-xl min-h-[600px] w-full ${
            hasBriefPreview
              ? "p-6 flex items-start justify-start"
              : "p-6 flex flex-col gap-8 items-center justify-center"
          }`}
        >
          {hasBriefPreview ? (
            <div className="w-full">
              {renderBriefPreview()}
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <BriefLoadingGraphic />
              <p className="text-sm font-bold leading-[18.62px] opacity-50 text-[#c1c1c3]">
                Brief loading...
              </p>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-[9px] relative w-full shrink-0">
          <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
        </div>

        {/* Buttons section for mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 w-full max-w-4xl pb-5">
          {/* Token Estimate */}
          <div className="flex w-full justify-end">
            <TokenEstimate value={0} />
          </div>

          {/* Action Buttons - Discard, Save draft, Review brief */}
          <div className="flex flex-col md:flex-row items-center gap-2.5 w-full min-w-0">
            <button
              onClick={onCancel}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Discard</span>
            </button>
            <button 
              onClick={handleSaveDraft}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/briefs/review", { state: { brief: briefData } })}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 rounded-[28px] flex items-center justify-center bg-[#ffb546] hover:opacity-90 transition"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <SuccessDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleViewAllBriefs}
      />

      {/* Save Draft Confirmation Dialog */}
      <SuccessDialog
        open={showSaveDraftConfirmation}
        onOpenChange={setShowSaveDraftConfirmation}
        onConfirm={handleViewAllBriefsFromSave}
        title="Brief successfully drafted!"
      />
    </>
  );
}

function AIResponseScreen({
  userInput,
  onBack,
  onCancel,
  briefData,
  onGoToReview,
}: {
  userInput: string;
  onBack: () => void;
  onCancel: () => void;
  briefData: NewBriefFormValues;
  onGoToReview: () => void;
}) {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSaveDraftConfirmation, setShowSaveDraftConfirmation] = useState(false);
  const [pendingDraftPayload, setPendingDraftPayload] = useState<SubmittedBriefPayload | null>(null);
  
  const handleViewAllBriefs = () => {
    setShowConfirmation(false);
    navigate("/dashboard/briefs");
  };

  const handleViewAllBriefsFromSave = () => {
    setShowSaveDraftConfirmation(false);
    if (pendingDraftPayload) {
      navigate("/dashboard/briefs", { state: { submittedBrief: pendingDraftPayload } });
      setPendingDraftPayload(null);
    } else {
      navigate("/dashboard/briefs", { state: { resetToOverview: true } });
    }
  };

  const handleSaveDraft = () => {
    const payload: SubmittedBriefPayload = {
      title: briefData.projectTitle || "Untitled brief",
      objective: briefData.objective,
      status: "draft",
      dueDate: briefData.dueDate ? briefData.dueDate.toISOString() : undefined,
    };
    setPendingDraftPayload(payload);
    setShowSaveDraftConfirmation(true);
  };

  useEffect(() => {
    if (showConfirmation) {
      triggerSuccessConfetti();
    }
  }, [showConfirmation]);

  const formattedLaunchDate = briefData.dueDate ? format(briefData.dueDate, "MMMM d, yyyy") : "";
  const projectLeadLabel = briefData.projectLead.length > 0
    ? briefData.projectLead
        .map((leadValue) => PROJECT_LEADS.find((lead) => lead.value === leadValue)?.label)
        .filter((label): label is string => Boolean(label))
        .join(", ")
    : "";

  // Mock deliverables list from Figma
  const deliverablesList = DELIVERABLES_LIST;

  const hasBriefPreview =
    briefData.projectTitle.trim() !== "" ||
    Boolean(briefData.dueDate) ||
    briefData.projectLead.length > 0 ||
    briefData.objective.trim() !== "";

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const renderBriefPreview = () => (
    <BriefPreviewPanel
      projectTitle={briefData.projectTitle}
      launchDate={formattedLaunchDate}
      projectLead={projectLeadLabel}
      objective={briefData.objective.trim()}
    />
  );

  return (
    <>
      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex items-center justify-center w-full h-[85vh] px-6 lg:px-[10%] xl:px-[15%] overflow-hidden">
        <div className="flex flex-row gap-4 w-full max-w-full h-full">
        {/* Left Panel */}
          <div className="flex flex-col gap-2 p-4 md:p-6 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
          <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-y-auto">
          {/* User Message Bubble */}
          <div className="bg-[#efeff0] rounded-xl p-4">
            <p className="text-sm leading-[18.62px] text-[#424242] whitespace-pre-wrap">
              {userInput || "For this project we need to create like at least 5 different KVs i.e. Q7, B7, Combo, Family and B7&B7R key visual. For each of these we need a clean variant and 80/20, 70/30 variant. For the size you can use default sizes (suggest best ones) for the clean dna 70/30 and for 80/20 we need PDF, PT EXT, LS EXT."}
            </p>
          </div>

          {/* AI Response */}
            <div className="flex flex-col gap-6 px-6 py-4">
            <p className="text-sm leading-[18.62px] text-[#424242]">
              Thanks for the input, review here the list of deliverables.
            </p>

            {/* Deliverables List */}
              <div className="flex flex-col gap-3 w-full">
              {/* Header */}
              <div className="flex gap-2 items-center text-sm font-bold leading-[18.62px] text-black">
                <p className="flex-1">KV Type</p>
                <p className="w-[60px]">Variant</p>
                <p className="w-[200px]">Size</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e0e0e0]" />

              {/* Deliverables Items */}
              {deliverablesList.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  {item.variants.map((variant, vIdx) => (
                    <div key={vIdx}>
                      <div className="flex gap-2 items-center text-[12px] leading-[15.96px] text-black">
                        <p className={`flex-1 ${vIdx === 0 ? "font-bold" : ""}`}>
                          {vIdx === 0 ? item.kvType : " "}
                        </p>
                        <p className="w-[60px] font-normal">{variant.variant}</p>
                        <p className="w-[200px] font-normal">{variant.size}</p>
                      </div>
                      {vIdx < item.variants.length - 1 && (
                        <div className="h-px bg-[#e0e0e0] mt-2" />
                      )}
                    </div>
                  ))}
                  {idx < deliverablesList.length - 1 && (
                    <div className="h-px bg-[#e0e0e0] mt-2" />
                  )}
                </div>
              ))}
            </div>

            {/* File Format Note */}
            <p className="text-sm leading-[18.62px] text-[#424242]">
              The format of the file is missing here.<br />
              The recommended file type for these is <span className="font-bold">JPEG</span> and <span className="font-bold">PSD</span>.<br />
              <br />
              Would you like to add those?
            </p>
          </div>
        </div>

          {/* Separator line - aligned with right side */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* AI Chat Input at Bottom */}
          <div className="shrink-0">
            <ChatInput
              leftIcon={paperclipIcon}
              rightIcon={sendArrowIcon}
              helpText="Need a hand? Talk to your Iris account manager"
            />
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col gap-2.5 pb-5 pl-2.5 pt-2.5 flex-[1_1_0%] min-w-0 h-full overflow-hidden">
          {/* Brief Preview - made smaller to prevent scroll */}
          <div className="h-[89%] overflow-hidden">
          {hasBriefPreview ? renderBriefPreview() : (
            <div className="flex flex-col gap-2 items-center justify-center h-full">
              <BriefLoadingGraphic />
              <p className="text-sm font-bold leading-[18.62px] opacity-50 text-[#c1c1c3]">
                Brief loading...
              </p>
            </div>
          )}
          </div>

          {/* Separator - matching left side line width and position */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0 w-full">
            {/* Token Estimate */}
            <TokenEstimate value={10} />

            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-2.5 w-full min-w-0">
              <button
                onClick={handleSaveDraft}
                className="flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
              </button>
              <div className="w-[15%] shrink-0" />
              <button
                onClick={handleSubmit}
                className="btn flex-1 min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-1 md:gap-[10px] transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Submit brief</span>
                <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px] shrink-0" />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Vertical stack: Form -> Line -> Document -> Line -> Buttons */}
      <div className="flex lg:hidden flex-col items-center w-full min-h-[85vh] overflow-y-auto px-4 md:px-6 lg:px-[10%] xl:px-[15%] pb-8 pt-4">
        {/* Form Section */}
        <div className="flex flex-col gap-2 rounded-xl w-full max-w-4xl">
          <div className="flex flex-col gap-6">
            {/* User Message Bubble */}
            <div className="bg-[#efeff0] rounded-xl p-4">
              <p className="text-sm leading-[18.62px] text-[#424242] whitespace-pre-wrap">
                {userInput || "For this project we need to create like at least 5 different KVs i.e. Q7, B7, Combo, Family and B7&B7R key visual. For each of these we need a clean variant and 80/20, 70/30 variant. For the size you can use default sizes (suggest best ones) for the clean dna 70/30 and for 80/20 we need PDF, PT EXT, LS EXT."}
              </p>
            </div>

            {/* AI Response */}
            <div className="flex flex-col gap-6 px-0 py-0">
              <p className="text-sm leading-[18.62px] text-[#424242]">
                Thanks for the input, review here the list of deliverables.
              </p>

              {/* Deliverables List */}
              <div className="flex flex-col gap-3 w-full">
                {/* Header */}
                <div className="flex gap-2 items-center text-sm font-bold leading-[18.62px] text-black">
                  <p className="flex-1">KV Type</p>
                  <p className="w-[60px]">Variant</p>
                  <p className="w-[200px]">Size</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#e0e0e0]" />

                {/* Deliverables Items */}
                {deliverablesList.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    {item.variants.map((variant, vIdx) => (
                      <div key={vIdx}>
                        <div className="flex gap-2 items-center text-[12px] leading-[15.96px] text-black">
                          <p className={`flex-1 ${vIdx === 0 ? "font-bold" : ""}`}>
                            {vIdx === 0 ? item.kvType : " "}
                          </p>
                          <p className="w-[60px] font-normal">{variant.variant}</p>
                          <p className="w-[200px] font-normal">{variant.size}</p>
                        </div>
                        {vIdx < item.variants.length - 1 && (
                          <div className="h-px bg-[#e0e0e0] mt-2" />
                        )}
                      </div>
                    ))}
                    {idx < deliverablesList.length - 1 && (
                      <div className="h-px bg-[#e0e0e0] mt-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* File Format Note */}
              <p className="text-sm leading-[18.62px] text-[#424242]">
                The format of the file is missing here.<br />
                The recommended file type for these is <span className="font-bold">JPEG</span> and <span className="font-bold">PSD</span>.<br />
                <br />
                Would you like to add those?
              </p>
            </div>
          </div>

          {/* Separator line */}
          <div className="h-[9px] relative w-full shrink-0 mt-4">
            <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
          </div>
        </div>

        {/* White Document - Shown on mobile and tablet/iPad */}
        <div className="bg-white flex flex-col p-6 rounded-xl min-h-[600px] overflow-y-auto">
          <BriefPreviewPanel
            projectTitle={briefData.projectTitle}
            launchDate={formattedLaunchDate}
            projectLead={projectLeadLabel}
            objective={briefData.objective}
          />
        </div>

        {/* Separator */}
        <div className="h-[9px] relative w-full shrink-0">
          <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
        </div>

        {/* Buttons section for mobile and tablet/iPad */}
        <div className="flex lg:hidden flex-col gap-2.5 w-full max-w-4xl pb-5">
          {/* AI Chat Input above buttons */}
          <div className="shrink-0 pb-2 w-full">
            <ChatInput
              leftIcon={paperclipIcon}
              rightIcon={sendArrowIcon}
              helpText="Need a hand? Talk to your Iris account manager"
              className="w-full md:w-[516px]"
              containerClassName="w-full"
            />
          </div>
          {/* Token Estimate */}
          <div className="flex w-full justify-end">
            <TokenEstimate value={0} />
          </div>

          {/* Action Buttons - Discard, Save draft, Review brief */}
          <div className="flex flex-col md:flex-row items-center gap-2.5 w-full min-w-0">
            <button
              onClick={onCancel}
              className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition flex items-center justify-center"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] whitespace-nowrap">Discard</span>
            </button>
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2.5 md:gap-1 md:flex-1 min-w-0">
              <button 
                onClick={handleSaveDraft}
                className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
              </button>
              <button
                onClick={() => navigate("/dashboard/briefs/review", { state: { brief: briefData } })}
                className="w-full md:flex-1 md:min-w-0 h-8 px-2 md:px-4 rounded-[28px] flex items-center justify-center bg-[#ffb546] hover:opacity-90 transition"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <SuccessDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleViewAllBriefs}
      />

      {/* Save Draft Confirmation Dialog */}
      <SuccessDialog
        open={showSaveDraftConfirmation}
        onOpenChange={setShowSaveDraftConfirmation}
        onConfirm={handleViewAllBriefsFromSave}
        title="Brief successfully drafted!"
      />
    </>
  );
}

function AllBriefsSection({ 
  briefs: allBriefs, 
  initialTab,
  onTabChange,
  onOpenDraftForm
}: { 
  briefs: BriefSummary[];
  initialTab?: "All" | "Drafts" | "In review" | "Scope ready to sign";
  onTabChange?: (tab: "All" | "Drafts" | "In review" | "Scope ready to sign") => void;
  onOpenDraftForm?: (brief: BriefSummary) => void;
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"All" | "Drafts" | "In review" | "Scope ready to sign">(initialTab || "All");

  // Avatar names for tooltips
  const avatarNames = ["Murray Gordon", "Henry Bray", "Holly Hayes"];

  // Update activeTab when initialTab changes (e.g., from navigation state)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Get Scope titles for filtering
  const scopeTitles = READY_TO_SIGN_SCOPES.map(scope => scope.title);

  // Filter briefs to show limited counts
  const draftBriefs = allBriefs.filter((b) => b.status === "Draft" && !scopeTitles.includes(b.title)).slice(0, 4);
  const reviewBriefs = allBriefs.filter((b) => b.status === "In review").slice(0, 3);
  const scopeReadyBriefs = allBriefs.filter((b) => scopeTitles.includes(b.title)).slice(0, 2);
  
  const filtered = (() => {
    if (activeTab === "All") {
      return [...draftBriefs, ...reviewBriefs, ...scopeReadyBriefs];
    }
    if (activeTab === "Drafts") {
      return draftBriefs;
    }
    if (activeTab === "In review") {
      return reviewBriefs;
    }
    if (activeTab === "Scope ready to sign") {
      return scopeReadyBriefs;
    }
    return allBriefs;
  })();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold leading-[21.28px] text-black">All briefs</h2>
      <TabFilter
        tabs={["All", "Drafts", "In review", "Scope ready to sign"]}
        activeTab={activeTab}
        onTabChange={(tab) => {
          const tabValue = tab as typeof activeTab;
          setActiveTab(tabValue);
          if (onTabChange) {
            onTabChange(tabValue);
          }
        }}
        variant="compact"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((b) => {
          const isDraft = b.status === "Draft";
          const isInReview = b.status === "In review";
          const isScopeReady = scopeTitles.includes(b.title);
          
          return (
            <div
              key={b.id}
              className={`text-left w-full ${isDraft || isScopeReady ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (isScopeReady) {
                  // Find the matching Scope and navigate to Scope page
                  const matchingScope = READY_TO_SIGN_SCOPES.find(scope => scope.title === b.title);
                  if (matchingScope) {
                    navigate("/dashboard/scope", { state: { scopeId: matchingScope.id } });
                  }
                } else if (isDraft && onOpenDraftForm) {
                  onOpenDraftForm(b);
                } else if (!isDraft && !isScopeReady) {
                  navigate(`/dashboard/briefs/${b.id}`);
                }
              }}
            >
              <BriefCard
                title={b.title}
                description={b.description}
                className={
                  isScopeReady
                    ? "border-[3px] border-[#03B3E2] shadow-[0_0_0_1px_rgba(3,179,226,0.2),0_0_8px_rgba(3,179,226,0.3)] hover:opacity-90 transition cursor-pointer"
                    : isDraft 
                    ? "border-[3px] border-[#FFB546] shadow-[0_0_0_1px_rgba(255,181,70,0.2),0_0_8px_rgba(255,181,70,0.3)]" 
                    : isInReview
                    ? "border-[3px] border-[#18c3b1] shadow-[0_0_0_1px_rgba(24,195,177,0.2),0_0_8px_rgba(24,195,177,0.3)] hover:opacity-90 transition cursor-pointer"
                    : "hover:opacity-90 transition cursor-pointer"
                }
                right={
                  isScopeReady ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#03B3E2] whitespace-nowrap animate-bounce">Ready to sign</span>
                      <ArrowRight 
                        size={14} 
                        className="text-[#03B3E2] animate-bounce" 
                      />
                    </div>
                  ) : isDraft ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDraftForm) {
                          onOpenDraftForm(b);
                        }
                      }}
                      className="text-xs font-semibold text-[#FFB546] hover:opacity-80 transition whitespace-nowrap"
                    >
                      Complete brief
                    </button>
                  ) : undefined
                }
                meta={
                  <div className="flex items-center justify-between">
                    <Badge
                      label={b.badge}
                      intent={
                        b.badge === "Promotional campaign" ? "creation" :
                        b.badge === "BAU campaign" ? "adaptation" :
                        b.badge === "Flagship toolkit" ? "creation" :
                        "default"
                      }
                      width="auto"
                    />
                    <TooltipProvider>
                      <div className="flex -space-x-2">
                        {Array.from({ length: b.avatars }).map((_, index) => {
                          const seed = `brief_${b.id}_avatar_${index}`;
                          const name = avatarNames[index % avatarNames.length];
                          return (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <div>
                                  <Avatar className="w-6 h-6 border-2 border-white">
                                    <AvatarImage 
                                      src={`https://api.dicebear.com/7.x/personas/png?seed=${seed}&size=64`} 
                                      alt={name}
                                    />
                                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-200 to-blue-300">
                                      {String.fromCharCode(65 + index)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{name}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </TooltipProvider>
                  </div>
                }
              >
                <div className="h-px bg-[#ececec]" />
                {b.projectLead && (
                  <div className="flex items-center justify-between py-2 text-xs text-[#848487]">
                    <span>Lead</span>
                    <span>{b.projectLead}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-[#848487]">
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{b.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={14} className="text-[#848487]" />
                    <span>{b.date}</span>
                  </div>
                </div>
              </BriefCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

