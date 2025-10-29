import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Calculator, Coins, X, Calendar as CalendarIcon, ArrowLeft, Plus, ChevronDown as ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// Reuse images from Dashboard for consistent visuals
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

// Template icons from Figma
const iconAssetAdaptation = "https://www.figma.com/api/mcp/asset/c1a556d8-686f-44f2-88a7-ae10c1e9e2f2";
const iconBAU = "https://www.figma.com/api/mcp/asset/97b7efb4-4c30-4c6a-b0f1-00389ded9baf";
const iconPOS = "https://www.figma.com/api/mcp/asset/5538e7d7-21fd-482e-a031-dbcda03fedf1";
const iconDigitalPOS = "https://www.figma.com/api/mcp/asset/313704f8-5070-4770-b5fe-eb44c650dc2f";
const iconFeatureAsset = "https://www.figma.com/api/mcp/asset/ec129011-0fa8-488e-bd49-a3ae85c02d77";
const iconToolkit = "https://www.figma.com/api/mcp/asset/835dc746-f8b7-47a1-8471-75138a491898";
const iconPartnerships = "https://www.figma.com/api/mcp/asset/c1a556d8-686f-44f2-88a7-ae10c1e9e2f2";
const iconSocialContent = "https://www.figma.com/api/mcp/asset/5538e7d7-21fd-482e-a031-dbcda03fedf1";
const arrowRightIcon = "https://www.figma.com/api/mcp/asset/aded2578-385a-4338-976a-dd31471fba50";

// New brief form images from Figma
const briefLoadingIcon = "https://www.figma.com/api/mcp/asset/72b9b00c-3cef-4290-a604-5a85dae49da4";
const tokenIcon = "https://www.figma.com/api/mcp/asset/9b4ee3b2-4fab-4d57-a716-36af1bfb4291";

// Deliverables screen images from Figma
const imgFrame14 = "https://www.figma.com/api/mcp/asset/fe99575b-8465-4231-a868-ebd338d7488e";
const imgFrame15 = "https://www.figma.com/api/mcp/asset/73cdd6a7-1b90-41e6-92b7-d74d896ac41b";
const imgLine10 = "https://www.figma.com/api/mcp/asset/72de3633-cbde-4f52-a617-6480a78ffab1";
const imgLineStroke = "https://www.figma.com/api/mcp/asset/7526d27e-2d12-451f-8734-7948c58e1bb8";

export default function BriefsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreatingBrief, setIsCreatingBrief] = useState(false);
  const [briefView, setBriefView] = useState<"templates" | "form" | "deliverables">("templates");

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
    return "Central";
  }, [location.pathname]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#f9f9f9]">
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
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-4 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-4 py-4 rounded-lg">
            {isCreatingBrief && (briefView === "form" || briefView === "deliverables") ? (
              <>
                <button onClick={() => briefView === "deliverables" ? setBriefView("form") : setBriefView("templates")} className="flex items-center gap-2">
                  <ArrowLeft size={20} className="text-black" />
                </button>
                <span className="text-sm leading-[19.6px] text-black">New brief</span>
              </>
            ) : (
              <>
                <Home size={20} className="text-black" />
                <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6 pr-[30px]">
            {/* Notifications */}
            <div className="flex items-center gap-2 relative">
              <Bell size={24} className="text-[#848487]" />
              <div className="absolute -left-1 -top-1 w-4 h-4 bg-[#ff4337] border-2 border-[#f7f7f7] rounded-full" />
            </div>

            {/* Tokens */}
            <div className="flex items-center gap-1">
              <Coins size={20} className="text-[#848487]" />
              <span className="text-xs leading-[15.96px] text-[#646464]">372 Tokens</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold leading-[18.62px] text-[#646464]">Henry Bray</p>
                <p className="text-xs leading-[15.96px] text-[#646464]">Marcomms</p>
              </div>
              <ChevronDown size={24} className="text-[#646464] rotate-90" />
            </div>
          </div>
        </header>

        {/* Briefs Content */}
        <section className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
          {isCreatingBrief ? (
            briefView === "templates" ? (
              <TemplateSelectionScreen 
                onCancel={() => setIsCreatingBrief(false)} 
                onCreateBrief={() => setBriefView("form")}
              />
            ) : briefView === "form" ? (
              <NewBriefForm 
                onCancel={() => setBriefView("templates")} 
                onNext={() => setBriefView("deliverables")}
              />
            ) : (
              <DeliverablesSelectionScreen 
                onCancel={() => setBriefView("form")}
                onBack={() => setBriefView("form")}
              />
            )
          ) : (
            <div className="space-y-10">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-[32px] font-bold leading-[38.4px] text-black">Briefs overview</h1>
                  <p className="text-lg leading-[23.94px] text-black">Kickstart your next project with clarity and ease</p>
                </div>
                <div className="flex gap-3 h-12">
                  <button className="px-6 py-[18px] bg-[#f1f1f3] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition">
                    <Calculator size={16} />
                    <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Quick calculator</span>
                  </button>
                  <button 
                    onClick={() => setIsCreatingBrief(true)}
                    className="px-6 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition"
                  >
                    <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Create brief</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { title: "Draft briefs", value: 5 },
                  { title: "In review", value: 4 },
                  { title: "SOW Ready to sign", value: 3 },
                ].map((card, idx) => (
                  <div key={card.title} className="bg-white rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-start justify-between pb-1">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold leading-[18.62px] text-black">{card.title}</h3>
                      </div>
                    </div>
                    <p className="text-[40px] font-medium leading-[45.6px] text-black">{card.value}</p>
                    <div className="absolute right-5 top-5 w-[45px] h-10 opacity-80 bg-[#f1f1f3] rounded" />
                  </div>
                ))}
              </div>

              {/* To action on */}
              <div className="space-y-4">
                <h2 className="text-base font-semibold leading-[21.28px] text-black">To action on</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-5 flex flex-col gap-3 border border-[#ececec]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold leading-[18.62px] text-black">Performance campaign Q{i}</h3>
                        <span className="text-xs text-[#848487]">•••</span>
                      </div>
                      <p className="text-sm leading-[18.62px] text-[#646464]">Optimise for signups across paid social and display. Add UTM plan.</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs px-2 py-1 rounded-[999px] bg-[#f9f9f9] text-[#646464]">Draft</span>
                        <div className="flex -space-x-2">
                          {[0,1,2].map((a) => (
                            <div key={a} className="w-6 h-6 rounded-full bg-gray-200 ring-2 ring-white overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-px bg-[#ececec]" />
                      <div className="flex items-center justify-between text-xs text-[#848487]">
                        <div className="flex items-center gap-1">
                          <span>💬</span>
                          <span>12</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>Nov 28</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All briefs */}
              <AllBriefsSection />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function TemplateSelectionScreen({ onCancel, onCreateBrief }: { onCancel: () => void; onCreateBrief: () => void }) {
  const [activeTab, setActiveTab] = useState<"All" | "Popular" | "Recent" | "New">("All");

  const allTemplates = [
    { id: "asset-adaptation", title: "Asset adaptation", icon: iconAssetAdaptation, hasRotation: true, category: "popular" },
    { id: "bau-campaign", title: "BAU Campaign", icon: iconBAU, category: "all" },
    { id: "point-of-sale", title: "Point Of Sale", icon: iconPOS, category: "all" },
    { id: "digital-pos", title: "Digital POS", icon: iconDigitalPOS, category: "all" },
    { id: "feature-asset", title: "Feature asset", icon: iconFeatureAsset, category: "all" },
    { id: "toolkit", title: "Toolkit", icon: iconToolkit, category: "popular" },
    { id: "partnerships", title: "Partnerships", icon: iconPartnerships, hasRotation: true, category: "all" },
    { id: "social-content", title: "Social content", icon: iconSocialContent, category: "popular" },
  ];

  // Filter templates based on active tab
  const templates = allTemplates.filter((template) => {
    if (activeTab === "All") return template.category === "all" || template.category === "popular";
    if (activeTab === "Popular") return template.category === "popular";
    if (activeTab === "Recent") return template.category === "recent";
    if (activeTab === "New") return template.category === "new";
    return true;
  });

  const handleTemplateClick = (templateId: string) => {
    toast.success(`Selected template: ${templateId}`);
    // Navigate to next step or create brief with template
    onCancel();
  };

  return (
    <div className="flex flex-col gap-20 items-center justify-center w-full py-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 items-center w-full">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-[32px] font-bold leading-[38.4px] text-black text-center">
            Write your next brief in minutes
          </h1>
          <p className="text-sm leading-[18.62px] text-black text-center max-w-[600px]">
            Custom briefs, fast and easy.
            <br />
            Not sure where to begin? Try the budget planner first.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2.5 items-center">
          <button className="px-6 py-[18px] bg-[#f1f1f3] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition h-10">
            <Calculator size={16} />
            <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">Quick calculator</span>
          </button>
          <button 
            onClick={onCreateBrief}
            className="px-6 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition h-10"
          >
            <span className="text-base font-semibold leading-[23.94px] text-black whitespace-nowrap">Create brief</span>
            <img src={arrowRightIcon} alt="" className="h-[14px] w-[15.567px]" />
          </button>
        </div>
      </div>

      {/* Templates Section */}
      <div className="flex flex-col gap-6 items-start max-w-[610px] w-full">
        {/* Section Header */}
        <div className="flex flex-col gap-1 px-6">
          <h2 className="text-lg font-bold leading-[23.94px] text-black">Browse our templates collection</h2>
          <p className="text-sm leading-[18.62px] text-black">Kickstart your brief with a ready-made template.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-start px-6 gap-2">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-4 py-1.5 rounded-[28px] text-xs font-semibold leading-[14.4px] transition ${
              activeTab === "All"
                ? "bg-black text-[#fcfcff]"
                : "bg-[#f1f1f3] text-black"
            }`}
          >
            All templates
          </button>
          <button
            onClick={() => setActiveTab("Popular")}
            className={`px-4 py-1.5 rounded-[6px] text-xs leading-[14.4px] transition ${
              activeTab === "Popular"
                ? "bg-black text-[#fcfcff] font-semibold"
                : "bg-[#f1f1f3] text-black font-normal"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("Recent")}
            className={`px-4 py-1.5 rounded-[28px] text-xs font-normal leading-[14.4px] transition ${
              activeTab === "Recent"
                ? "bg-black text-[#fcfcff]"
                : "bg-[#f1f1f3] text-black"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab("New")}
            className={`px-4 py-1.5 rounded-[6px] text-xs font-normal leading-[14.4px] transition ${
              activeTab === "New"
                ? "bg-black text-[#fcfcff]"
                : "bg-[#f1f1f3] text-black"
            }`}
          >
            New
          </button>
        </div>

        {/* Template Cards */}
        <div className="flex flex-col gap-4 px-6 w-full">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template.id)}
              className="border border-[#e0e0e0] rounded-xl p-4 text-left hover:bg-[#f9f9f9] transition relative w-full group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold leading-[23.94px] text-black">{template.title}</h3>
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${template.hasRotation ? "rotate-[50.525deg]" : ""}`}>
                  <img
                    src={template.icon}
                    alt=""
                    className={`${template.hasRotation ? "h-[32.164px] w-[32.163px]" : "h-6 w-6"}`}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewBriefForm({ onCancel, onNext }: { onCancel: () => void; onNext: () => void }) {
  const [formData, setFormData] = useState({
    projectTitle: "",
    dueDate: undefined as Date | undefined,
    projectLead: "",
    objective: "",
  });

  const handleNext = () => {
    onNext();
  };

  const handleChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex gap-0 w-full">
      {/* Left Form Section */}
      <div className="flex flex-col gap-8 p-6 rounded-xl w-[564px]">
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-[18.62px] text-[#424242] w-full">
            Start your brief by filling out these required fields.
          </p>

          <div className="flex flex-col gap-6">
            {/* Project Title */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Project title
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  Give your brief a short, clear name
                </p>
              </div>
              <Input
                value={formData.projectTitle}
                onChange={(e) => handleChange("projectTitle", e.target.value)}
                placeholder="e.g. Spring Campaign 2025"
                className="border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto"
              />
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Due date
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  When is this project due?
                </p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="border border-[#e0e0e0] rounded-[85px] px-5 py-2.5 flex items-center justify-between h-auto hover:bg-[#f9f9f9]">
                    <span className="text-sm leading-[18.62px] text-[#848487]">
                      {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                    </span>
                    <CalendarIcon size={20} className="text-[#848487]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => handleChange("dueDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Project Lead */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Project lead*
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  Who will own this project?
                </p>
              </div>
              <Select value={formData.projectLead} onValueChange={(value) => handleChange("projectLead", value)}>
                <SelectTrigger className="border-[#e0e0e0] rounded-[85px] px-5 py-2.5 h-auto">
                  <SelectValue placeholder="Choose a lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="henry-bray">Henry Bray</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objective */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-sm font-bold leading-[18.62px] text-[#09090a]">
                  Objective
                </Label>
                <p className="text-xs leading-[15.96px] text-[#848487]">
                  What's the main goal of this project?
                </p>
              </div>
              <Textarea
                value={formData.objective}
                onChange={(e) => handleChange("objective", e.target.value)}
                placeholder="e.g. Increase signups by 20% through targeted ads"
                className="border-[#e0e0e0] rounded-lg px-5 py-2.5 min-h-[74px] resize-none"
                rows={3}
              />
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="h-px bg-[#e0e0e0] w-full" />
              <p className="text-sm leading-[normal] opacity-[0.826] text-[#434343]">
                *You can assign multiple leads
              </p>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="px-6 py-[18px] bg-[#f9f9f9] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition w-full"
        >
          <span className="text-sm font-semibold leading-[18.62px] text-[#848487]">Next</span>
        </button>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col gap-2.5 pb-5 pr-10 pl-2.5 pt-2.5 h-[830px] w-[601px]">
        {/* Loading State */}
        <div className="bg-white flex flex-1 flex-col gap-8 items-center justify-center p-6 rounded-xl min-h-0">
          <div className="flex flex-col gap-2 items-center">
            <img src={briefLoadingIcon} alt="" className="h-[36.966px] w-[77.813px]" />
            <p className="text-sm font-bold leading-[18.62px] opacity-50 text-[#c1c1c3]">
              Brief loading...
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[9px] relative w-full shrink-0">
          <div className="absolute h-px left-[-9px] top-[4px] w-[600px] bg-[#e0e0e0]" />
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-1 items-end shrink-0">
          {/* Token Estimate */}
          <div className="flex gap-2 items-center pb-2">
            <img src={tokenIcon} alt="" className="h-5 w-5" />
            <span className="text-[13px] leading-[18.62px] text-[#848487]">0</span>
            <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onCancel}
              className="px-2 py-[18px] bg-transparent rounded-[28px] flex items-center justify-center hover:bg-[#f1f1f3] transition h-8"
            >
              <span className="text-[13px] font-semibold leading-[18.62px] text-black">Discard</span>
            </button>
            <div className="flex gap-1 items-center">
              <button className="px-4 py-[18px] bg-[#f9f9f9] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition h-8">
                <span className="text-[13px] font-semibold leading-[18.62px] text-[#848487]">Save draft</span>
              </button>
              <button className="px-4 py-[18px] bg-[#f9f9f9] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:bg-[#e5e5e5] transition h-8">
                <span className="text-[13px] font-semibold leading-[18.62px] text-[#848487]">Generate brief</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliverablesSelectionScreen({ onCancel, onBack }: { onCancel: () => void; onBack: () => void }) {
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [tokenEstimate, setTokenEstimate] = useState(0);

  // Mock data from Figma
  const mockBriefData = {
    projectTitle: "Q7B7 Toolkit",
    launchDate: "July 23, 2025",
    projectLead: "Henry Bray",
    objective: "To create a product toolkit that provides clear guidance to help partners effectively amplify the campaign message. The toolkit should enable consistent execution, align with campaign objectives, and make it easy for users to activate the campaign across channels.",
  };

  const recommendedDeliverables = [
    { id: "1", title: "Editable Image Files Adapted Under NDA", tokens: 2 },
    { id: "2", title: "Video File Created Non NDA", tokens: 1 },
    { id: "3", title: "PDF Files Created Non NDA", tokens: 10 },
    { id: "4", title: "Non Editable Image Files Created Non NDA", tokens: 2 },
  ];

  const handleAddDeliverable = (deliverableId: string, tokens: number) => {
    if (selectedDeliverables.includes(deliverableId)) {
      setSelectedDeliverables(selectedDeliverables.filter(id => id !== deliverableId));
      setTokenEstimate(prev => prev - tokens);
    } else {
      setSelectedDeliverables([...selectedDeliverables, deliverableId]);
      setTokenEstimate(prev => prev + tokens);
    }
  };

  return (
    <div className="flex flex-col w-full relative h-[calc(100vh-70px)]">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col gap-[10px] p-6 w-[564px] shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Great! Next up are the deliverables. You can either browse and select the ones you need, or start detailing them below. TIKO will summarise the deliverables and prompt you to make sure you include everything you need for this project.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold leading-[18.62px] text-[#424242] w-full">
                Browse recomended deliverables
              </p>

              <div className="flex flex-col gap-1">
                {recommendedDeliverables.map((deliverable) => {
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

              <button className="flex items-center justify-center gap-1.5 pt-2">
                <p className="text-sm font-bold leading-[18.62px] text-[#848487]">
                  More deliverables
                </p>
                <ChevronDownIcon size={19} className="text-[#848487]" />
              </button>
            </div>

            <div className="h-[9px] relative w-full">
              <div className="absolute h-px left-0 top-[4px] w-full bg-[#e0e0e0]" />
            </div>

            <p className="text-sm leading-[18.62px] text-[#424242] w-full">
              Prefer to describe it instead? Or not sure which deliverables you need yet? <br />
              <span className="font-bold">Continue describing your brief below</span>
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-[#e0e0e0] shrink-0" />

        {/* Right Panel */}
        <div className="flex flex-col gap-[10px] p-[10px] pr-10 w-[601px] shrink-0 overflow-hidden">
          {/* Brief Preview */}
          <div className="bg-white flex-1 flex flex-col gap-8 p-6 rounded-xl min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <p className="text-[22px] font-bold leading-[29.26px] text-black">
                  {mockBriefData.projectTitle}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-[18.62px] text-[#09090a]">
                    <span className="font-bold">Launch date: </span>
                    <span className="font-normal">{mockBriefData.launchDate}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-[18.62px] text-[#09090a]">
                    <span className="font-bold">Project lead: </span>
                    <span className="font-normal">{mockBriefData.projectLead}</span>
                  </p>
                </div>

                <p className="text-sm leading-[18.62px] text-[#09090a]">
                  <span className="font-bold">Objective: </span>
                  <span className="font-normal">{mockBriefData.objective}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-[9px] relative w-full shrink-0">
            <div className="absolute h-px left-[-9px] top-[4px] w-[600px] bg-[#e0e0e0]" />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1 items-end shrink-0">
            {/* Token Estimate */}
            <div className="flex gap-2 items-center pb-2">
              <img src={tokenIcon} alt="" className="h-5 w-5" />
              <span className="text-[13px] leading-[18.62px] text-black">{tokenEstimate}</span>
              <span className="text-[13px] leading-[18.62px] text-[#848487]">Tokens estimate</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between w-full">
              <button
                onClick={onCancel}
                className="px-2 py-[18px] bg-transparent rounded-[28px] flex items-center justify-center hover:bg-[#f1f1f3] transition h-8"
              >
                <span className="text-[13px] font-semibold leading-[18.62px] text-black">Discard</span>
              </button>
              <div className="flex gap-1 items-center">
                <button className="px-4 py-[18px] bg-[#f1f1f3] backdrop-blur-sm rounded-[28px] flex items-center justify-center hover:bg-[#e5e5e5] transition h-8">
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black">Save draft</span>
                </button>
                <button className="px-4 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center hover:opacity-90 transition h-8">
                  <span className="text-[13px] font-semibold leading-[18.62px] text-black">Generate brief</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Input at Bottom */}
      <div className="absolute bottom-[26px] left-[288px] w-[516px] bg-white border border-[#e0e0e0] rounded-[23px] p-1 flex items-center justify-between">
        <div className="flex gap-[7px] items-center flex-1">
          <div className="h-10 w-[35.514px] shrink-0">
            <img src={imgFrame14} alt="" className="w-full h-full" />
          </div>
          <input
            type="text"
            placeholder="Type here..."
            className="flex-1 text-sm leading-[18.62px] text-[#848487] bg-transparent border-none outline-none placeholder-[#848487]"
          />
        </div>
        <div className="w-10 h-10 shrink-0 relative">
          <img src={imgFrame15} alt="" className="w-full h-full" />
        </div>
      </div>

      {/* Help Text */}
      <p className="absolute bottom-[22px] left-[546.5px] text-[12px] leading-[15.96px] text-[#424242] text-center translate-x-[-50%] translate-y-[100%] w-[347px]">
        Need a hand? <span className="font-bold">Talk to your Iris account manager</span>
      </p>
    </div>
  );
}

function AllBriefsSection() {
  const [activeTab, setActiveTab] = useState<"All" | "Drafts" | "In review">("All");

  const briefs = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: i % 2 === 0 ? "Brand awareness push" : "Product launch paid social",
    desc: "Short description about the campaign objective and key deliverables.",
    status: i % 3 === 0 ? "In review" : "Draft",
    comments: 7 + (i % 6),
    due: i % 2 === 0 ? "Dec 05" : "Nov 28",
    owners: 2 + (i % 3),
  }));

  const filtered = briefs.filter((b) =>
    activeTab === "All" ? true : activeTab === "Drafts" ? b.status === "Draft" : b.status === "In review"
  );

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold leading-[21.28px] text-black">All briefs</h2>
      <div className="flex items-center gap-2">
        {["All", "Drafts", "In review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`h-[26px] px-3 rounded-full text-xs font-semibold ${
              activeTab === tab ? "bg-black text-white" : "bg-[#f1f1f3] text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white rounded-xl p-5 flex flex-col gap-3 border border-[#ececec]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold leading-[18.62px] text-black">{b.title}</h3>
              <span className="text-xs text-[#848487]">•••</span>
            </div>
            <p className="text-sm leading-[18.62px] text-[#646464]">{b.desc}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs px-2 py-1 rounded-[999px] bg-[#f9f9f9] text-[#646464]">{b.status}</span>
              <div className="flex -space-x-2">
                {Array.from({ length: b.owners }).map((_, a) => (
                  <div key={a} className="w-6 h-6 rounded-full bg-gray-200 ring-2 ring-white overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px bg-[#ececec]" />
            <div className="flex items-center justify-between text-xs text-[#848487]">
              <div className="flex items-center gap-1">
                <span>💬</span>
                <span>{b.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{b.due}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
