import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, ChevronRight, Trophy, Award } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Figma image URLs
const logoImage = "https://www.figma.com/api/mcp/asset/e6ec2a32-b26b-4e3a-bd4a-4e803cad7b85";
const logoDot = "https://www.figma.com/api/mcp/asset/04d711ff-9aa1-4e99-ae1a-4fe72b6fa22c";
const dividerImage = "https://www.figma.com/api/mcp/asset/ed109f8c-67ff-4f01-943f-65f17570f9e7";

export default function TrackerPage() {
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

  // Mock data for teams leaderboard
  const teamsData = [
    {
      id: 1,
      title: "Omni & Digital",
      icon: Trophy,
      iconColor: "text-yellow-500",
      budget: "3,100",
      spent: "2,847",
      remaining: "253",
      progress: 92,
      owners: ["A", "B", "C"],
    },
    {
      id: 2,
      title: "Marcomms",
      icon: Award,
      iconColor: "text-gray-400",
      budget: "3,100",
      spent: "2,847",
      remaining: "253",
      progress: 88,
      owners: ["D", "E", "F"],
    },
    {
      id: 3,
      title: "IMG",
      icon: Award,
      iconColor: "text-amber-600",
      budget: "3,100",
      spent: "2,847",
      remaining: "253",
      progress: 79,
      owners: ["G", "H", "I"],
    },
  ];

  // Mock data for brief quality score chart
  const qualityScoreData = [
    { quarter: "Q4 2024", score: 85 },
    { quarter: "Q1 2025", score: 87 },
    { quarter: "Q2 2025", score: 89 },
  ];

  const qualityScoreConfig = {
    score: {
      label: "Quality Score",
      color: "#0177c7",
    },
  };

  // Mock data for spend by type chart
  const spendByTypeData = [
    { type: "Mobile", spent: 1600, committed: 1100, remaining: 3200 },
    { type: "Tablet", spent: 590, committed: 510, remaining: 1850 },
    { type: "Wearable", spent: 580, committed: 510, remaining: 1850 },
    { type: "Ecosystem", spent: 1650, committed: 1100, remaining: 3200 },
  ];

  const spendConfig = {
    spent: {
      label: "Spent",
      color: "#0177c7",
    },
    committed: {
      label: "Committed",
      color: "#03b3e2",
    },
    remaining: {
      label: "Remaining",
      color: "#00c3b1",
    },
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

        {/* Tracker Content */}
        <section className="flex-1 overflow-y-auto px-6 pt-[40px] pb-[40px]">
          <div className="max-w-[1152px] mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-[32px] font-bold leading-[38.4px] text-black">
                  Real-time insights to guide your spend
                </h1>
                <p className="text-lg leading-[23.94px] text-black">
                  Stay on top of spend, progress, and priorities—all in one place.
                </p>
              </div>
              <Button
                variant="outline"
                className="h-10 px-6 border border-[#d9d9d9] bg-white hover:bg-gray-50 text-black"
              >
                <span className="text-black">All insights</span>
                <ChevronRight size={20} className="ml-2 text-black" />
              </Button>
            </div>

            {/* Teams' Leaderboard */}
            <div className="space-y-4">
              <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Teams' Leaderboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {teamsData.map((team) => {
                  const IconComponent = team.icon;
                  return (
                  <Card key={team.id} className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent size={20} className={team.iconColor} />
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">{team.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#646464]">Budget</span>
                          <span className="text-lg font-bold">{team.budget}</span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="relative h-4 w-full bg-[#f1f1f3] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#00c3b1] rounded-full transition-all"
                              style={{ width: `${team.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-[#646464]">
                            <span>Spent: {team.spent}</span>
                            <span>Remaining: {team.remaining}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#646464]">Spent</span>
                            <span className="text-sm font-bold">{team.spent}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#646464]">Remaining</span>
                            <span className="text-sm font-bold">{team.remaining}</span>
                          </div>
                        </div>
                      </div>

                      {/* Owners */}
                      <div className="flex items-center gap-2 pt-4 border-t border-[#ececec]">
                        <div className="flex -space-x-2">
                          {team.owners.map((owner, idx) => (
                            <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-200 to-blue-300">
                                {owner}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-xs text-[#646464] ml-1">
                          {team.owners.length} owners
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </div>

            {/* Just-in-Time Insights */}
            <div className="space-y-4">
              <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Just-in-Time Insights</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Brief Quality Score Chart */}
                <Card className="lg:col-span-1 border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief quality score - All categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ChartContainer config={qualityScoreConfig} className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={qualityScoreData}>
                          <defs>
                            <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0177c7" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#0177c7" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                          <XAxis 
                            dataKey="quarter" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[70, 95]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#0177c7"
                            strokeWidth={2}
                            fill="url(#qualityGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <Badge variant="secondary" className="w-fit bg-[#f1f1f3] text-black border-none">
                      Improved
                    </Badge>

                    {/* Insight Card */}
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                      <CardContent className="p-4">
                        <p className="text-xs font-semibold text-blue-900 mb-2">Insight</p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          Brief quality score has improved to 89% with consistent upward trend
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                {/* Spend by Type Chart */}
                <Card className="lg:col-span-2 border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Token distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ChartContainer config={spendConfig} className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendByTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={true} vertical={false} />
                          <XAxis 
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <YAxis 
                            type="category"
                            dataKey="type"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            width={80}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="spent" stackId="a" fill="#0177c7" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="committed" stackId="a" fill="#03b3e2" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="remaining" stackId="a" fill="#00c3b1" radius={[4, 0, 0, 4]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    {/* Legend */}
                    <div className="flex items-center gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#0177c7]" />
                        <span className="text-[#646464]">Spent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#03b3e2]" />
                        <span className="text-[#646464]">Committed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#00c3b1]" />
                        <span className="text-[#646464]">Remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
