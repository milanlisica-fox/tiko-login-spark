import { useState } from "react";
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

  const handleCreateBrief = () => {
    toast.success("Creating brief with selected assets...");
    navigate("/dashboard/briefs");
  };

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
              <h1 className="text-xl md:text-[28px] font-bold leading-[37.24px] text-black mb-6 md:mb-10 md:text-center lg:text-left">
                Build your asset list
              </h1>
              {/* Filter Bar */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="bg-[#f1f1f3] rounded-[54px] px-6 py-2 flex items-center gap-6 mb-6 hover:bg-[#e5e5e5] transition md:w-fit md:mx-auto lg:mx-0"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold leading-[18.62px] text-black">Asset</p>
                  <p className="text-xs leading-[15.96px] text-[#848487]">Any asset type</p>
                </div>
                <div className="w-px h-8 bg-[#e0e0e0]" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold leading-[18.62px] text-black">NDA</p>
                  <p className="text-xs leading-[15.96px] text-[#848487]">Any NDA type</p>
                </div>
                <div className="w-px h-8 bg-[#e0e0e0]" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold leading-[18.62px] text-black">Task</p>
                  <p className="text-xs leading-[15.96px] text-[#848487]">Any task type</p>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8 rounded-full bg-[#ffb546] flex items-center justify-center">
                    <img src={imgFilterIcon} alt="Filter" className="w-4 h-4" />
                  </div>
                </div>
              </button>

              <div className="flex flex-col gap-5">
                {availableAssets.map((asset, index) => {
                  const selectedAsset = selectedAssets.find((a) => a.id === asset.id);
                  const quantity = selectedAsset?.quantity || 0;

                  return (
                    <div key={asset.id}>
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm leading-[18.62px] text-black">
                            {asset.title}
                          </p>
                          <p className="text-[10px] leading-[14px] text-black">
                            {asset.tokens} {asset.tokens === 1 ? "token" : "tokens"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {quantity > 0 && (
                            <>
                              <button
                                onClick={() => handleRemoveAsset(asset.id)}
                                className="w-8 h-8 rounded-full bg-[#03B3E2] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                              >
                                <span className="text-[#fff] text-lg">−</span>
                              </button>
                              <span className="next text-sm font-bold text-black w-6 text-center">
                                {quantity}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => handleAddAsset(asset)}
                            className="plus w-8 h-8 rounded-full bg-[#f1f1f3] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                          >
                            <img src={imgAddIcon} alt="Add" className="plusicon w-[17.778px] h-[17.778px]" />
                          </button>
                        </div>
                      </div>
                      {index < availableAssets.length - 1 && (
                        <div className="h-px bg-[#e0e0e0] mt-5" />
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
                <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
              </button>
              
              {/* Decorative Background Elements */}
              <div className="hidden lg:block absolute bottom-0 right-[-17px] w-full h-[54px] pointer-events-none overflow-hidden z-0">
                <img
                  src="https://www.figma.com/api/mcp/asset/5fe2ecb6-5d0e-42f1-b3e1-1f7e44923017"
                  alt=""
                  className="absolute bottom-0 right-0 w-full h-[54px] object-cover opacity-70"
                />
              </div>
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
              className="absolute right-[20px] top-[20px] w-[58px] p-4 flex items-center justify-center hover:bg-[#f1f1f3] rounded-[8px] transition"
            >
              <div className="w-6 h-6 overflow-hidden relative">
                <img src={imgCloseIconNew} alt="Close" className="w-full h-full" />
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
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 h-[32px] bg-gray-200 hover:bg-gray-300 backdrop-blur-[6px] rounded-[28px] px-6 py-[18px]"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">
                  Cancel
                </span>
              </Button>
              <Button
                onClick={() => {
                  setIsFilterOpen(false);
                  toast.success("Filters applied");
                }}
                className="flex-1 h-[32px] bg-[#ffb546] hover:opacity-90 backdrop-blur-[6px] rounded-[28px] px-6 py-[18px]"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">
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

