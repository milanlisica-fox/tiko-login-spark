import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar as CalendarIcon, HelpCircle, Send } from "lucide-react";
import { format, parse } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND, TEMPLATE_ICONS } from "@/constants/branding";
import { Field } from "@/components/common/Field";
import { StyledInput } from "@/components/common/StyledInput";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/constants/icons";
import { PROJECT_LEADS, NewBriefFormValues, SelectedAsset } from "./Briefs";
import { FORM_TEMPLATE_OPTIONS, WORK_TYPE_OPTIONS, CHANNEL_OPTIONS, OUTPUT_OPTIONS } from "./Briefs";
import TokenEstimate from "@/components/common/TokenEstimate";
import BriefPreviewPanel from "@/components/briefs/BriefPreviewPanel";
import { toast } from "sonner";

// Reuse images from Dashboard for consistent visuals
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

// Mock data for a single brief
const mockBriefData: NewBriefFormValues = {
  projectTitle: "W Summer Festival 2025",
  dueDate: new Date(2025, 11, 15), // December 15, 2025
  projectLead: ["murray-bray"],
  underNDA: false,
  objective: "Develop visual guide for the Summer Campaign Festival 2025. Create full set of campaign visuals, formats, and variations, for digital, print media. Increase brand awareness by 30% and drive engagement across all channels.",
  targetAudience: "",
  workType: ["Design", "Production", "Planning"],
  channels: ["Online", "Social", "Print", "TVC"],
  expectedOutputs: ["Print asset", "Video asset", "Marketing asset"],
  briefSummary: "This brief outlines the requirements for the Summer Festival 2025 campaign. We need comprehensive visual assets that can be adapted across multiple channels and markets. The campaign should reflect our brand values while appealing to a diverse audience.",
  assets: [
    {
      id: "asset-key-visual",
      name: "Key visual",
      description: "Primary KV ready for localisation",
      tokenPrice: 4,
      assetSpecification: "High-resolution files in JPEG and PSD formats. Multiple variants: clean, 70/30, and 80/20 versions. Sizes: PDF, PT EXT, LS EXT for 80/20 variant.",
      deliveryWeek: "Week 32",
      quantity: 2,
      isCustom: false,
    },
    {
      id: "asset-social-media-pack",
      name: "Social media pack",
      description: "Complete set of social media assets",
      tokenPrice: 3,
      assetSpecification: "Instagram posts (1080x1080), Stories (1080x1920), Facebook cover (1200x630), Twitter header (1500x500)",
      deliveryWeek: "Week 33",
      quantity: 1,
      isCustom: false,
    },
    {
      id: "asset-video-content",
      name: "Video content",
      description: "Video assets for digital channels",
      tokenPrice: 7,
      assetSpecification: "15-second and 30-second versions. Formats: MP4 (1080p), MOV (4K). Include subtitles and versions without text overlay.",
      deliveryWeek: "Week 34",
      quantity: 1,
      isCustom: false,
    },
    {
      id: "custom-1",
      name: "Custom POS Toolkit",
      description: "Custom asset",
      tokenPrice: 8,
      assetSpecification: "Point of sale materials including shelf talkers, window displays, and counter cards. Sizes: A4, A3, and custom formats for specific retail locations.",
      deliveryWeek: "Week 35",
      quantity: 1,
      isCustom: true,
    },
  ],
  selectedTemplate: "asset-adaptation",
  additionalAssetDetails: "Please ensure all assets follow brand guidelines and are optimised for both digital and print use. Include versions for different markets (UK, US, EU) with appropriate localization.",
  watermarkFiles: false,
  attachedDocuments: [],
};

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  message: string;
  timestamp: Date;
  isIris?: boolean;
}

// Mock comments between Iris and Samsung
const mockComments: Comment[] = [
  {
    id: "comment-1",
    author: "Iris",
    authorAvatar: "iris",
    message: "Hi! I've reviewed the brief and have a few questions about the asset specifications. Could you clarify the exact dimensions needed for the print assets?",
    timestamp: new Date(2025, 11, 10, 10, 30),
    isIris: true,
  },
  {
    id: "comment-2",
    author: "Samsung",
    authorAvatar: "samsung",
    message: "Thanks for reaching out! For the print assets, we need A4 (210x297mm) and A3 (297x420mm) formats. The A4 will be used for standard marketing materials, and A3 for larger displays.",
    timestamp: new Date(2025, 11, 10, 11, 15),
    isIris: false,
  },
  {
    id: "comment-3",
    author: "Iris",
    authorAvatar: "iris",
    message: "Perfect, thank you! I also noticed you mentioned custom POS toolkit. Could you provide more details about the specific retail locations and their requirements?",
    timestamp: new Date(2025, 11, 10, 14, 20),
    isIris: true,
  },
  {
    id: "comment-4",
    author: "Samsung",
    authorAvatar: "samsung",
    message: "Sure! The POS materials will be used in Samsung Experience Stores across Europe. We need shelf talkers (A5 size), window displays (A2 size), and counter cards (A6 size). Each location has different space constraints, so flexibility in sizing would be helpful.",
    timestamp: new Date(2025, 11, 11, 9, 45),
    isIris: false,
  },
  {
    id: "comment-5",
    author: "Iris",
    authorAvatar: "iris",
    message: "Got it! I'll make sure all assets are created in those sizes. The delivery timeline looks good - we should be able to meet the Week 32 deadline for the key visuals. I'll keep you updated on progress.",
    timestamp: new Date(2025, 11, 11, 15, 10),
    isIris: true,
  },
];

// Helper function to convert project data to brief form values
function projectToBriefFormValues(project: { id: number; name: string; dueDate?: string; team: string; owners: string[] }): NewBriefFormValues {
  // Parse due date if available
  let parsedDueDate: Date | undefined = undefined;
  if (project.dueDate) {
    try {
      // Try parsing formats like "Dec 12, 2025" or "Jan 05, 2026"
      parsedDueDate = parse(project.dueDate, "MMM dd, yyyy", new Date());
      if (isNaN(parsedDueDate.getTime())) {
        parsedDueDate = parse(project.dueDate, "MMM d, yyyy", new Date());
      }
    } catch {
      // If parsing fails, leave undefined
    }
  }

  // Map owners to project leads (using first owner as default, or empty array)
  const projectLeadValues: string[] = project.owners.length > 0 
    ? [PROJECT_LEADS[0]?.value || "murray-bray"] // Default to first available lead
    : [];

  return {
    projectTitle: project.name,
    dueDate: parsedDueDate,
    projectLead: projectLeadValues,
    underNDA: false,
    objective: `Project brief for ${project.name}. Team: ${project.team}.`,
    targetAudience: "",
    workType: ["Design", "Production"],
    channels: ["Online", "Social"],
    expectedOutputs: ["Digital marketing asset"],
    briefSummary: `Brief for ${project.name} managed by ${project.team} team.`,
    assets: [
      {
        id: "calc-1",
        name: "Master KV creation (PSD, JPEG, INDD, PDF)",
        description: "Master KV creation (PSD, JPEG, INDD, PDF)",
        tokenPrice: 8,
        assetSpecification: "High-resolution files in JPEG and PSD formats",
        deliveryWeek: "Week 32",
        quantity: 1,
        isCustom: false,
      },
    ],
    selectedTemplate: "promotional-campaign",
    additionalAssetDetails: "",
    watermarkFiles: false,
    attachedDocuments: [],
  };
}

export default function BriefSinglePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeName } = useActiveNav();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");

  // Check if we're coming from Projects page with project data
  const projectData = (location.state as { project?: { id: number; name: string; dueDate?: string; team: string; owners: string[] } } | undefined)?.project;
  
  // Convert project data to brief form values if available, otherwise use mock data
  const briefData = useMemo(() => {
    if (projectData) {
      return projectToBriefFormValues(projectData);
    }
    return mockBriefData;
  }, [projectData]);

  const topbarRight = <DashboardTopbarRight />;

  const projectLeadLabel = briefData.projectLead && briefData.projectLead.length > 0
    ? briefData.projectLead
        .map((leadValue) => PROJECT_LEADS.find((lead) => lead.value === leadValue)?.label)
        .filter((label): label is string => Boolean(label))
        .join(", ")
    : "";

  const formattedDueDate = briefData.dueDate ? format(briefData.dueDate, "MMMM d, yyyy") : "";
  const formattedDueDateShort = briefData.dueDate ? format(briefData.dueDate, "d MMM") : "";

  const selectedTemplateName = FORM_TEMPLATE_OPTIONS.find((option) => option.id === briefData.selectedTemplate)?.title || "";

  const tokenEstimate = briefData.assets
    .filter((asset) => !asset.isCustom)
    .reduce((total, asset) => total + asset.tokenPrice * asset.quantity, 0);

  const hasCustomAssets = briefData.assets.some((asset) => asset.isCustom);

  const handlePostComment = () => {
    if (!newComment.trim()) {
      return;
    }

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Samsung", // Assuming current user is Samsung
      authorAvatar: "samsung",
      message: newComment.trim(),
      timestamp: new Date(),
      isIris: false,
    };

    setComments([...comments, comment]);
    setNewComment("");
    toast.success("Comment posted successfully");
  };

  const titleNode = (
    <div className="flex items-center gap-2">
      <button onClick={() => navigate("/dashboard/briefs")} className="hover:opacity-70 transition">
        <ArrowLeft size={20} className="text-black" />
      </button>
      <span className="text-sm leading-[19.6px] text-black">{briefData.projectTitle}</span>
    </div>
  );

  return (
    <DashboardLayout
      title={titleNode}
      onNavigate={(path) => navigate(path)}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="px-4 md:px-6 pt-[24px] md:pt-[40px] pb-[24px] md:pb-[40px] max-w-full overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 overflow-x-hidden">
          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0 max-w-full">
            {/* General Information Section */}
            <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-6 max-w-full min-w-0">
              <div className="flex flex-col gap-2">
                <h3 className="text-[21.6px] font-semibold text-black">General information</h3>
                <p className="text-sm text-[#424242]">Project details and key information.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                <Field label="Project title" helpText="Give your brief a short, clear name">
                  <StyledInput
                    value={briefData.projectTitle}
                    readOnly
                    variant="brief"
                    className="bg-[#f9f9f9] cursor-default"
                  />
                </Field>
                <Field label="Delivery date" helpText="When is this project due?">
                  <div className="flex items-center gap-2 border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto bg-[#f9f9f9] text-black">
                    <CalendarIcon size={16} className="text-[#848487]" />
                    <span>{formattedDueDate}</span>
                  </div>
                </Field>
                <Field label="Project lead" helpText="Who will lead this project?">
                  <div className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto bg-[#f9f9f9] text-black">
                    {projectLeadLabel || "—"}
                  </div>
                </Field>
              </div>
            </section>

            {/* Project Description Section */}
            <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-6 max-w-full min-w-0">
              <div className="flex flex-col gap-2">
                <h3 className="text-[21.6px] font-semibold text-black">Project description</h3>
                <p className="text-sm text-[#424242]">Context and objectives for this brief.</p>
              </div>
              <Field label="Brief summary" helpText="">
                <Textarea
                  value={briefData.briefSummary}
                  readOnly
                  className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[90px] resize-none bg-[#f9f9f9] text-black cursor-default"
                />
              </Field>

              <Field label="Objective" helpText="">
                <Textarea
                  value={briefData.objective}
                  readOnly
                  className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[110px] resize-none bg-[#f9f9f9] text-black cursor-default"
                />
              </Field>

              {/* Work type, Channels, Expected outputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
                <Field label="Work type" helpText="Select the primary workstream">
                  <div className="border border-[#e0e0e0] rounded-lg px-4 py-3 bg-[#f9f9f9] min-h-[44px] flex items-center">
                    {briefData.workType.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {briefData.workType.map((type) => (
                          <span
                            key={type}
                            className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs text-[#424242]"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#848487]">—</span>
                    )}
                  </div>
                </Field>
                <Field label="Channels" helpText="Where will this campaign live?">
                  <div className="border border-[#e0e0e0] rounded-lg px-4 py-3 bg-[#f9f9f9] min-h-[44px] flex items-center">
                    {briefData.channels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {briefData.channels.map((channel) => (
                          <span
                            key={channel}
                            className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs text-[#424242]"
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#848487]">—</span>
                    )}
                  </div>
                </Field>
                <Field label="Expected outputs" helpText="What should Iris deliver?">
                  <div className="border border-[#e0e0e0] rounded-lg px-4 py-3 bg-[#f9f9f9] min-h-[44px] flex items-center">
                    {briefData.expectedOutputs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {briefData.expectedOutputs.map((output) => (
                          <span
                            key={output}
                            className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs text-[#424242]"
                          >
                            {output}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#848487]">—</span>
                    )}
                  </div>
                </Field>
              </div>
            </section>

            {/* Assets Section */}
            <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-6 max-w-full min-w-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[21.6px] font-semibold text-black">Assets</h3>
                    <p className="text-sm text-[#424242]">
                      Selected assets with specifications, timing, and effort details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Template */}
              <div className="flex flex-col gap-2 border border-[#ececec] rounded-xl p-4 min-w-0">
                <h4 className="text-base font-semibold text-black">Selected template</h4>
                <p className="text-sm text-[#424242]">Template used for this brief.</p>
                {briefData.selectedTemplate && (
                  <div className="mt-2 rounded-xl border border-[#e0e0e0] px-4 py-3 bg-[#fff8ec]">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-black">{selectedTemplateName}</p>
                        <p className="text-xs text-[#6b6b6f]">Template selected</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-[#f4f4f5] flex items-center justify-center">
                        <div
                          className="template-icon"
                          dangerouslySetInnerHTML={{
                            __html: FORM_TEMPLATE_OPTIONS.find((t) => t.id === briefData.selectedTemplate)?.icon || "",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Asset Details */}
              {briefData.additionalAssetDetails && (
                <Field label="Additional asset details">
                  <Textarea
                    value={briefData.additionalAssetDetails}
                    readOnly
                    className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[90px] resize-none bg-[#f9f9f9] text-black cursor-default"
                  />
                </Field>
              )}

              {/* Assets List */}
              <div className="flex flex-col gap-5">
                {briefData.assets.map((asset, index) => {
                  const isCustom = asset.isCustom === true;
                  const totalTokens = !isCustom ? asset.tokenPrice * asset.quantity : 0;

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
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center gap-2 md:gap-4">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-black w-6 text-center">{asset.quantity}</span>
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
                          </div>
                          {!isCustom && totalTokens > 0 && (
                            <p className="text-[16.24px] leading-[14px] text-black">
                              {totalTokens} {totalTokens === 1 ? "token" : "tokens"} total
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Asset Details */}
                      {asset.assetSpecification && (
                        <div className="px-4 md:px-6 pb-4 space-y-4 border-t border-[#e0e0e0] mt-2 pt-4">
                          <Field label="Description" helpText="Deliverable expectations">
                            <Textarea
                              value={asset.assetSpecification}
                              readOnly
                              className="border-[#e0e0e0] rounded-lg px-4 py-2 min-h-[70px] bg-[#f9f9f9] text-black cursor-default"
                            />
                          </Field>
                          {asset.deliveryWeek && (
                            <Field label="Delivery week" helpText="Target sprint/week">
                              <StyledInput
                                value={asset.deliveryWeek}
                                readOnly
                                className="bg-[#f9f9f9] cursor-default"
                              />
                            </Field>
                          )}
                        </div>
                      )}
                      {index < briefData.assets.length - 1 && (
                        <div className="h-px bg-[#e0e0e0] mt-5 mx-4 md:mx-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Token Estimate */}
            <div className="flex items-center gap-2 pt-4 pb-2">
              <div className="flex gap-4 items-center pb-2">
                <span className="h-10 w-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0016 16.6012C13.3865 16.6012 16.1306 15.5303 16.1306 14.2093C16.1306 12.8882 13.3865 11.8173 10.0016 11.8173C6.61662 11.8173 3.87256 12.8882 3.87256 14.2093C3.87256 15.5303 6.61662 16.6012 10.0016 16.6012Z" fill="#03B3E2" />
                    <path d="M10.0016 7.54461C13.387 7.54461 16.1306 8.61587 16.1306 9.93653C16.1306 11.2572 13.387 12.3284 10.0016 12.3284C6.6161 12.3284 3.87256 11.2572 3.87256 9.93653C3.87256 8.61587 6.6161 7.54461 10.0016 7.54461Z" fill="#03B3E2" />
                    <path d="M10.0018 8.05164C13.3867 8.05164 16.1308 6.98073 16.1308 5.65972C16.1308 4.33871 13.3867 3.26782 10.0018 3.26782C6.61682 3.26782 3.87276 4.33871 3.87276 5.65972C3.87276 6.98073 6.61682 8.05164 10.0018 8.05164Z" fill="#03B3E2" />
                  </svg>
                </span>
                <span className="text-[26px] leading-[37.24px] text-black font-medium">{tokenEstimate}</span>
                <span className="text-[26px] leading-[37.24px] text-[#848487]">Tokens estimate</span>
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
          </div>

          {/* Preview Panel - Desktop only */}
          <div className="hidden lg:flex flex-col gap-2.5 pb-5 w-full max-w-md mt-5">
            <div className="bg-white rounded-xl min-h-[600px] w-full p-6 flex items-start justify-start">
              <div className="w-full">
                <BriefPreviewPanel
                  projectTitle={briefData.projectTitle}
                  launchDate={formattedDueDate}
                  projectLead={projectLeadLabel}
                  objective={briefData.objective.trim()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="rounded-2xl border border-[#ececec] bg-white/80 p-4 md:p-6 space-y-6 max-w-full min-w-0 mt-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[21.6px] font-semibold text-black">Comments</h3>
            <p className="text-sm text-[#424242]">Exchange messages with Iris about this brief.</p>
          </div>

          {/* Comments List */}
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`flex gap-3 ${comment.isIris ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/personas/png?seed=${comment.authorAvatar}&size=64`}
                      alt={comment.author}
                    />
                    <AvatarFallback className="text-sm bg-gradient-to-br from-blue-200 to-blue-300">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col gap-1 flex-1 ${comment.isIris ? "items-start" : "items-end"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-black">{comment.author}</span>
                    <span className="text-xs text-[#848487]">
                      {format(comment.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl px-4 py-3 max-w-[80%] ${
                      comment.isIris
                        ? "bg-[#efeff0] text-black"
                        : "bg-[#03b3e2] text-white"
                    }`}
                  >
                    <p className="text-sm leading-[18.62px] whitespace-pre-wrap">{comment.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#ececec]">
            <div className="flex gap-3">
              <div className="shrink-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/personas/png?seed=samsung&size=64"
                    alt="Samsung"
                  />
                  <AvatarFallback className="text-sm bg-gradient-to-br from-blue-200 to-blue-300">
                    S
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="border-[#e0e0e0] rounded-lg px-4 py-3 min-h-[80px] resize-none bg-white text-black placeholder:text-[#848487]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handlePostComment();
                    }
                  }}
                />
                <div className="flex items-center justify-end">
                  <button
                    onClick={handlePostComment}
                    disabled={!newComment.trim()}
                    className={`px-6 py-2 rounded-[28px] text-sm font-semibold transition flex items-center gap-2 ${
                      newComment.trim()
                        ? "bg-[#03b3e2] text-white hover:opacity-90"
                        : "bg-[#f4f4f5] text-[#9c9c9f] cursor-not-allowed"
                    }`}
                  >
                    <Send size={16} />
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Make Change Request Button */}
        <div className="flex justify-end mt-6 pb-6">
          <Button
            onClick={() => {
              navigate("/dashboard/briefs", {
                state: {
                  createBrief: true,
                  showForm: true,
                  brief: briefData,
                  isChangeRequest: true,
                },
              });
            }}
            className="h-10 px-6 bg-[#ffb546] hover:opacity-90 text-black font-semibold"
          >
            Make change request
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

