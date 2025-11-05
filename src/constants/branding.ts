// Centralized branding and asset constants
import logoImage from "@/assets/images/Tiko.png";

export const BRAND_LOGO_SRC = logoImage;
export const BRAND_LOGO_DOT_SRC = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
export const BRAND_DIVIDER_SRC = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

// Brief template icons
export const TEMPLATE_ICONS = {
  assetAdaptation: "https://www.figma.com/api/mcp/asset/c1a556d8-686f-44f2-88a7-ae10c1e9e2f2",
  bau: "https://www.figma.com/api/mcp/asset/97b7efb4-4c30-4c6a-b0f1-00389ded9baf",
  pos: "https://www.figma.com/api/mcp/asset/5538e7d7-21fd-482e-a031-dbcda03fedf1",
  digitalPos: "https://www.figma.com/api/mcp/asset/313704f8-5070-4770-b5fe-eb44c650dc2f",
  featureAsset: "https://www.figma.com/api/mcp/asset/ec129011-0fa8-488e-bd49-a3ae85c02d77",
  toolkit: "https://www.figma.com/api/mcp/asset/835dc746-f8b7-47a1-8471-75138a491898",
} as const;

export const BRAND = {
  logo: BRAND_LOGO_SRC,
  logoDot: BRAND_LOGO_DOT_SRC,
  divider: BRAND_DIVIDER_SRC,
  templates: TEMPLATE_ICONS,
} as const;


