import { useNavigate, useSearchParams } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import bronzeMedalImg from "@/assets/images/bronze-medal.png";
import silverMedalImg from "@/assets/images/silver-medal.png";
import firstPlaceMedalImg from "@/assets/images/first-place.png";
import bullseyeImg from "@/assets/images/Bullseye.png";
import shakingHandsImg from "@/assets/images/shaking-hands.png";
import boltImg from "@/assets/images/bolt.png";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardTopbarRight from "@/components/layout/DashboardTopbarRight";
import { useActiveNav } from "@/hooks/useActiveNav";
import { BRAND } from "@/constants/branding";
import LegendItem from "@/components/common/LegendItem";
import { getProgressTextColorClass } from "@/lib/utils";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

export default function TrackerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam || "leaderboard";

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  // Mock data for teams leaderboard
  const teamsData = [
    {
      id: 1,
      title: "Omni & Digital",
      icon: firstPlaceMedalImg as string,
      isEmoji: false,
      iconColor: "text-yellow-500",
      overallScore: 95,
      briefQualityScore: 95,
      tokenEfficiency: 96,
      progressBarColor: "#03B3E2", // blue
      isMyTeam: false,
    },
    {
      id: 2,
      title: "Marcomms",
      icon: silverMedalImg as string,
      isEmoji: false,
      iconColor: "text-gray-400",
      overallScore: 94,
      briefQualityScore: 94,
      tokenEfficiency: 95,
      progressBarColor: "#8092DC", // purple
      isMyTeam: true,
    },
    {
      id: 3,
      title: "IMG",
      icon: bronzeMedalImg as string,
      isEmoji: false,
      iconColor: "text-amber-600",
      overallScore: 92,
      briefQualityScore: 92,
      tokenEfficiency: 93,
      progressBarColor: "#00c3b1", // teal/green
      isMyTeam: false,
    },
  ];

  // Mock data for brief quality score chart
  const qualityScoreData = [
    { quarter: "Q4 2024", score: 85 },
    { quarter: "Q1 2025", score: 87 },
    { quarter: "Q2 2025", score: 90 },
  ];

  const qualityScoreConfig = {
    score: {
      label: "Quality Score",
      color: "#0177c7",
    },
  };

  // Mock data for right first-time by category
  const rightFirstTimeData = [
    { category: "SMP", percentage: 92 },
    { category: "Ecosystem", percentage: 88 },
    { category: "Promotions", percentage: 85 },
    { category: "B2B", percentage: 90 },
  ];
  const rightFirstTimeAverage = 89; // Average percentage

  const rightFirstTimeConfig = {
    percentage: {
      label: "Right First Time (%)",
      color: "#03b3e2",
    },
  };

  // Mock data for number of iterations
  const iterationsData = [
    { period: "Q4 2024", iterations: 2.3 },
    { period: "Q1 2025", iterations: 2.1 },
    { period: "Q2 2025", iterations: 1.9 },
  ];

  const iterationsConfig = {
    iterations: {
      label: "Number of Iterations",
      color: "#00c3b1",
    },
  };

  // Mock data for details provided in brief
  const detailsProvidedData = [
    { period: "Q4 2024", fields: 12 },
    { period: "Q1 2025", fields: 14 },
    { period: "Q2 2025", fields: 15 },
  ];

  const detailsProvidedConfig = {
    fields: {
      label: "Details Provided",
      color: "#0177c7",
    },
  };

  // Mock data for spend by type chart
  const spendByTypeData = [
    { type: "Mobile", spent: 1200, committed: 750, remaining: 2350, total: 4300 },
    { type: "Tablet", spent: 750, committed: 600, remaining: 1400, total: 2750 },
    { type: "Wearable", spent: 400, committed: 400, remaining: 1310, total: 2100 },
    { type: "Ecosystem", spent: 400, committed: 250, remaining: 1000, total: 1650 },
  ];

  const spendConfig = {
    spent: {
      label: "Tokens Spent",
      color: "#00c3b1",
    },
    committed: {
      label: "Tokens Committed",
      color: "#03b3e2",
    },
    remaining: {
      label: "Tokens Remaining",
      color: "#0177c7",
    },
  };

  // Mock data for performance metrics table
  const performanceMetricsData = [
    {
      rank: 1,
      team: "Omni & Digital",
      projects: 28,
      onTimeDelivery: 96,
      briefQuality: 95,
      overallScore: 95,
    },
    {
      rank: 2,
      team: "Marcomms",
      projects: 24,
      onTimeDelivery: 95,
      briefQuality: 94,
      overallScore: 94,
    },
    {
      rank: 3,
      team: "Integrated Marketing Group",
      projects: 22,
      onTimeDelivery: 93,
      briefQuality: 92,
      overallScore: 92,
    },
    {
      rank: 4,
      team: "Retail & Contact Centre",
      projects: 20,
      onTimeDelivery: 89,
      briefQuality: 88,
      overallScore: 88,
    },
    {
      rank: 5,
      team: "Ireland & Services",
      projects: 18,
      onTimeDelivery: 87,
      briefQuality: 86,
      overallScore: 86,
    },
  ];

  // Get current date and time
  const getLastUpdated = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `Last updated at ${time} on ${date}`;
  };

  const topbarRight = <DashboardTopbarRight />;

  const titleNode = (
    <div className="flex items-center gap-2">
      <BarChart2 size={20} className="text-black" />
      <span className="text-sm leading-[19.6px] text-black">{activeName}</span>
    </div>
  );

  return (
    <DashboardLayout
      title={titleNode}
      logoSrc={logoImage}
      logoDotSrc={logoDot}
      TopbarRight={topbarRight}
    >
      <div className="px-4 md:px-6 pt-[40px] pb-[40px]">
        <div className="space-y-6 md:space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="h1-heading text-xl md:text-h1 text-black">Real-time insights to guide your spend</h1>
              <p className="text-body text-black">Stay on top of spend, progress, and priorities—all in one place.</p>
            </div>
            <Button variant="outline" className="h-10 px-6 border-none bg-[#ffb546] hover:opacity-90 text-black whitespace-nowrap">
              <span className="text-black font-semibold whitespace-nowrap">View all insights</span>
              <ChevronRight size={20} className="ml-2 text-black" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => {
            navigate(`/dashboard/tracker?tab=${value}`, { replace: true });
          }} className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-transparent p-0 text-muted-foreground border-b border-[#ececec] w-full">
              <TabsTrigger 
                value="leaderboard" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#03b3e2] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#03b3e2]"
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger 
                value="brief-quality" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#03b3e2] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#03b3e2]"
              >
                Brief quality
              </TabsTrigger>
              <TabsTrigger 
                value="project-performance" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#03b3e2] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#03b3e2]"
              >
                Project performance
              </TabsTrigger>
              <TabsTrigger 
                value="budget" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#03b3e2] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#03b3e2]"
              >
                Budget
              </TabsTrigger>
              <TabsTrigger 
                value="predictive-analytics" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#03b3e2] data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-[#03b3e2]"
              >
                Predictive Analytics & Insights
              </TabsTrigger>
            </TabsList>

            {/* Leaderboard Tab Content */}
            <TabsContent value="leaderboard" className="mt-6">
              <div className="space-y-6 md:space-y-10">
                {/* Teams' Leaderboard */}
                <div className="space-y-4">
                  <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Teams' Leaderboard</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {teamsData.filter((team) => team.title !== "Omni & Digital" && team.title !== "IMG").map((team) => (
                      <Card key={team.id} className="border border-[#ececec] bg-white relative">
                        {team.isMyTeam && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-[#f1f1f3] text-black border-none text-xs">My team</Badge>
                          </div>
                        )}
                        <CardHeader className="pb-3 pt-6">
                          <div className="flex flex-col items-start gap-2">
                            {team.isEmoji ? (
                              <span className="inline-block" style={{ width: '22px', height: '30px', fontSize: '30px', lineHeight: '30px' }}>{team.icon}</span>
                            ) : (
                              <img src={team.icon} alt={`${team.title} medal`} className="w-[30px] h-[30px] object-contain" />
                            )}
                            <CardTitle className="text-black font-bold text-[18px] leading-[23.94px]">{team.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm leading-[18.62px] text-black">Overall score</span>
                              <span className="text-[32px] font-bold leading-[38.4px]" style={{ color: team.progressBarColor }}>{team.overallScore}%</span>
                            </div>
                            <div className="relative h-4 w-full bg-[#f1f1f3] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${team.overallScore}%`, backgroundColor: team.progressBarColor }} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Brief Quality Score</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.briefQualityScore}%</span></div>
                          <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Token Efficiency</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.tokenEfficiency}%</span></div>
                          <div className="flex items-center gap-2 pt-2">
                            <div className="w-8 h-8 rounded-full border border-[#03b3e2] overflow-hidden"><img src={boltImg} alt="Bolt" className="w-full h-full object-cover" /></div>
                            <div className="w-8 h-8 rounded-full border border-[#ff9800] overflow-hidden"><img src={shakingHandsImg} alt="Shaking Hands" className="w-full h-full object-cover" /></div>
                            <div className="w-8 h-8 rounded-full border border-[#e91e63] overflow-hidden"><img src={bullseyeImg} alt="Bullseye" className="w-full h-full object-cover" /></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Detailed Performance Metrics Table */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[22px] font-bold leading-[29.26px]" style={{ color: '#03b3e2' }}>Detailed Performance Metrics</h3>
                    <p className="text-sm text-[#646464]">{getLastUpdated()}</p>
                  </div>
                  <Card className="border border-[#ececec] bg-white overflow-hidden rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f1f1f3] hover:bg-[#f1f1f3] border-b border-[#ececec]">
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Rank</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Team</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Number of Projects</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">On-Time Delivery Rate</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Brief Quality</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Overall Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performanceMetricsData.map((row, index) => (
                          <TableRow 
                            key={row.rank} 
                            className={`border-b border-[#ececec] ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#f1f1f3]`}
                          >
                            <TableCell className="px-4 py-4">
                              {row.rank <= 3 ? (
                                <img 
                                  src={row.rank === 1 ? firstPlaceMedalImg : row.rank === 2 ? silverMedalImg : bronzeMedalImg} 
                                  alt={`Rank ${row.rank}`}
                                  className="w-6 h-6 object-contain"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#646464] flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{row.rank}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-4">
                              <span className="inline-block px-3 py-1 rounded-md bg-[#f1f1f3] text-black text-sm font-normal">
                                {row.team}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-black">{row.projects}</TableCell>
                            <TableCell className="px-4 py-4">
                              <span className={row.rank <= 2 ? 'text-[#00C3B1] font-medium' : 'text-black'}>
                                {row.onTimeDelivery}%
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-black">{row.briefQuality}%</TableCell>
                            <TableCell className="px-4 py-4 text-black font-medium">{row.overallScore}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Brief Quality Tab Content */}
            <TabsContent value="brief-quality" className="mt-6">
              <div className="space-y-6">
                {/* Three graphs in one row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Right First-Time Section */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Right first-time</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-[32px] font-bold leading-[38.4px]" style={{ color: "#03b3e2" }}>
                            {rightFirstTimeAverage}%
                          </div>
                          <div className="text-xs leading-[15.96px] text-[#646464] mt-1">Average</div>
                        </div>
                      </div>
                      <ChartContainer config={rightFirstTimeConfig} className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={rightFirstTimeData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 100]}
                              ticks={[0, 25, 50, 75, 100]}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="percentage" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Number of Iterations */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Number of iterations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ChartContainer config={iterationsConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={iterationsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <defs>
                              <linearGradient id="iterationsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00c3b1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00c3b1" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={true} />
                            <XAxis 
                              dataKey="period" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[1.5, 2.5]}
                              ticks={[1.5, 1.75, 2.0, 2.25, 2.5]}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Area
                              type="monotone"
                              dataKey="iterations"
                              stroke="#00c3b1"
                              strokeWidth={2}
                              fill="url(#iterationsGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Details Provided in Brief */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Details provided in the brief</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ChartContainer config={detailsProvidedConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={detailsProvidedData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="period" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 20]}
                              ticks={[0, 5, 10, 15, 20]}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="fields" fill="#0177c7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Brief quality score - All categories graph below */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text_base font-bold leading-[21.28px] text-black">Brief quality score - All categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ChartContainer config={qualityScoreConfig} className="h-[250px] md:h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={qualityScoreData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0177c7" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#0177c7" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={true} />
                          <XAxis 
                            dataKey="quarter" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Quarter", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[70, 95]}
                            ticks={[70, 75, 80, 85, 90, 95]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Quality score (%)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
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
                    
                    {/* Insight section */}
                    <div className="flex flex-col gap-1 pt-2 pr-4 pb-2 pl-4 rounded-xl bg-[#F1F1F380]">
                      <p className="text-xs leading-[15.96px] font-bold text-[#00C3B1]">
                        Insight
                      </p>
                      <p className="text-xs leading-[18px] font-normal text-black">
                        Brief quality score has improved to 89% with consistent upward trend
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Project Performance Tab Content */}
            <TabsContent value="project-performance" className="mt-6">
              <div className="space-y-6">
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader>
                    <CardTitle className="text-black">Project Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black">Project performance metrics and analytics will be displayed here.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Budget Tab Content */}
            <TabsContent value="budget" className="mt-6">
              <div className="space-y-6">
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Token distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ChartContainer config={spendConfig} className="h-[300px] md:h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendByTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={true} vertical={true} />
                          <XAxis type="number" axisLine={false} tickLine={false} domain={[0, 4500]} ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500]} tick={{ fill: "#646464", fontSize: 12 }} />
                          <YAxis type="category" dataKey="type" axisLine={false} tickLine={false} tick={{ fill: "#646464", fontSize: 12 }} width={60} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="remaining" stackId="a" fill="#0177c7" radius={[6, 6, 6, 6]} />
                          <Bar dataKey="committed" stackId="a" fill="#03b3e2" radius={[6, 6, 6, 6]} />
                          <Bar dataKey="spent" stackId="a" fill="#00c3b1" radius={[6, 6, 6, 6]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <div className="flex items-center justify-center gap-6 text-xs">
                      <LegendItem color="#00c3b1" label="Tokens Spent" />
                      <LegendItem color="#03b3e2" label="Tokens Committed" />
                      <LegendItem color="#0177c7" label="Tokens Remaining" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Predictive Analytics & Insights Tab Content */}
            <TabsContent value="predictive-analytics" className="mt-6">
              <div className="space-y-6">
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader>
                    <CardTitle className="text-black">Predictive Analytics & Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black">Predictive analytics and insights will be displayed here.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
