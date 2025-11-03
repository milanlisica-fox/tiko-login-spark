import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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
      <div className="pt-[40px] pb-[40px]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-6 md:space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="h1-heading text-xl md:text-h1 text-black">Real-time insights to guide your spend</h1>
              <p className="text-body text-black">Stay on top of spend, progress, and priorities—all in one place.</p>
            </div>
            <Button variant="outline" className="h-10 px-6 border border-[#d9d9d9] bg-white hover:bg-gray-50 text-black whitespace-nowrap">
              <span className="text-black whitespace-nowrap">All insights</span>
              <ChevronRight size={20} className="ml-2 text-black" />
            </Button>
          </div>

          {/* Teams' Leaderboard */}
          <div className="space-y-4">
            <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Teams' Leaderboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {teamsData.map((team) => (
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

          {/* Just-in-Time Insights */}
          <div className="space-y-4">
            <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Just-in-Time Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card className="lg:col-span-1 border border-[#ececec] bg-white">
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

              <Card className="lg:col-span-2 border border-[#ececec] bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold leading-[21.28px] text-black">Token distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ChartContainer config={{ spent: { label: "Tokens Spent", color: "#00c3b1" }, committed: { label: "Tokens Committed", color: "#03b3e2" }, remaining: { label: "Tokens Remaining", color: "#0177c7" } }} className="h-[300px] md:h-[250px] w-full">
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
