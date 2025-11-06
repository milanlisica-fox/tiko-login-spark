import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, Calculator, Coins, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND } from "@/constants/branding";
import { CALCULATOR_ASSETS } from "@/constants/calculator-assets";

// Reuse images from Dashboard for consistent visuals
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

// Calculator page images from Figma
const imgVector = CALCULATOR_ASSETS.imgVector;
const imgAddIcon = CALCULATOR_ASSETS.imgAddIcon;
const imgLine1 = CALCULATOR_ASSETS.imgLine1;
const imgLine2 = CALCULATOR_ASSETS.imgLine2;
const imgLine3 = CALCULATOR_ASSETS.imgLine3;
const imgLine4 = CALCULATOR_ASSETS.imgLine4;
const imgFilterIcon = CALCULATOR_ASSETS.imgFilterIcon;
const imgCloseIcon = CALCULATOR_ASSETS.imgCloseIcon;
const imgGroup = CALCULATOR_ASSETS.imgGroup;
const imgGroup1 = CALCULATOR_ASSETS.imgGroup1;
const imgGroup2 = CALCULATOR_ASSETS.imgGroup2;
const imgCloseIconNew = CALCULATOR_ASSETS.imgCloseIconNew;
const imgDividerLine = CALCULATOR_ASSETS.imgDividerLine;
const createBriefArrowIcon = CALCULATOR_ASSETS.createBriefArrowIcon;

interface AssetItem {
  id: string;
  title: string;
  tokens: number;
}

interface SelectedAsset {
  id: string;
  quantity: number;
  tokens: number;
}

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<string[]>([]);
  const [selectedNDA, setSelectedNDA] = useState<string[]>([]);
  const [selectedTaskType, setSelectedTaskType] = useState<string[]>([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  // Available assets from Figma design
  const availableAssets: AssetItem[] = [
    { id: "1", title: "Non Editable Image Files Adapted Under NDA", tokens: 3 },
    { id: "2", title: "Non Editable Image Files Adapted Non NDA", tokens: 3 },
    { id: "3", title: "Editable Image Files Adapted Under NDA", tokens: 5 },
    { id: "4", title: "Editable Image Files Adapted Non NDA", tokens: 10 },
    { id: "5", title: "PDF Files Adapted Under NDA", tokens: 10 },
    { id: "6", title: "PDF Files Adapted Non NDA", tokens: 10 },
    { id: "7", title: "PPT Files Created Under NDA", tokens: 14 },
    { id: "8", title: "PPT Files Created Non NDA", tokens: 14 },
    { id: "9", title: "Doc Files Created Under NDA", tokens: 3 },
    { id: "10", title: "Doc Files Created Non NDA", tokens: 3 },
    { id: "11", title: "Video File Created Under NDA", tokens: 15 },
    { id: "12", title: "Video File Created Non NDA", tokens: 3 },
  ];

  const handleAddAsset = (asset: AssetItem) => {
    const existingAsset = selectedAssets.find((a) => a.id === asset.id);
    if (existingAsset) {
      setSelectedAssets(
        selectedAssets.map((a) =>
          a.id === asset.id ? { ...a, quantity: a.quantity + 1 } : a
        )
      );
    } else {
      setSelectedAssets([...selectedAssets, { ...asset, quantity: 1 }]);
    }
  };

  const handleRemoveAsset = (assetId: string) => {
    const asset = selectedAssets.find((a) => a.id === assetId);
    if (asset && asset.quantity > 1) {
      setSelectedAssets(
        selectedAssets.map((a) =>
          a.id === assetId ? { ...a, quantity: a.quantity - 1 } : a
        )
      );
    } else {
      setSelectedAssets(selectedAssets.filter((a) => a.id !== assetId));
    }
  };

  const totalTokens = selectedAssets.reduce(
    (sum, asset) => sum + asset.tokens * asset.quantity,
    0
  );

  const assetTypeOptions = [
    "Animated Key Visual",
    "Digi Banners",
    "Feature Key Visual",
    "Icon",
    "Image",
    "Key Visual",
    "Media",
    "Roundel",
    "Sales Enablement",
    "Screenfills",
    "Storyboard",
    "Toolkit",
    "TVC",
    "Urgency Tag",
    "USB Copy",
    "Video",
  ];

  const ndaOptions = ["Under NDA", "Non NDA"];
  const taskTypeOptions = ["Creation", "Adaptation", "Resize"];

  // Helper function to parse asset title and extract filter information
  const parseAssetTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    // Extract asset type
    let assetType = "";
    if (lowerTitle.includes("image")) {
      assetType = "Image";
    } else if (lowerTitle.includes("video")) {
      assetType = "Video";
    } else if (lowerTitle.includes("pdf")) {
      assetType = "Media"; // PDF could be considered Media
    } else if (lowerTitle.includes("ppt")) {
      assetType = "Media"; // PPT could be considered Media
    } else if (lowerTitle.includes("doc")) {
      assetType = "Media"; // Doc could be considered Media
    }
    
    // Extract task type
    let taskType = "";
    if (lowerTitle.includes("created")) {
      taskType = "Creation";
    } else if (lowerTitle.includes("adapted")) {
      taskType = "Adaptation";
    }
    
    // Extract NDA status
    let ndaStatus = "";
    if (lowerTitle.includes("under nda")) {
      ndaStatus = "Under NDA";
    } else if (lowerTitle.includes("non nda")) {
      ndaStatus = "Non NDA";
    }
    
    return { assetType, taskType, ndaStatus };
  };

  // Filter assets - show every second asset when filters are applied
  const filteredAssets = useMemo(() => {
    // If filters are applied, show every second asset (indices 0, 2, 4, 6, etc.)
    if (filtersApplied) {
      return availableAssets.filter((_, index) => index % 2 === 0);
    }
    
    // Otherwise, show all assets
    return availableAssets;
  }, [availableAssets, filtersApplied]);

  // Get display text for filter bar
  const getAssetTypeDisplay = () => {
    if (selectedAssetType.length === 0) return "Any asset type";
    if (selectedAssetType.length === 1) return selectedAssetType[0];
    return `${selectedAssetType.length} asset types`;
  };

  const getNDADisplay = () => {
    if (selectedNDA.length === 0) return "Any NDA type";
    if (selectedNDA.length === 1) return selectedNDA[0];
    return `${selectedNDA.length} NDA types`;
  };

  const getTaskTypeDisplay = () => {
    if (selectedTaskType.length === 0) return "Any task type";
    if (selectedTaskType.length === 1) return selectedTaskType[0];
    return `${selectedTaskType.length} task types`;
  };

  const handleCreateBrief = () => {
    toast.success("Creating brief with selected assets...");
    navigate("/dashboard/briefs", {
      state: {
        createBrief: true,
        showForm: true,
      },
    });
  };

  const handleResetFilters = () => {
    setSelectedAssetType([]);
    setSelectedNDA([]);
    setSelectedTaskType([]);
    setFiltersApplied(false);
    toast.success("Filters reset");
  };

  const hasActiveFilters = filtersApplied || selectedAssetType.length > 0 || selectedNDA.length > 0 || selectedTaskType.length > 0;

  const topbarRight = <DashboardTopbarRight />;

  const titleNode = (
    <div className="flex items-center gap-2">
      <Home size={20} className="text-black" />
      <span className="text-sm leading-[19.6px] text-black">Quick calculator</span>
    </div>
  );

  return (
    <DashboardLayout
      title={titleNode}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="px-4 md:px-6 pt-[24px] md:pt-[40px] pb-[24px] md:pb-[40px] relative">

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Asset List */}
            <div className="flex-1 lg:max-w-[1220px]">
              <h1 className="h1-heading text-xl md:text-[28px] font-bold leading-[37.24px] text-black mb-6 md:mb-10 md:text-center lg:text-left">
                Build your asset list
              </h1>
              {/* Filter Bar */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="bg-[#f1f1f3] rounded-[54px] px-4 md:px-6 py-2 flex items-center gap-2 md:gap-4 lg:gap-6 hover:bg-[#e5e5e5] transition flex-1"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-sm font-bold leading-[18.62px] text-black truncate">Asset</p>
                    <p className="text-xs leading-[15.96px] text-[#848487] truncate">{getAssetTypeDisplay()}</p>
                  </div>
                  <div className="w-px h-8 bg-[#e0e0e0] shrink-0" />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-sm font-bold leading-[18.62px] text-black truncate">NDA</p>
                    <p className="text-xs leading-[15.96px] text-[#848487] truncate">{getNDADisplay()}</p>
                  </div>
                  <div className="w-px h-8 bg-[#e0e0e0] shrink-0" />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-sm font-bold leading-[18.62px] text-black truncate">Task</p>
                    <p className="text-xs leading-[15.96px] text-[#848487] truncate">{getTaskTypeDisplay()}</p>
                  </div>
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#ffb546] flex items-center justify-center">
                      <svg   className="w-4 h-4"  xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M11.026 0.0996094C11.3327 0.0996094 11.5816 0.348498 11.5816 0.655165C11.5816 0.962572 11.3327 1.21072 11.026 1.21072H0.655653C0.348987 1.21072 0.100098 0.962572 0.100098 0.655165C0.100098 0.348498 0.348987 0.0996094 0.655653 0.0996094H11.026ZM5.2801 4.91146C5.58602 4.91146 5.83565 5.16035 5.83565 5.46702C5.83565 5.77442 5.58602 6.02257 5.2801 6.02257L0.655653 6.02554C0.348987 6.02554 0.100098 5.77739 0.100098 5.46998C0.100098 5.16331 0.348987 4.91442 0.655653 4.91442L5.2801 4.91146ZM5.2801 9.72776C5.58602 9.72776 5.83565 9.97665 5.83565 10.2833C5.83565 10.5907 5.58602 10.8389 5.2801 10.8389L0.655653 10.8404C0.348987 10.8404 0.100098 10.5922 0.100098 10.2848C0.100098 9.97813 0.348987 9.72924 0.655653 9.72924L5.2801 9.72776ZM11.1031 4.63294C11.4008 4.63294 11.5119 4.80331 11.546 4.87665C11.5801 4.94998 11.6386 5.14479 11.4453 5.37146L9.7401 7.31739V10.6129C9.7401 10.9189 9.49121 11.1678 9.18528 11.1678C8.87936 11.1678 8.63047 10.9189 8.63047 10.6129V7.30998L6.9238 5.37146C6.73121 5.14479 6.78899 4.94998 6.82306 4.87665C6.85713 4.80331 6.96825 4.63294 7.26676 4.63294H11.1031Z" fill="black" stroke="black" stroke-width="0.2"/>
</svg>
                    </div>
                  </div>
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="bg-[#ffb546] rounded-[54px] px-4 md:px-6 py-2 flex items-center gap-2 hover:opacity-90 transition whitespace-nowrap"
                  >
                    <span className="text-sm font-semibold leading-[18.62px] text-black">Reset filters</span>
                    <X size={16} className="text-black" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5 w-full">
                {filteredAssets.map((asset, index) => {
                    const selectedAsset = selectedAssets.find((a) => a.id === asset.id);
                    const quantity = selectedAsset?.quantity || 0;

                    return (
                      <div key={asset.id} className="w-full">
                        <div className="flex items-center justify-between px-4 md:px-6 py-2 w-full">
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-4">
                            <p className="text-sm leading-[18.62px] text-black truncate">
                              {asset.title}
                            </p>
                            <p className="text-[10px] leading-[14px] text-black">
                              {asset.tokens} {asset.tokens === 1 ? "token" : "tokens"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            {quantity > 0 && (
                              <>
                                <button
                                  onClick={() => handleRemoveAsset(asset.id)}
                                  className="next w-8 h-8 rounded-full bg-[#03B3E2] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                                >
                                  <span className="text-[#fff] text-lg">−</span>
                                </button>
                                <span className="text-sm font-bold text-black w-6 text-center">
                                  {quantity}
                                </span>
                              </>
                            )}
                            <button
                              onClick={() => handleAddAsset(asset)}
                              className="plus w-8 h-8 rounded-full bg-[#f1f1f3] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                            >
                              <svg className="plusicon w-[17.778px] h-[17.778px]" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M13.0631 6.30331H7.41491V0.655165C7.41491 0.348498 7.16602 0.0996094 6.85936 0.0996094C6.55269 0.0996094 6.3038 0.348498 6.3038 0.655165V6.30331H0.655653C0.348987 6.30331 0.100098 6.5522 0.100098 6.85887C0.100098 7.16554 0.348987 7.41442 0.655653 7.41442H6.3038V13.0626C6.3038 13.3692 6.55269 13.6181 6.85936 13.6181C7.16602 13.6181 7.41491 13.3692 7.41491 13.0626V7.41442H13.0631C13.3697 7.41442 13.6186 7.16554 13.6186 6.85887C13.6186 6.5522 13.3697 6.30331 13.0631 6.30331Z" fill="#03B3E2" stroke="#03B3E2" stroke-width="0.2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        {index < filteredAssets.length - 1 && (
                          <div className="h-px bg-[#e0e0e0] mt-5 mx-4 md:mx-6" />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px bg-[#e0e0e0]" />

            {/* Right Panel - Summary */}
            <div className="w-full lg:w-[400px] shrink-0 relative overflow-hidden">
              <h2 className="text-xl md:text-[28px] font-bold leading-[37.24px] text-black mb-6 md:mb-10">
                Summary
              </h2>

              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold leading-[18.62px] text-black flex-1">
                    Asset
                  </p>
                  <p className="text-sm font-bold leading-[18.62px] text-black w-[65px]">
                    Quantity
                  </p>
                  <p className="text-sm font-bold leading-[18.62px] text-black text-right w-[70px]">
                    Tokens
                  </p>
                </div>

                {/* Asset List */}
                <div className="min-h-[126px]">
                  {selectedAssets.length === 0 ? (
                    <p className="text-base leading-normal text-[#848487]">
                      No assets added yet
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {selectedAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between">
                          <p className="text-sm leading-[18.62px] text-black flex-1">
                            {availableAssets.find((a) => a.id === asset.id)?.title || ""}
                          </p>
                          <p className="text-sm leading-[18.62px] text-black w-[65px]">
                            {asset.quantity}
                          </p>
                          <p className="text-sm leading-[18.62px] text-black text-right w-[70px]">
                            {asset.tokens * asset.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                {selectedAssets.length > 0 && (
                  <>
                    <div className="h-px bg-[#e0e0e0]" />
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold leading-[18.62px] text-black">
                        Total
                      </p>
                      <p className="text-sm font-bold leading-[18.62px] text-black">
                        {totalTokens} tokens
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Create Brief Button */}
              <button
                onClick={handleCreateBrief}
                className="mt-8 md:-mt-[30px] lg:mt-8 w-full h-10 backdrop-blur-[6px] backdrop-filter bg-[#ffb546] px-[24px] rounded-[28px] flex items-center justify-center gap-[10px] hover:opacity-90 transition relative z-10"
              >
                <span className="text-[16px] font-semibold leading-[23.94px] text-black whitespace-nowrap">
                  Create brief
                </span>
                <svg className="h-[14px] w-[15.567px]" width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z" fill="#000"></path>
                    </svg>
              </button>
              
              {/* Decorative Background Elements */}
              {/* <div className="hidden lg:block absolute bottom-0 right-[-17px] w-full h-[54px] pointer-events-none overflow-hidden z-0">
                <img
                  src="https://www.figma.com/api/mcp/asset/5fe2ecb6-5d0e-42f1-b3e1-1f7e44923017"
                  alt=""
                  className="absolute bottom-0 right-0 w-full h-[54px] object-cover opacity-70"
                />
              </div> */}
            </div>
          </div>
        
      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-[661px] p-[40px] rounded-[26px] shadow-[0px_13px_61px_0px_rgba(169,169,169,0.37)] bg-white">
          <DialogHeader className="relative">
            <DialogTitle className="text-[28px] font-bold leading-[37.24px] text-black">
              Filters
            </DialogTitle>
            <button
              onClick={() => setIsFilterOpen(false)}
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
              {/* Asset Type */}
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">
                  Select asset type
                </p>
                <div className="flex flex-wrap gap-[10px]">
                {assetTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (selectedAssetType.includes(type)) {
                        setSelectedAssetType(selectedAssetType.filter((t) => t !== type));
                      } else {
                        setSelectedAssetType([...selectedAssetType, type]);
                      }
                    }}
                    className={`px-[16px] py-[6px] rounded-[85px] text-[12px] leading-[15.96px] transition border ${
                      selectedAssetType.includes(type)
                        ? "bg-[#03B3E2] text-white border-[#03B3E2]"
                        : "bg-white text-black border-[#e0e0e0] hover:bg-[#f9f9f9]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

              {/* NDA */}
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">
                  NDA
                </p>
                <div className="flex flex-wrap gap-[10px]">
                {ndaOptions.map((nda) => (
                  <button
                    key={nda}
                    onClick={() => {
                      if (selectedNDA.includes(nda)) {
                        setSelectedNDA(selectedNDA.filter((n) => n !== nda));
                      } else {
                        setSelectedNDA([...selectedNDA, nda]);
                      }
                    }}
                    className={`px-[16px] py-[6px] rounded-[85px] text-[12px] leading-[15.96px] transition border ${
                      selectedNDA.includes(nda)
                        ? "bg-[#03B3E2] text-white border-[#03B3E2]"
                        : "bg-white text-black border-[#e0e0e0] hover:bg-[#f9f9f9]"
                    }`}
                    >
                    {nda}
                  </button>
                ))}
              </div>
            </div>

              {/* Task Type */}
              <div className="flex flex-col gap-[16px]">
                <p className="text-[14px] font-bold leading-[18.62px] text-[#09090a]">
                  Task type
                </p>
                <div className="flex flex-wrap gap-[10px]">
                {taskTypeOptions.map((task) => (
                  <button
                    key={task}
                    onClick={() => {
                      if (selectedTaskType.includes(task)) {
                        setSelectedTaskType(selectedTaskType.filter((t) => t !== task));
                      } else {
                        setSelectedTaskType([...selectedTaskType, task]);
                      }
                    }}
                    className={`px-[16px] py-[6px] rounded-[85px] text-[12px] leading-[15.96px] transition border ${
                      selectedTaskType.includes(task)
                        ? "bg-[#03B3E2] text-white border-[#03B3E2]"
                        : "bg-white text-black border-[#e0e0e0] hover:bg-[#f9f9f9]"
                    }`}
                  >
                    {task}
                  </button>
                ))}
              </div>
            </div>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-[8px]">
              <div className="h-px relative">
                <img src={imgDividerLine} alt="" className="w-full h-full" />
              </div>
              <p className="text-[14px] leading-normal opacity-[0.826] text-[#434343]">
                *You can choose multiple asset types
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[10px]">
              <Button
                variant="outline"
                onClick={() => {
                  setIsFilterOpen(false);
                  // Reset filters applied state when cancelled
                  setFiltersApplied(false);
                }}
                className="flex-1 h-[32px] bg-gray-200 hover:bg-gray-300 backdrop-blur-[6px] rounded-[28px] px-6 py-[18px]"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">
                  Cancel
                </span>
              </Button>
              <Button
                onClick={() => {
                  setIsFilterOpen(false);
                  const filterCount = selectedAssetType.length + selectedNDA.length + selectedTaskType.length;
                  
                  if (filterCount > 0) {
                    // Apply filters - this will show every second asset
                    setFiltersApplied(true);
                    const filteredCount = Math.ceil(availableAssets.length / 2);
                    toast.success(`Filters applied: showing ${filteredCount} asset(s)`);
                  } else {
                    // Clear filters - show all assets
                    setFiltersApplied(false);
                    toast.success("All filters cleared");
                  }
                }}
                className="flex-1 h-[32px] bg-[#ffb546] hover:opacity-90 backdrop-blur-[6px] rounded-[28px] px-6 py-[18px]"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">
                  Apply filters
                </span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
}

