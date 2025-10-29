import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, ArrowRight, User, Bell, Coins, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Figma image URLs
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

// User profile images from Figma
const avatarImg1 = "https://www.figma.com/api/mcp/asset/8f703c7e-bd75-44c9-bfd6-7bd2a9304ada";
const avatarImg2 = "https://www.figma.com/api/mcp/asset/2763df3c-aa1d-46a3-9d19-01de3eb309ce";
const avatarImg3 = "https://www.figma.com/api/mcp/asset/5f1cd9b1-b890-4390-b9ff-3fe087d29156";
const avatarImg4 = "https://www.figma.com/api/mcp/asset/53abf7b2-6c6b-4ef3-bf18-7f9b9cac4259";
const avatarImg5 = "https://www.figma.com/api/mcp/asset/2e66cac4-69b5-438a-902e-e67ab3e96398";
const avatarImg6 = "https://www.figma.com/api/mcp/asset/7f1d849e-2ca5-4a46-84f5-58471a3d22e0";
const avatarImg7 = "https://www.figma.com/api/mcp/asset/12537ceb-3e87-4177-ba70-2f4327f82a9d";
const avatarImg8 = "https://www.figma.com/api/mcp/asset/7d56ad85-fdba-4eff-a947-e598dd95d31a";
const avatarImg9 = "https://www.figma.com/api/mcp/asset/9eede916-3b76-46a7-9bbe-bf96d8a6bbac";
const avatarImg10 = "https://www.figma.com/api/mcp/asset/8658d57f-28bb-4997-bb12-20725b27456b";
const avatarImg11 = "https://www.figma.com/api/mcp/asset/2998cbe3-c3ae-487b-8686-a8789842a419";
const avatarImg12 = "https://www.figma.com/api/mcp/asset/4af55757-996e-4874-851d-9f0552a2e4a8";
const avatarImg13 = "https://www.figma.com/api/mcp/asset/483c629a-d2e6-4414-b0f3-74c653bace3c";
const avatarImg14 = "https://www.figma.com/api/mcp/asset/5b9c783c-436b-442e-9857-06d309940de1";
const avatarImg15 = "https://www.figma.com/api/mcp/asset/f74354e7-ae07-4777-8f6a-2ee0b12ea289";
const avatarImg16 = "https://www.figma.com/api/mcp/asset/2e7d8b8d-62c1-48ea-a235-e45817dde115";
const avatarImg17 = "https://www.figma.com/api/mcp/asset/846c0f66-a6ab-4924-b5b3-29fe3c6f85b3";
const avatarImg18 = "https://www.figma.com/api/mcp/asset/56c68c66-b882-4196-b347-677d401b49da";
const avatarImg19 = "https://www.figma.com/api/mcp/asset/dc9b97c8-f3c8-41eb-b2ca-c36e2fedc0df";
const avatarImg20 = "https://www.figma.com/api/mcp/asset/11300247-38f8-478d-9479-40935b534eef";
const avatarImg21 = "https://www.figma.com/api/mcp/asset/51b54793-bcea-4985-bc14-75237d0a3404";
const arrowRightIcon = "https://www.figma.com/api/mcp/asset/8d6284a1-722e-4575-b9f8-e41d481a0036";

export default function UserProfilePage() {
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
    if (location.pathname.startsWith("/dashboard/profile")) return "My account";
    return "Central";
  }, [location.pathname]);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleChangeEmail = () => {
    toast.info("Change email functionality coming soon");
  };

  const handleChangePassword = () => {
    toast.info("Change password functionality coming soon");
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-[70px] bg-[#f9f9f9] border-b border-[#e0e0e0] flex items-center justify-between px-4 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-4 py-4 rounded-lg">
            <User size={20} className="text-black" />
            <span className="text-sm leading-[19.6px] text-black">My account</span>
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

        {/* Profile Content */}
        <section className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
          <div className="max-w-[662px] flex flex-col gap-[40px]">
            {/* User Header */}
            <div className="flex gap-[24px] items-center">
              {/* Avatar */}
              <div className="h-[120px] w-[121.739px] rounded-full overflow-hidden relative shrink-0">
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={avatarImg17} />
                </div>
                <div className="absolute inset-[32.79%_50.83%_32.96%_22.52%]">
                  <img alt="" className="block max-w-none size-full" src={avatarImg18} />
                </div>
                <div className="absolute inset-[32.79%_21.17%_32.96%_52.35%]">
                  <img alt="" className="block max-w-none size-full" src={avatarImg19} />
                </div>
                <div className="absolute inset-[34.15%_27.36%_48.72%_55.51%]">
                  <img alt="" className="block max-w-none size-full" src={avatarImg20} />
                </div>
                <div className="absolute inset-[34.15%_56.44%_48.72%_26.42%]">
                  <img alt="" className="block max-w-none size-full" src={avatarImg21} />
                </div>
              </div>

              {/* User Info */}
              <div className="flex flex-1 flex-col gap-[4px]">
                <h1 className="text-[32px] font-bold leading-[38.4px] text-black">
                  Henry Bray
                </h1>
                <p className="text-lg leading-[23.94px] text-black">
                  Marcomms
                </p>
              </div>
            </div>

            {/* Profile Cards */}
            <div className="flex flex-col gap-[20px]">
              {/* Email Card */}
              <Card className="bg-white border-0 rounded-[12px] shadow-none">
                <CardContent className="p-[24px]">
                  <div className="flex gap-[16px] items-start justify-between pb-[4px]">
                    <div className="flex flex-1 flex-col gap-[4px]">
                      <h3 className="text-[22px] font-bold leading-[29.26px] text-black">
                        Email
                      </h3>
                      <p className="text-sm leading-[18.62px] text-black">
                        henry.bray@marcomms-samsung.com
                      </p>
                    </div>
                    <Button
                      onClick={handleChangeEmail}
                      variant="ghost"
                      className="backdrop-blur-[6px] flex gap-[8px] h-[24px] items-center justify-center rounded-[28px] hover:bg-transparent p-0"
                    >
                      <span className="text-[12px] font-semibold leading-[23.94px] text-[#848487]">
                        Change
                      </span>
                      <div className="overflow-clip relative shrink-0 size-[16px]">
                        <img src={arrowRightIcon} alt="" className="block max-w-none size-full" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Password Card */}
              <Card className="bg-white border-0 rounded-[12px] shadow-none">
                <CardContent className="p-[24px]">
                  <div className="flex gap-[16px] items-start justify-between pb-[4px]">
                    <div className="flex flex-1 flex-col gap-[4px]">
                      <h3 className="text-[22px] font-bold leading-[29.26px] text-black">
                        Password
                      </h3>
                      <p className="text-sm leading-[18.62px] text-black">
                        Last update 30 days
                      </p>
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      variant="ghost"
                      className="backdrop-blur-[6px] flex gap-[8px] h-[24px] items-center justify-center rounded-[28px] hover:bg-transparent p-0"
                    >
                      <span className="text-[12px] font-semibold leading-[23.94px] text-[#848487]">
                        Change
                      </span>
                      <div className="overflow-clip relative shrink-0 size-[16px]">
                        <img src={arrowRightIcon} alt="" className="block max-w-none size-full" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Access Card */}
              <Card className="bg-white border-0 rounded-[12px] shadow-none">
                <CardContent className="p-[24px]">
                  <div className="flex gap-[16px] items-start justify-between pb-[4px]">
                    <div className="flex flex-1 flex-col gap-[4px]">
                      <h3 className="text-[22px] font-bold leading-[29.26px] text-black">
                        Access
                      </h3>
                      <p className="text-sm leading-[18.62px] text-black">
                        Member
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

