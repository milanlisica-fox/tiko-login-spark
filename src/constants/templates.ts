import { TEMPLATE_ICONS } from "@/constants/branding";

export type TemplateItem = {
  id: string;
  title: string;
  icon: string;
  hasRotation?: boolean;
  category: "all" | "popular" | "recent" | "new";
};

export const ALL_TEMPLATES: TemplateItem[] = [
  { id: "asset-adaptation", title: "Asset adaptation", icon: TEMPLATE_ICONS.assetAdaptation, hasRotation: true, category: "popular" },
  { id: "bau-campaign", title: "BAU Campaign", icon: TEMPLATE_ICONS.bau, category: "all" },
  { id: "point-of-sale", title: "Point Of Sale", icon: TEMPLATE_ICONS.pos, category: "all" },
  { id: "digital-pos", title: "Digital POS", icon: TEMPLATE_ICONS.digitalPos, category: "all" },
  { id: "feature-asset", title: "Feature asset", icon: TEMPLATE_ICONS.featureAsset, category: "all" },
  { id: "toolkit", title: "Toolkit", icon: TEMPLATE_ICONS.toolkit, category: "popular" },
  // The following two referenced icons map to existing ones for now
  { id: "partnerships", title: "Partnerships", icon: TEMPLATE_ICONS.assetAdaptation, hasRotation: true, category: "all" },
  { id: "social-content", title: "Social content", icon: TEMPLATE_ICONS.pos, category: "popular" },
];


