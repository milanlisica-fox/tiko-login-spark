import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Calculator, Coins } from "lucide-react";
import { toast } from "sonner";

// Reuse images from Dashboard for consistent visuals
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

export default function BriefsPage() {
  const navigate = useNavigate();
  const location = useLocation();

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
            <Home size={20} className="text-black" />
            <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
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
                <button className="px-6 py-[18px] bg-[#ffb546] backdrop-blur-sm rounded-[28px] flex items-center justify-center gap-2.5 hover:opacity-90 transition">
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
        </section>
      </main>
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


