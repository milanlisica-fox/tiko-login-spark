import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, Calculator, Coins, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Reuse images from Dashboard for consistent visuals
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

// Calculator page images from Figma
const imgVector = "https://www.figma.com/api/mcp/asset/e5ad3caa-ae8a-4a50-bf19-1b64b4af5b0d";
const imgAddIcon = "https://www.figma.com/api/mcp/asset/9c51923b-a312-4806-a849-b3153cd79f25";
const imgLine1 = "https://www.figma.com/api/mcp/asset/4abfb8ca-b3e4-4df4-baaf-053bad2c366f";
const imgLine2 = "https://www.figma.com/api/mcp/asset/d8757d5f-13a1-4ad3-a2b2-9bb7089e7474";
const imgLine3 = "https://www.figma.com/api/mcp/asset/aa16c5fe-bc77-49e7-aa09-b4f89c8f9e3b";
const imgLine4 = "https://www.figma.com/api/mcp/asset/c5e7ad14-5fa0-45e1-a45f-087c7c3e1ac2";
const imgFilterIcon = "https://www.figma.com/api/mcp/asset/706f891b-4f48-4e51-806b-1f5f530c1a5e";
const imgCloseIcon = "https://www.figma.com/api/mcp/asset/f58fe468-be67-42a7-ae74-00e8fb7a65eb";
const imgGroup = "https://www.figma.com/api/mcp/asset/5fe2ecb6-5d0e-42f1-b3e1-1f7e44923017";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/b69bb386-15dd-4f1e-be68-813b455d322a";
const imgGroup2 = "https://www.figma.com/api/mcp/asset/d6d594a8-9b54-4879-9845-da876b8858de";
const imgCloseIconNew = "https://www.figma.com/api/mcp/asset/3e214e68-a6bb-45d0-9e83-b4607c7d9ce4";
const imgDividerLine = "https://www.figma.com/api/mcp/asset/0ca49fc0-92af-4787-9156-c3fcac336f4c";

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
  const location = useLocation();
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<string[]>([]);
  const [selectedNDA, setSelectedNDA] = useState<string[]>([]);
  const [selectedTaskType, setSelectedTaskType] = useState<string[]>([]);

  const navItems = useMemo(
    () => [
      { name: "Central", icon: Home, path: "/dashboard" },
      { name: "Briefs", icon: FileText, path: "/dashboard/briefs", hasNotification: true },
      { name: "Projects", icon: Folder, path: "/dashboard/projects" },
      { name: "Tracker", icon: BarChart2, path: "/dashboard/tracker" },
    ],
    []
  );

  const activeName = useMemo(() => {
    if (location.pathname.startsWith("/dashboard/briefs")) return "Briefs";
    if (location.pathname === "/dashboard") return "Central";
    if (location.pathname.startsWith("/dashboard/projects")) return "Projects";
    if (location.pathname.startsWith("/dashboard/tracker")) return "Tracker";
    if (location.pathname.startsWith("/dashboard/calculator")) return "Calculator";
    return "Central";
  }, [location.pathname]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

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

  return (
    <div className="flex h-screen bg-[#f9f9f9] relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#f7f7f7] border-r border-[#d9d9d9] flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-[70px] flex items-center justify-start px-8 py-4">
            <div className="flex items-center gap-1.5">
              <img src={logoImage} alt="TIKO" className="h-8" />
              <img src={logoDot} alt="" className="w-[14.6px] h-[14.6px]" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px relative">
            <img src={dividerImage} alt="" className="w-full h-full" />
          </div>

          {/* Navigation */}
          <nav className="pt-8 px-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeName === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-2 px-4 py-4 rounded-lg transition relative ${
                    isActive ? "bg-white" : "bg-transparent hover:bg-white/50"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-black" : "text-black"} />
                  <span className={`text-sm leading-[19.6px] ${isActive ? "font-semibold" : "font-normal"} text-black`}>
                    {item.name}
                  </span>
                  {item.hasNotification && (
                    <div className="absolute left-[13px] top-0.5 w-2 h-2 bg-[#ff4337] border-2 border-[#f7f7f7] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-4 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-4 rounded-lg transition hover:bg-white/50"
          >
            <LogOut size={20} className="text-black" />
            <span className="text-sm leading-[19.6px] font-normal text-black">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-4 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-4 py-4 rounded-lg">
            <Home size={20} className="text-black" />
            <span className="text-sm leading-[19.6px] text-black">Quick calculator</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6 pr-[30px]">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 relative cursor-pointer">
                  <Bell size={24} className="text-[#848487]" />
                  <div className="absolute -left-1 -top-1 min-w-[20px] h-5 bg-[#ff4337] border-2 border-[#f7f7f7] rounded-full flex items-center justify-center px-1">
                    <span className="text-[10px] font-bold leading-[14px] text-white">3</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent 
                align="end" 
                sideOffset={10}
                className="w-80 p-0 bg-white border border-[#e0e0e0] shadow-lg"
              >
                <div className="p-4 border-b border-[#e0e0e0]">
                  <h3 className="text-base font-bold leading-[21.28px] text-black">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Mock notification items */}
                  <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">
                          New brief submitted
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#646464]">
                          Sarah Johnson submitted a new brief for review
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#848487] mt-1">
                          2 hours ago
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
                    </div>
                  </div>
                  <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">
                          Project milestone reached
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#646464]">
                          "Fold Toolkit Q3 2025" has reached 50% completion
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#848487] mt-1">
                          5 hours ago
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
                    </div>
                  </div>
                  <div className="p-4 border-b border-[#f1f1f3] hover:bg-[#f9f9f9] cursor-pointer transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-[18.62px] text-black mb-1">
                          Brief approved
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#646464]">
                          Your brief "S Series OOH Campaign" has been approved
                        </p>
                        <p className="text-xs leading-[15.96px] text-[#848487] mt-1">
                          1 day ago
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#ff4337] rounded-full flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-[#e0e0e0]">
                  <button className="w-full text-xs font-semibold leading-[15.96px] text-[#646464] hover:text-black transition">
                    View all notifications
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Tokens */}
            <div className="flex items-center gap-1">
              <Coins size={20} className="text-[#848487]" />
              <span className="text-xs leading-[15.96px] text-[#646464]">372 Tokens</span>
            </div>

            {/* User Profile */}
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold leading-[18.62px] text-[#646464]">Henry Bray</p>
                <p className="text-xs leading-[15.96px] text-[#646464]">Marcomms</p>
              </div>
              <ChevronDown size={24} className="text-[#646464] rotate-90" />
            </button>
          </div>
        </header>

        {/* Calculator Content */}
        <section className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px] relative">
          {/* Filter Bar */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#f1f1f3] rounded-[54px] px-6 py-2 flex items-center gap-6 mb-6 hover:bg-[#e5e5e5] transition"
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

          {/* Main Content Area */}
          <div className="flex gap-8">
            {/* Left Panel - Asset List */}
            <div className="flex-1 max-w-[720px]">
              <h1 className="text-[28px] font-bold leading-[37.24px] text-black mb-10">
                Build your asset list
              </h1>

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
                                className="w-8 h-8 rounded-full bg-[#f1f1f3] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                              >
                                <span className="text-[#03B3E2] text-lg">−</span>
                              </button>
                              <span className="text-sm font-bold text-black w-6 text-center">
                                {quantity}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => handleAddAsset(asset)}
                            className="w-8 h-8 rounded-full bg-[#f1f1f3] flex items-center justify-center hover:bg-[#e5e5e5] transition"
                          >
                            <img src={imgAddIcon} alt="Add" className="w-[17.778px] h-[17.778px]" />
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
            <div className="w-px bg-[#e0e0e0]" />

            {/* Right Panel - Summary */}
            <div className="w-[368px] shrink-0">
              <h2 className="text-[28px] font-bold leading-[37.24px] text-black mb-10">
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
                className="mt-auto w-full px-6 py-[18px] bg-[#f9f9f9] rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition mt-6"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-[#848487]">
                  Create Brief
                </span>
                <img src={imgVector} alt="" className="w-[15.567px] h-[14px]" />
              </button>
            </div>
          </div>
        </section>

        {/* Decorative Background Elements */}
        <div className="absolute bottom-[-18px] right-[-17px] w-[433px] h-[184px] pointer-events-none overflow-hidden">
          <img src={imgGroup} alt="" className="absolute bottom-0 right-0 opacity-20" />
          <img src={imgGroup1} alt="" className="absolute top-1/2 right-0 opacity-20" />
          <img src={imgGroup2} alt="" className="absolute top-0 right-0 opacity-20" />
        </div>
      </main>

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
  );
}

