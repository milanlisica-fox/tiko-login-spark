import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Home, FileText, Folder, BarChart2, LogOut, Bell, ChevronDown, ArrowRight, Coins, ChevronRight, Clock, Bot, Target, AlertTriangle, TrendingUp, CheckCircle2, DollarSign, Menu, Wallet, HelpCircle, PoundSterling } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend } from "recharts";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import HorizontalBarChart from "@/components/common/HorizontalBarChart";

// Figma image URLs
const logoImage = BRAND.logo;
const logoDot = BRAND.logoDot;

// Custom tooltip for pie charts that shows all values
const PieChartTooltip = ({ data, config }: { data: Array<{ name: string; value: number; color: string }>; config: Record<string, { label: string; color: string }> }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="bg-white border border-[#ececec] rounded-lg p-3 shadow-lg min-w-[180px]">
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-black">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-black">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Custom tooltip for radar chart that shows all values
const RadarChartTooltip = ({ data }: { data: Array<{ category: string; score: number }> }) => {
  return (
    <div className="bg-white border border-[#ececec] rounded-lg p-3 shadow-lg min-w-[180px]">
      <div className="space-y-2">
        <div className="text-xs font-bold text-black mb-2">Overall average</div>
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <span className="text-xs text-black">{item.category}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-black">{item.score}/5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TrackerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam || "budget";
  const [tikoQuestion, setTikoQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [budgetView, setBudgetView] = useState<"quarter" | "annual">("quarter");
  const [showTikoResponse, setShowTikoResponse] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminQuestion, setAdminQuestion] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("2025");

  // nav items centralized via DashboardLayout
  const { activeName } = useActiveNav();

  // Tab labels mapping
  const tabLabels: Record<string, string> = {
    leaderboard: "Leaderboard",
    "brief-quality": "Brief quality",
    "project-performance": "Project performance",
    budget: "Budget",
    "predictive-analytics": "Predictive analytics & insights",
  };

  // Tab colors mapping
  const tabColors: Record<string, string> = {
    leaderboard: "#03b3e2",
    "brief-quality": "#8092dc",
    "project-performance": "#ffb546",
    budget: "#0177c7",
    "predictive-analytics": "#ff4337",
  };

  // Handle tab change with scroll to top
  const handleTabChange = (value: string) => {
    // Scroll to top immediately before navigation
    const scrollContainer = document.querySelector('section.overflow-y-auto') ||
                           document.querySelector('section.flex-1.overflow-y-auto') ||
                           document.querySelector('main section') ||
                           document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    navigate(`/dashboard/tracker?tab=${value}`, { replace: true });
  };

  // Scroll to top when tab changes
  useEffect(() => {
    // Use requestAnimationFrame for immediate scroll without delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Find the actual scroll container (the section element in DashboardLayout)
        const scrollContainer = document.querySelector('section.overflow-y-auto') ||
                               document.querySelector('section.flex-1.overflow-y-auto') ||
                               document.querySelector('main section') ||
                               document.querySelector('.overflow-y-auto');
        
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        } else {
          // Fallback to window scroll
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      });
    });
  }, [activeTab]);

  const handleAskTiko = () => {
    if (tikoQuestion.trim()) {
      setShowTikoResponse(true);
    }
  };

  const handleSendToAdmin = () => {
    setAdminQuestion(tikoQuestion);
    setShowAdminModal(true);
  };

  const handleSubmitAdminQuestion = () => {
    if (adminQuestion.trim()) {
      toast.success("Your question was sent to Admin");
      setShowAdminModal(false);
      setAdminQuestion("");
      setTikoQuestion("");
      setShowTikoResponse(false);
    }
  };

  // Mock data for Client satisfaction radar chart
  const clientSatisfactionData = [
    { category: "Quality", score: 4.5, color: "#03b3e2" },
    { category: "Timeliness", score: 4.0, color: "#00C3B1" },
    { category: "Communication", score: 4.0, color: "#ff9800" },
    { category: "Value", score: 4.5, color: "#0177c7" },
    { category: "Innovation", score: 3.5, color: "#646464" },
  ];

  const clientSatisfactionConfig = {
    score: {
      label: "Overall average",
      color: "#03b3e2",
    },
  };

  // Mock data for Performance driver chart
  const performanceDriverData = [
    { category: "Complete", satisfaction: 4.9, changeRequests: 2.5 },
    { category: "Incomplete", satisfaction: 3.1, changeRequests: 34 },
  ];

  const performanceDriverConfig = {
    satisfaction: {
      label: "Satisfaction",
      color: "#0177c7",
    },
    changeRequests: {
      label: "Change Requests %",
      color: "#03b3e2",
    },
  };

  // Mock data for duplicate brief prevention
  const duplicateBriefsTrendData = [
    { month: "Apr 2025", prevented: 3 },
    { month: "May 2025", prevented: 4 },
    { month: "Jun 2025", prevented: 5 },
    { month: "Jul 2025", prevented: 6 },
    { month: "Aug 2025", prevented: 4 },
    { month: "Sep 2025", prevented: 7 },
  ];

  const duplicateBriefsTrendConfig = {
    prevented: {
      label: "Prevented duplicates",
      color: "#03b3e2",
    },
  };

  const duplicateBriefsStats = {
    preventedTotal: 29,
    tokensSaved: 3120,
    hoursSaved: 180,
    teamsImpacted: 6,
  };

  // Mock data for Budget risk alert chart
  const budgetRiskData = [
    { month: "Jul", tokensUsed: 800, tokensAllocated: 950 },
    { month: "Aug", tokensUsed: 850, tokensAllocated: 950 },
    { month: "Sep", tokensUsed: 900, tokensAllocated: 1000 },
    { month: "Oct", tokensUsed: 1050, tokensAllocated: 1000 },
    { month: "Nov", tokensUsed: 1150, tokensAllocated: 1100 },
    { month: "Dec", tokensUsed: 1250, tokensAllocated: 1200 },
  ];

  const budgetRiskConfig = {
    tokensUsed: {
      label: "Tokens used",
      color: "#0177c7",
    },
    tokensAllocated: {
      label: "Tokens allocated",
      color: "#03b3e2",
    },
  };

  // Mock data for Process optimization chart
  const processOptimizationData = [
    { method: "JFDI", days: 3.5, satisfaction: 4.1 },
    { method: "Creative", days: 9.5, satisfaction: 7.5 },
    { method: "Hybrid", days: 6.5, satisfaction: 5.5 },
  ];

  const processOptimizationConfig = {
    days: {
      label: "Days",
      color: "#0177c7",
    },
    satisfaction: {
      label: "Satisfaction",
      color: "#03b3e2",
    },
  };

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
      assetsRightFirstTime: 94,
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
      assetsRightFirstTime: 93,
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
      assetsRightFirstTime: 91,
      progressBarColor: "#00c3b1", // teal/green
      isMyTeam: false,
    },
    {
      id: 4,
      title: "Product Marketing",
      icon: firstPlaceMedalImg as string,
      isEmoji: false,
      iconColor: "text-yellow-500",
      overallScore: 96,
      briefQualityScore: 96,
      tokenEfficiency: 97,
      assetsRightFirstTime: 95,
      progressBarColor: "#0177c7", // blue
      isMyTeam: false,
    },
    {
      id: 5,
      title: "Brand Experience",
      icon: bronzeMedalImg as string,
      isEmoji: false,
      iconColor: "text-amber-600",
      overallScore: 93,
      briefQualityScore: 93,
      tokenEfficiency: 94,
      assetsRightFirstTime: 92,
      progressBarColor: "#ffb546", // orange
      isMyTeam: false,
    },
  ];

  // Mock data for Brief quality score chart
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
      label: "Average number of iterations",
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
      label: "Average details provided in the brief",
      color: "#0177c7",
    },
  };

  // Mock data for Number of briefs per category
  const briefsPerCategoryData = [
    { category: "SMP", briefs: 68 },
    { category: "Ecosystem", briefs: 45 },
    { category: "Promotions", briefs: 32 },
    { category: "B2B", briefs: 20 },
  ];

  const briefsPerCategoryConfig = {
    briefs: {
      label: "Number of briefs",
      color: "#03b3e2",
    },
  };

  // Mock data for Briefs quality by category
  const briefsQualityByCategoryData = [
    { category: "SMP", qualityScore: 92 },
    { category: "Ecosystem", qualityScore: 88 },
    { category: "Promotions", qualityScore: 85 },
    { category: "B2B", qualityScore: 90 },
  ];

  const briefsQualityByCategoryConfig = {
    qualityScore: {
      label: "Quality Score (%)",
      color: "#0177c7",
    },
  };

  // Mock data for key stats
  const keyStatsData = {
    draftBrief: 12,
    briefsInReview: 8,
    scopesReadyToSign: 5,
    briefsApproved: 142,
  };

  // Mock data for Number of briefs by month (stacked bar chart)
  const numberOfBriefsData = [
    { month: "Jun", smp: 49, ecosystem: 21, promotions: 18, b2b: 10 },
    { month: "Jul", smp: 55, ecosystem: 25, promotions: 15, b2b: 7 },
    { month: "Aug", smp: 42, ecosystem: 18, promotions: 12, b2b: 7 },
  ];

  const numberOfBriefsConfig = {
    smp: {
      label: "SMP",
      color: "#0177c7",
    },
    ecosystem: {
      label: "Ecosystem",
      color: "#03b3e2",
    },
    promotions: {
      label: "Promotions",
      color: "#00c3b1",
    },
    b2b: {
      label: "B2B",
      color: "#8092DC",
    },
  };

  // Mock data for top missing fields from briefs
  const missingFieldsData = [
    { field: "Delivery date", smp: 10, ecosystem: 7, promotions: 5, b2b: 1 },
    { field: "Budget range", smp: 7, ecosystem: 6, promotions: 4, b2b: 1 },
    { field: "Key message", smp: 5, ecosystem: 5, promotions: 3, b2b: 2 },
    { field: "Target audience", smp: 4, ecosystem: 4, promotions: 2, b2b: 2 },
    { field: "Creative requirements", smp: 3, ecosystem: 3, promotions: 1, b2b: 1 },
    { field: "Brand guidelines", smp: 3, ecosystem: 3, promotions: 1, b2b: 1 },
    { field: "Success metrics", smp: 2, ecosystem: 2, promotions: 2, b2b: 1 },
    { field: "Approval process", smp: 2, ecosystem: 3, promotions: 1, b2b: 0 },
  ];

  const missingFieldsConfig = {
    smp: {
      label: "SMP",
      color: "#0177c7",
    },
    ecosystem: {
      label: "Ecosystem",
      color: "#03b3e2",
    },
    promotions: {
      label: "Promotions",
      color: "#00c3b1",
    },
    b2b: {
      label: "B2B",
      color: "#8092DC",
    },
  };

  // Mock data for rounds of amends
  const roundsOfAmendsData = [
    { period: "Q4 2024", rounds: 2.8 },
    { period: "Q1 2025", rounds: 2.5 },
    { period: "Q2 2025", rounds: 2.2 },
  ];

  const roundsOfAmendsConfig = {
    rounds: {
      label: "Average rounds of amends",
      color: "#0177c7",
    },
  };

  // Mock data for change requests by product line
  const changeRequestsData = [
    { productLine: "SMP", changeRate: -25 },
    { productLine: "Ecosystem", changeRate: -20 },
    { productLine: "Promotions", changeRate: -18 },
    { productLine: "B2B", changeRate: -15 },
  ];

  // Mock data for on-time delivery by product line
  const onTimeDeliveryData = [
    { productLine: "SMP", changeRate: 32 },
    { productLine: "Ecosystem", changeRate: 28 },
    { productLine: "Promotions", changeRate: 24 },
    { productLine: "B2B", changeRate: 18 },
  ];

  // Mock data for issues breakdown
  const issuesBreakdownData = [
    {
      issueType: "HQ Asset Delay",
      inFlight: 2,
      resolved: 12,
      impact: "2 week delay avg",
      primaryProductLine: "SMP (1), Ecosystem (1)",
    },
    {
      issueType: "Change in Promotion",
      inFlight: 1,
      resolved: 8,
      impact: "1 week delay avg",
      primaryProductLine: "Ecosystem (1)",
    },
    {
      issueType: "Internal Brief Sign-off",
      inFlight: 1,
      resolved: 9,
      impact: "0.5 week delay avg",
      primaryProductLine: "Promotions (1)",
    },
    {
      issueType: "3rd Party Changes",
      inFlight: 0,
      resolved: 6,
      impact: "0K tokens budget impact",
      primaryProductLine: "All resolved",
    },
  ];

  const completedProjectsData = [
    {
      id: 1,
      projectName: "Galaxy S25 UK Launch Toolkit",
      category: "SMP",
      deliveryTeam: "Omni & Digital",
      tokensSpent: 1850,
      durationWeeks: 6,
      onTime: true,
      changeRequests: 1,
      roundsOfAmends: 2,
      assetsRightFirstTime: 93,
    },
    {
      id: 2,
      projectName: "Festival Retail Experience Refresh",
      category: "Ecosystem",
      deliveryTeam: "Brand Experience",
      tokensSpent: 1620,
      durationWeeks: 7,
      onTime: false,
      changeRequests: 3,
      roundsOfAmends: 3,
      assetsRightFirstTime: 88,
    },
    {
      id: 3,
      projectName: "Q2 Promotions Always-On Creative",
      category: "Promotions",
      deliveryTeam: "Marcomms",
      tokensSpent: 1480,
      durationWeeks: 5,
      onTime: true,
      changeRequests: 2,
      roundsOfAmends: 2,
      assetsRightFirstTime: 91,
    },
    {
      id: 4,
      projectName: "B2B Partner Playbook 2025",
      category: "B2B",
      deliveryTeam: "Product Marketing",
      tokensSpent: 1725,
      durationWeeks: 8,
      onTime: true,
      changeRequests: 1,
      roundsOfAmends: 1,
      assetsRightFirstTime: 95,
    },
    {
      id: 5,
      projectName: "Wearables Loyalty Lifecycle",
      category: "Ecosystem",
      deliveryTeam: "IMG",
      tokensSpent: 1290,
      durationWeeks: 4,
      onTime: true,
      changeRequests: 0,
      roundsOfAmends: 1,
      assetsRightFirstTime: 97,
    },
    {
      id: 6,
      projectName: "Enterprise Solutions Portal Redesign",
      category: "B2B",
      deliveryTeam: "Product Marketing",
      tokensSpent: 2100,
      durationWeeks: 9,
      onTime: false,
      changeRequests: 4,
      roundsOfAmends: 4,
      assetsRightFirstTime: 85,
    },
    {
      id: 7,
      projectName: "Summer Campaign Visual Identity",
      category: "Promotions",
      deliveryTeam: "Marcomms",
      tokensSpent: 1450,
      durationWeeks: 5,
      onTime: true,
      changeRequests: 2,
      roundsOfAmends: 2,
      assetsRightFirstTime: 90,
    },
    {
      id: 8,
      projectName: "Customer Onboarding Experience",
      category: "Ecosystem",
      deliveryTeam: "Brand Experience",
      tokensSpent: 1780,
      durationWeeks: 7,
      onTime: true,
      changeRequests: 1,
      roundsOfAmends: 2,
      assetsRightFirstTime: 94,
    },
  ];

  // Mock data for Late briefs donut chart
  const lateBriefsData = [
    { name: "No Issues", value: 87, color: "#0177c7" },
    { name: "Stakeholder Delay", value: 6, color: "#03b3e2" },
    { name: "Changing Brief/Approval Process", value: 4, color: "#00c3b1" },
    { name: "Internal/Strategy Delay", value: 3, color: "#8092DC" },
  ];

  const lateBriefsConfig = {
    "No Issues": { label: "No Issues", color: "#0177c7" },
    "Stakeholder Delay": { label: "Stakeholder Delay", color: "#03b3e2" },
    "Changing Brief/Approval Process": { label: "Changing Brief/Approval Process", color: "#00c3b1" },
    "Internal/Strategy Delay": { label: "Internal/Strategy Delay", color: "#8092DC" },
  };

  // Mock data for extended/delayed projects donut chart
  const extendedProjectsData = [
    { name: "No Issues", value: 59, color: "#0177c7" },
    { name: "Scope Changes", value: 15, color: "#03b3e2" },
    { name: "Resource Constraints", value: 10, color: "#00c3b1" },
    { name: "Technical Issues", value: 8, color: "#8092DC" },
    { name: "Client Feedback", value: 5, color: "#00C3B1" },
    { name: "External Dependencies", value: 3, color: "#ff9800" },
  ];

  const extendedProjectsConfig = {
    "No Issues": { label: "No Issues", color: "#0177c7" },
    "Scope Changes": { label: "Scope Changes", color: "#03b3e2" },
    "Resource Constraints": { label: "Resource Constraints", color: "#00c3b1" },
    "Technical Issues": { label: "Technical Issues", color: "#8092DC" },
    "Client Feedback": { label: "Client Feedback", color: "#00C3B1" },
    "External Dependencies": { label: "External Dependencies", color: "#ff9800" },
  };

  // Mock data for Insufficient time donut chart
  const insufficientTimeData = [
    { name: "Sufficient Time", value: 70, color: "#0177c7" },
    { name: "Insufficient time", value: 30, color: "#8092DC" },
  ];

  const insufficientTimeConfig = {
    "Sufficient Time": { label: "Sufficient Time", color: "#0177c7" },
    "Insufficient time": { label: "Insufficient time", color: "#8092DC" },
  };

  // Mock data for Additional token spend by category
  const additionalTokenSpendData = [
    { category: "SMP", tokens: 450 },
    { category: "Ecosystem", tokens: 320 },
    { category: "Promotions", tokens: 280 },
    { category: "B2B", tokens: 180 },
  ];

  const additionalTokenSpendConfig = {
    tokens: {
      label: "Additional Tokens",
      color: "#8092DC",
    },
  };

  // Mock data for Brand and legal amends (right first time)
  const brandLegalAmendsData = [
    { period: "Q4 2024", percentage: 85 },
    { period: "Q1 2025", percentage: 88 },
    { period: "Q2 2025", percentage: 92 },
  ];

  const brandLegalAmendsConfig = {
    percentage: {
      label: "Right First Time (%)",
      color: "#00c3b1",
    },
  };

  // Mock data for spend by type chart
  const spendByTypeData = [
    { type: "Mobile", spent: 1200, committed: 750, remaining: 2350, total: 4300 },
    { type: "Tablet", spent: 750, committed: 600, remaining: 1400, total: 2750 },
    { type: "Wearable", spent: 400, committed: 400, remaining: 1310, total: 2100 },
    { type: "Ecosystem", spent: 400, committed: 250, remaining: 1000, total: 1650 },
  ];

  // Mock data for budget wallet (quarter view)
  const quarterBudgetData = {
    totalBudget: 10000,
    tokensSpent: 4150,
    tokensCommitted: 2000,
    tokensRemaining: 3100,
    tokensPending: 750,
  };

  // Mock data for budget wallet (annual view)
  const annualBudgetData = {
    totalBudget: 40000,
    tokensSpent: 14400,
    tokensCommitted: 8000,
    tokensRemaining: 14600,
    tokensPending: 3000,
  };

  // Mock data for token distribution by category
  const tokenDistributionByCategoryData = [
    { category: "SMP", tokens: 4500 },
    { category: "Ecosys..", tokens: 3200 },
    { category: "Promotions", tokens: 2800 },
    { category: "B2B", tokens: 1800 },
  ];

  const tokenDistributionCategoryConfig = {
    tokens: {
      label: "Tokens",
      color: "#03b3e2",
    },
  };

  // Mock data for historical spend per category by year
  const historicalSpendData = {
    "2023": [
      { category: "SMP", spend: 4200 },
      { category: "Ecosystem", spend: 3100 },
      { category: "Promotions", spend: 2600 },
      { category: "B2B", spend: 1700 },
    ],
    "2024": [
      { category: "SMP", spend: 4400 },
      { category: "Ecosystem", spend: 3150 },
      { category: "Promotions", spend: 2700 },
      { category: "B2B", spend: 1750 },
    ],
    "2025": [
      { category: "SMP", spend: 4500 },
      { category: "Ecosystem", spend: 3200 },
      { category: "Promotions", spend: 2800 },
      { category: "B2B", spend: 1800 },
    ],
  };

  const historicalSpendConfig = {
    spend: {
      label: "Spend (Tokens)",
      color: "#0177c7",
    },
  };

  const changeRequestsSpendByCategoryData = [
    { category: "SMP", tokens: 3200 },
    { category: "Ecosystem", tokens: 2800 },
    { category: "Promotions", tokens: 2400 },
    { category: "B2B", tokens: 2100 },
  ];

  const changeRequestsSpendByCategoryConfig = {
    tokens: {
      label: "Token spend",
      color: "#03b3e2",
    },
  };

  const quarterlySpendComparisonData = [
    { quarter: "Q1 2025", expected: 9000, actual: 8600 },
    { quarter: "Q2 2025", expected: 9500, actual: 9100 },
    { quarter: "Q3 2025", expected: 9800, actual: 10250 },
    { quarter: "Q4 2025", expected: 10000, actual: 10800 },
  ];

  const quarterlySpendComparisonConfig = {
    expected: {
      label: "Expected spend",
      color: "#8092dc",
    },
    actual: {
      label: "Actual spend",
      color: "#03b3e2",
    },
  };

  const spendConfig = {
    spent: {
      label: "Tokens spent",
      color: "#00c3b1",
    },
    committed: {
      label: "Tokens committed ",
      color: "#03b3e2",
    },
    remaining: {
      label: "Tokens remaining",
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
      assetsRightFirstTime: 94,
      overallScore: 95,
    },
    {
      rank: 2,
      team: "Marcomms",
      projects: 24,
      onTimeDelivery: 95,
      briefQuality: 94,
      assetsRightFirstTime: 93,
      overallScore: 94,
    },
    {
      rank: 3,
      team: "Integrated Marketing Group",
      projects: 22,
      onTimeDelivery: 93,
      briefQuality: 92,
      assetsRightFirstTime: 91,
      overallScore: 92,
    },
    {
      rank: 4,
      team: "Retail & Contact Centre",
      projects: 20,
      onTimeDelivery: 89,
      briefQuality: 88,
      assetsRightFirstTime: 87,
      overallScore: 88,
    },
    {
      rank: 5,
      team: "Ireland & Services",
      projects: 18,
      onTimeDelivery: 87,
      briefQuality: 86,
      assetsRightFirstTime: 85,
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
      <div className="px-4 md:px-6 pt-[40px] pb-[40px] ">
        {/* Sticky Header and Tabs */}
        <div className="sticky -top-px z-50 bg-[#f9f9f9] -mx-4 md:-mx-6 px-4 md:px-6 pt-[40px] pb-4 -mt-[40px] border-b border-[#ececec]">
          <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="h1-heading text-xl md:text-h1 text-black">Real-time insights to guide your spend</h1>
              <p className="text-body text-black">Stay on top of spend, progress, and priorities all in one place</p>
            </div>
            {/* <Button variant="outline" className="h-10 px-6 border-none bg-[#ffb546] hover:opacity-90 text-black whitespace-nowrap">
              <span className="text-black font-semibold whitespace-nowrap">View all</span>
              <ChevronRight size={20} className="ml-2 text-black" />
            </Button> */}
          </div>

            {/* Tabs - Desktop */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full hidden md:block">
              <TabsList className="inline-flex h-12 md:h-14 items-center justify-start rounded-md bg-transparent p-0 text-muted-foreground border-b-2 border-[#ececec] w-full">
                <TabsTrigger 
                  value="budget" 
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 md:px-3 lg:px-4 py-2 md:py-3 text-xs md:text-sm lg:text-base font-medium md:font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#0177c7] data-[state=active]:shadow-none border-b-[3px] border-transparent data-[state=active]:border-[#0177c7]"
                >
                  Budget
                </TabsTrigger>
                <TabsTrigger 
                  value="leaderboard" 
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 md:px-3 lg:px-4 py-2 md:py-3 text-xs md:text-sm lg:text-base font-medium md:font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#03b3e2] data-[state=active]:shadow-none border-b-[3px] border-transparent data-[state=active]:border-[#03b3e2]"
                >
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger 
                  value="brief-quality" 
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 md:px-3 lg:px-4 py-2 md:py-3 text-xs md:text-sm lg:text-base font-medium md:font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#8092dc] data-[state=active]:shadow-none border-b-[3px] border-transparent data-[state=active]:border-[#8092dc]"
                >
                  Brief quality
                </TabsTrigger>
                <TabsTrigger 
                  value="project-performance" 
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 md:px-3 lg:px-4 py-2 md:py-3 text-xs md:text-sm lg:text-base font-medium md:font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#ffb546] data-[state=active]:shadow-none border-b-[3px] border-transparent data-[state=active]:border-[#ffb546]"
                >
                  Project performance
                </TabsTrigger>
                <TabsTrigger 
                  value="predictive-analytics" 
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 md:px-3 lg:px-4 py-2 md:py-3 text-xs md:text-sm lg:text-base font-medium md:font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-[#ff4337] data-[state=active]:shadow-none border-b-[3px] border-transparent data-[state=active]:border-[#ff4337]"
                >
                  Predictive analytics & insights
                </TabsTrigger>
            </TabsList>
            </Tabs>

            {/* Mobile Dropdown */}
            <div className="md:hidden w-full">
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-full border-[#e0e0e0] rounded-[85px] px-5 py-[15px] h-auto bg-[#f9f9f9] [&_span]:text-black [&_span]:text-center [&>span]:absolute [&>span]:left-0 [&>span]:right-0 [&>span]:text-center [&>svg]:absolute [&>svg]:right-7 [&>svg]:opacity-100 [&>svg]:text-black [&>svg]:h-5 [&>svg]:w-5">
                  <SelectValue className="text-center text-black">
                    {tabLabels[activeTab] || "Select a tab"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#f9f9f9]">
                  <SelectItem value="budget" className="text-black [&>span:last-child]:text-center [&>span:last-child]:w-full">
                    Budget
                  </SelectItem>
                  <SelectItem value="leaderboard" className="text-black [&>span:last-child]:text-center [&>span:last-child]:w-full">
                    Leaderboard
                  </SelectItem>
                  <SelectItem value="brief-quality" className="text-black [&>span:last-child]:text-center [&>span:last-child]:w-full">
                    Brief quality
                  </SelectItem>
                  <SelectItem value="project-performance" className="text-black [&>span:last-child]:text-center [&>span:last-child]:w-full">
                    Project performance
                  </SelectItem>
                  <SelectItem value="predictive-analytics" className="text-black [&>span:last-child]:text-center [&>span:last-child]:w-full">
                    Predictive analytics & insights
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-10">
          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Leaderboard Tab Content */}
            <TabsContent value="leaderboard" className="mt-6">
              <div className="space-y-6 md:space-y-10">
          {/* Teams' Leaderboard */}
          <div className="space-y-4">
            <h2 className="text-[22px] font-bold leading-[29.26px] text-black">Teams' Leaderboard</h2>
            {/* Desktop: Show 3 teams with My team first */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
              {(() => {
                // Show in order: Omni & Digital | Marcomms | IMG
                const omniDigital = teamsData.find(team => team.title === "Omni & Digital");
                const marcomms = teamsData.find(team => team.title === "Marcomms");
                const img = teamsData.find(team => team.title === "IMG");
                const displayTeams = [omniDigital, marcomms, img].filter(Boolean);
                return displayTeams.map((team) => (
                  <Card key={team.id} 
                   className={`border border-[#ececec] bg-white relative ${
                    team.isMyTeam ? 'card-active' : ''
                  }`}
                  >
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
                      <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Brief quality score</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.briefQualityScore}%</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Token efficiency</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.tokenEfficiency}%</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Assets right first time</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.assetsRightFirstTime}%</span></div>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-8 h-8 rounded-full border border-[#03b3e2] overflow-hidden"><img src={boltImg} alt="Bolt" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full border border-[#ff9800] overflow-hidden"><img src={shakingHandsImg} alt="Shaking Hands" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full border border-[#e91e63] overflow-hidden"><img src={bullseyeImg} alt="Bullseye" className="w-full h-full object-cover" /></div>
                    </div>
                  </CardContent>
                </Card>
                ));
              })()}
            </div>
            {/* Mobile/Tablet: Show 3 teams with padding */}
            <div className="lg:hidden space-y-5">
              {(() => {
                // Show in order: Omni & Digital | Marcomms | IMG
                const omniDigital = teamsData.find(team => team.title === "Omni & Digital");
                const marcomms = teamsData.find(team => team.title === "Marcomms");
                const img = teamsData.find(team => team.title === "IMG");
                const displayTeams = [omniDigital, marcomms, img].filter(Boolean);
                return displayTeams.map((team) => (
                <Card key={team.id}
                 className={`border border-[#ececec] bg-white relative ${
                    team.isMyTeam ? 'card-active' : ''
                  }`}
                >
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
                    <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Brief quality score</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.briefQualityScore}%</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Token efficiency</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.tokenEfficiency}%</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm leading-[18.62px] text-black">Assets right first time</span><span className="text-sm leading-[18.62px] text-black font-normal">{team.assetsRightFirstTime}%</span></div>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-8 h-8 rounded-full border border-[#03b3e2] overflow-hidden"><img src={boltImg} alt="Bolt" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full border border-[#ff9800] overflow-hidden"><img src={shakingHandsImg} alt="Shaking Hands" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full border border-[#e91e63] overflow-hidden"><img src={bullseyeImg} alt="Bullseye" className="w-full h-full object-cover" /></div>
                    </div>
                  </CardContent>
                </Card>
                ));
              })()}
            </div>
          </div>

                {/* Detailed Performance Metrics Table */}
          <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[22px] font-bold leading-[29.26px]" style={{ color: '#03b3e2' }}>Detailed performance metrics</h3>
                    <p className="text-sm text-[#646464]">{getLastUpdated()}</p>
                  </div>
                  <Card className="border border-[#ececec] bg-white overflow-hidden rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f1f1f3] hover:bg-[#f1f1f3] border-b border-[#ececec]">
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Rank</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Team</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Number of projects</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">On-time delivery rate</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Brief quality</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Assets right first time</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Overall score</TableHead>
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
                            <TableCell className="px-4 py-4 text-black">{row.assetsRightFirstTime}%</TableCell>
                            <TableCell className="px-4 py-4 text-black font-medium">{row.overallScore}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Brief quality Tab Content */}
            <TabsContent value="brief-quality" className="mt-6">
              {/* Desktop: Grid Layout */}
              <div className="hidden lg:block space-y-6">
                {/* First Row: 3 equal columns */}
                <div className="grid grid-cols-3 gap-5">
                {/* 1. Brief quality score - all categories */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief quality score - all categories</CardTitle>
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

                {/* 2. Average number of iterations */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average number of iterations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ChartContainer config={iterationsConfig} className="h-[250px] md:h-[200px] w-full">
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
                      
                      {/* Insight section */}
                      <div className="flex flex-col gap-1 pt-2 pr-4 pb-2 pl-4 rounded-xl bg-[#F1F1F380]">
                        <p className="text-xs leading-[15.96px] font-bold text-[#00C3B1]">
                          Insight
                        </p>
                        <p className="text-xs leading-[18px] font-normal text-black">
                          Average iterations reduced to 1.8, indicating faster brief approval process
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                {/* 3. Average details provided in the brief */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average details provided in the brief</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ChartContainer config={detailsProvidedConfig} className="h-[250px] md:h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={detailsProvidedData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="detailsProvidedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0177c7" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#0177c7" stopOpacity={0} />
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
                              domain={[0, 20]}
                              ticks={[0, 5, 10, 15, 20]}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Area
                            type="monotone"
                            dataKey="fields"
                            stroke="#0177c7"
                            strokeWidth={2}
                            fill="url(#detailsProvidedGradient)"
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
                        Average details provided increased to 14 fields, showing improved brief completeness
                      </p>
                    </div>
                  </CardContent>
                </Card>
                </div>

                {/* Second Row: Three graphs in the same line */}
                <div className="grid grid-cols-3 gap-5">
                {/* 4. Right first-time */}
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
                    <ChartContainer config={rightFirstTimeConfig} className="h-[200px] w-full [&_.recharts-bar-rectangle]:fill-[#03b3e2] [&_.recharts-bar-rectangle]:stroke-none [&_.recharts-tooltip-cursor]:fill-transparent [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent">
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
                          <ChartTooltip 
                            cursor={{ fill: 'transparent' }}
                            content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} 
                          />
                          <Bar dataKey="percentage" fill="#03b3e2" radius={[4, 4, 0, 0]} stroke="none" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                {/* 5. Number of briefs per category */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Number of briefs per category</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-[60px]"></div>
                    <ChartContainer config={briefsPerCategoryConfig} className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={briefsPerCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                          <XAxis 
                            dataKey="category" 
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 80]}
                            ticks={[0, 20, 40, 60, 80]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Number of briefs", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                          />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="briefs" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                {/* 6. Briefs quality by category */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Briefs quality by category</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="h-[60px]"></div>
                    <ChartContainer config={briefsQualityByCategoryConfig} className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={briefsQualityByCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                          <XAxis 
                            dataKey="category" 
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[80, 95]}
                            ticks={[80, 85, 90, 95]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Quality Score (%)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="qualityScore" fill="#0177c7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                </div>

                {/* Third Row: Brief quality score and Brief top missing fields side by side */}
                <div className="grid grid-cols-2 gap-5">
                {/* 7. Brief quality score */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief quality score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[60px]"></div>
                    <HorizontalBarChart
                      title=""
                      bars={[
                        { value: 52, color: "#0177c7", label: "Excellent" },
                        { value: 67, color: "#03b3e2", label: "Good" },
                        { value: 31, color: "#8092dc", label: "Needs improvement" },
                        { value: 15, color: "#00c3b1", label: "Poor" },
                      ]}
                      legend={[
                        { color: "#0177c7", label: "Excellent" },
                        { color: "#03b3e2", label: "Good" },
                        { color: "#8092dc", label: "Needs improvement" },
                        { color: "#00c3b1", label: "Poor" },
                      ]}
                      totalText="Total: 165 briefs"
                    />
                  </CardContent>
                </Card>

                {/* 8. Brief top missing fields */}
                  <Card className="border border-[#ececec] bg-white">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief top missing fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0177c7' }}></div>
                        <span className="text-black">SMP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#03b3e2' }}></div>
                        <span className="text-black">Ecosystem</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00c3b1' }}></div>
                        <span className="text-black">Promotions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8092DC' }}></div>
                        <span className="text-black">B2B</span>
                      </div>
                    </div>

                    <ChartContainer config={missingFieldsConfig} className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={missingFieldsData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={true} vertical={false} />
                          <XAxis 
                            type="number" 
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 25]}
                            ticks={[0, 5, 10, 15, 20, 25]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Number of missing fields", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="field" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            width={120}
                          />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="smp" stackId="a" fill="#0177c7" radius={[6, 0, 0, 6]} />
                          <Bar dataKey="ecosystem" stackId="a" fill="#03b3e2" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="promotions" stackId="a" fill="#00c3b1" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="b2b" stackId="a" fill="#8092DC" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                </div>

                {/* Key Stats and Number of briefs Section */}
                <div className="flex flex-col md:flex-row gap-5 md:space-y-0">
                  {/* Key Stats - 50% */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <h3 className="text-[22px] font-bold leading-[29.26px] text-black">Key stats</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Draft brief</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.draftBrief}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Briefs in review</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.briefsInReview}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Scopes ready to sign</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.scopesReadyToSign}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Briefs approved</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.briefsApproved}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Number of briefs Chart - 50% */}
                  <div className="w-full md:w-1/2">
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Number of briefs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={numberOfBriefsConfig} className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={numberOfBriefsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                              <XAxis 
                                dataKey="month" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 110]}
                                ticks={[0, 20, 40, 60, 80, 100]}
                                tick={{ fill: "#646464", fontSize: 12 }}
                                label={{ value: "Number of briefs", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                              />
                              <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                              <Legend />
                              <Bar dataKey="smp" stackId="a" fill="#0177c7" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="ecosystem" stackId="a" fill="#03b3e2" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="promotions" stackId="a" fill="#00c3b1" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="b2b" stackId="a" fill="#8092DC" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Tablet/Mobile: Vertical Stack */}
              <div className="lg:hidden space-y-6">
                {/* Row 1: Brief quality score - all categories | Average number of iterations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 1. Brief quality score - all categories */}
                  <Card className="border border-[#ececec] bg-white flex flex-col">
                <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief quality score - all categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col">
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

                  {/* 2. Average number of iterations */}
                  <Card className="border border-[#ececec] bg-white flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average number of iterations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col">
                      <ChartContainer config={iterationsConfig} className="h-[250px] md:h-[200px] w-full">
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
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[1.5, 2.5]}
                              ticks={[1.5, 1.75, 2.0, 2.25, 2.5]}
                              tick={{ fill: "#646464", fontSize: 12 }}
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
                      
                      {/* Insight section */}
                      <div className="flex flex-col gap-1 pt-2 pr-4 pb-2 pl-4 rounded-xl bg-[#F1F1F380]">
                        <p className="text-xs leading-[15.96px] font-bold text-[#00C3B1]">
                          Insight
                        </p>
                        <p className="text-xs leading-[18px] font-normal text-black">
                          Average iterations reduced to 1.8, indicating faster brief approval process
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                        </div>

                {/* Row 2: Average details provided in the brief | Right first-time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 3. Average details provided in the brief */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average details provided in the brief</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ChartContainer config={detailsProvidedConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={detailsProvidedData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <defs>
                              <linearGradient id="detailsProvidedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0177c7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0177c7" stopOpacity={0} />
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
                              domain={[0, 20]}
                              ticks={[0, 5, 10, 15, 20]}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Area
                              type="monotone"
                              dataKey="fields"
                              stroke="#0177c7"
                              strokeWidth={2}
                              fill="url(#detailsProvidedGradient)"
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
                          Average details provided increased to 14 fields, showing improved brief completeness
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 4. Right first-time */}
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
                      <ChartContainer config={rightFirstTimeConfig} className="h-[200px] w-full [&_.recharts-bar-rectangle]:fill-[#03b3e2] [&_.recharts-bar-rectangle]:stroke-none [&_.recharts-tooltip-cursor]:fill-transparent [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent">
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
                            <ChartTooltip 
                              cursor={{ fill: 'transparent' }}
                              content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} 
                            />
                            <Bar dataKey="percentage" fill="#03b3e2" radius={[4, 4, 0, 0]} stroke="none" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Row 3: Number of briefs per category | Briefs quality by category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 5. Number of briefs per category */}
                  <Card className="border border-[#ececec] bg-white">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Number of briefs per category</CardTitle>
                </CardHeader>
                  <CardContent className="space-y-4">
                      <ChartContainer config={briefsPerCategoryConfig} className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={briefsPerCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                          <XAxis 
                            dataKey="category" 
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 80]}
                            ticks={[0, 20, 40, 60, 80]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Number of briefs", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="briefs" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                  {/* 6. Briefs quality by category */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Briefs quality by category</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <ChartContainer config={briefsQualityByCategoryConfig} className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={briefsQualityByCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[80, 95]}
                              ticks={[80, 85, 90, 95]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Quality Score (%)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="qualityScore" fill="#0177c7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* 7. Brief quality score and Brief top missing fields - stacked on tablet */}
                <div className="grid grid-cols-1 gap-5">
                {/* Brief quality score */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief quality score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HorizontalBarChart
                      title=""
                      bars={[
                        { value: 52, color: "#0177c7", label: "Excellent" },
                        { value: 67, color: "#03b3e2", label: "Good" },
                        { value: 31, color: "#8092dc", label: "Needs improvement" },
                        { value: 15, color: "#00c3b1", label: "Poor" },
                      ]}
                      legend={[
                        { color: "#0177c7", label: "Excellent" },
                        { color: "#03b3e2", label: "Good" },
                        { color: "#8092dc", label: "Needs improvement" },
                        { color: "#00c3b1", label: "Poor" },
                      ]}
                      totalText="Total: 165 briefs"
                    />
                  </CardContent>
                </Card>

                {/* Brief top missing fields */}
                <Card className="border border-[#ececec] bg-white overflow-x-visible">
                  <CardHeader className="pb-3 px-3 md:px-6">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief top missing fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 overflow-x-visible px-3 md:px-6">
                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0177c7' }}></div>
                        <span className="text-black">SMP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#03b3e2' }}></div>
                        <span className="text-black">Ecosystem</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00c3b1' }}></div>
                        <span className="text-black">Promotions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8092DC' }}></div>
                        <span className="text-black">B2B</span>
                      </div>
                    </div>

                    <div className="w-[calc(100%+80px)] -ml-[80px] md:w-full md:ml-0">
                    <ChartContainer config={missingFieldsConfig} className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={missingFieldsData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={true} vertical={false} />
                          <XAxis 
                            type="number" 
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 25]}
                            ticks={[0, 5, 10, 15, 20, 25]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Number of missing fields", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="field" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                              width={60}
                              className="md:!w-[120px]"
                          />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="smp" stackId="a" fill="#0177c7" radius={[6, 0, 0, 6]} />
                          <Bar dataKey="ecosystem" stackId="a" fill="#03b3e2" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="promotions" stackId="a" fill="#00c3b1" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="b2b" stackId="a" fill="#8092DC" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                </div>

                {/* Key Stats and Number of briefs Section */}
                <div className="flex flex-col md:flex-row gap-5 md:space-y-0">
                  {/* Key Stats - 50% */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <h3 className="text-[22px] font-bold leading-[29.26px] text-black">Key stats</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Draft brief</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.draftBrief}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Briefs in review</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.briefsInReview}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Scopes ready to sign</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.scopesReadyToSign}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Briefs approved</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.briefsApproved}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Number of briefs Chart - 50% */}
                  <div className="w-full md:w-1/2">
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Number of briefs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={numberOfBriefsConfig} className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={numberOfBriefsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                              <XAxis 
                                dataKey="month" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 110]}
                                ticks={[0, 20, 40, 60, 80, 100]}
                                tick={{ fill: "#646464", fontSize: 12 }}
                                label={{ value: "Number of briefs", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                              />
                              <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                              <Legend />
                              <Bar dataKey="smp" stackId="a" fill="#0177c7" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="ecosystem" stackId="a" fill="#03b3e2" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="promotions" stackId="a" fill="#00c3b1" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="b2b" stackId="a" fill="#8092DC" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Tablet/Mobile: Vertical Stack (duplicate content hidden intentionally) */}
              <div className="hidden">
                {/* Row 1: Brief quality score - all categories | Average number of iterations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 1. Brief quality score - all categories */}
                  <Card className="border border-[#ececec] bg-white flex flex-col">
                <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief quality score - all categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col">
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

                  {/* 2. Average number of iterations */}
                  <Card className="border border-[#ececec] bg-white flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average number of iterations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col">
                      <ChartContainer config={iterationsConfig} className="h-[250px] md:h-[200px] w-full">
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
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[1.5, 2.5]}
                              ticks={[1.5, 1.75, 2.0, 2.25, 2.5]}
                              tick={{ fill: "#646464", fontSize: 12 }}
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
                      
                      {/* Insight section */}
                      <div className="flex flex-col gap-1 pt-2 pr-4 pb-2 pl-4 rounded-xl bg-[#F1F1F380]">
                        <p className="text-xs leading-[15.96px] font-bold text-[#00C3B1]">
                          Insight
                        </p>
                        <p className="text-xs leading-[18px] font-normal text-black">
                          Average iterations reduced to 1.8, indicating faster brief approval process
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                        </div>

                {/* Row 2: Average details provided in the brief | Right first-time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 3. Average details provided in the brief */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average details provided in the brief</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ChartContainer config={detailsProvidedConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={detailsProvidedData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <defs>
                              <linearGradient id="detailsProvidedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0177c7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0177c7" stopOpacity={0} />
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
                              domain={[0, 20]}
                              ticks={[0, 5, 10, 15, 20]}
                              tick={{ fill: "#646464", fontSize: 11 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Area
                              type="monotone"
                              dataKey="fields"
                              stroke="#0177c7"
                              strokeWidth={2}
                              fill="url(#detailsProvidedGradient)"
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
                          Average details provided increased to 14 fields, showing improved brief completeness
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 4. Right first-time */}
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
                      <ChartContainer config={rightFirstTimeConfig} className="h-[200px] w-full [&_.recharts-bar-rectangle]:fill-[#03b3e2] [&_.recharts-bar-rectangle]:stroke-none [&_.recharts-tooltip-cursor]:fill-transparent [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent">
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
                            <ChartTooltip 
                              cursor={{ fill: 'transparent' }}
                              content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} 
                            />
                            <Bar dataKey="percentage" fill="#03b3e2" radius={[4, 4, 0, 0]} stroke="none" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Row 3: Number of briefs per category | Briefs quality by category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 5. Number of briefs per category */}
                  <Card className="border border-[#ececec] bg-white">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Number of briefs per category</CardTitle>
                </CardHeader>
                  <CardContent className="space-y-4">
                      <ChartContainer config={briefsPerCategoryConfig} className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={briefsPerCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                          <XAxis 
                            dataKey="category" 
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 80]}
                            ticks={[0, 20, 40, 60, 80]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Number of briefs", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="briefs" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                  {/* 6. Briefs quality by category */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Briefs quality by category</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <ChartContainer config={briefsQualityByCategoryConfig} className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={briefsQualityByCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[80, 95]}
                              ticks={[80, 85, 90, 95]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Quality Score (%)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="qualityScore" fill="#0177c7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* 7. Brief quality score and Brief top missing fields - stacked on tablet */}
                <div className="grid grid-cols-1 gap-5">
                {/* Brief quality score */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief quality score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HorizontalBarChart
                      title=""
                      bars={[
                        { value: 52, color: "#0177c7", label: "Excellent" },
                        { value: 67, color: "#03b3e2", label: "Good" },
                        { value: 31, color: "#8092dc", label: "Needs improvement" },
                        { value: 15, color: "#00c3b1", label: "Poor" },
                      ]}
                      legend={[
                        { color: "#0177c7", label: "Excellent" },
                        { color: "#03b3e2", label: "Good" },
                        { color: "#8092dc", label: "Needs improvement" },
                        { color: "#00c3b1", label: "Poor" },
                      ]}
                      totalText="Total: 165 briefs"
                    />
                  </CardContent>
                </Card>

                {/* Brief top missing fields */}
                <Card className="border border-[#ececec] bg-white overflow-x-visible">
                  <CardHeader className="pb-3 px-3 md:px-6">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brief top missing fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 overflow-x-visible px-3 md:px-6">
                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0177c7' }}></div>
                        <span className="text-black">SMP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#03b3e2' }}></div>
                        <span className="text-black">Ecosystem</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00c3b1' }}></div>
                        <span className="text-black">Promotions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8092DC' }}></div>
                        <span className="text-black">B2B</span>
                      </div>
                    </div>

                    <div className="w-[calc(100%+80px)] -ml-[80px] md:w-full md:ml-0">
                    <ChartContainer config={missingFieldsConfig} className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={missingFieldsData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={true} vertical={false} />
                          <XAxis 
                            type="number" 
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 25]}
                            ticks={[0, 5, 10, 15, 20, 25]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Number of missing fields", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="field" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                              width={60}
                              className="md:!w-[120px]"
                          />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="smp" stackId="a" fill="#0177c7" radius={[6, 0, 0, 6]} />
                          <Bar dataKey="ecosystem" stackId="a" fill="#03b3e2" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="promotions" stackId="a" fill="#00c3b1" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="b2b" stackId="a" fill="#8092DC" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                </div>

                {/* Key Stats and Number of briefs Section */}
                <div className="flex flex-col md:flex-row gap-5 md:space-y-0">
                  {/* Key Stats - 50% */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <h3 className="text-[22px] font-bold leading-[29.26px] text-black">Key stats</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Draft brief</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.draftBrief}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Briefs in review</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.briefsInReview}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Scopes ready to sign</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.scopesReadyToSign}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-[#ececec] bg-white">
                        <CardContent className="pt-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#646464]">Briefs approved</span>
                            <span className="text-[32px] font-bold leading-[38.4px] text-black">{keyStatsData.briefsApproved}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Number of briefs Chart - 50% */}
                  <div className="w-full md:w-1/2">
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Number of briefs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={numberOfBriefsConfig} className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={numberOfBriefsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                              <XAxis 
                                dataKey="month" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 110]}
                                ticks={[0, 20, 40, 60, 80, 100]}
                                tick={{ fill: "#646464", fontSize: 12 }}
                                label={{ value: "Number of briefs", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                              />
                              <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                              <Legend />
                              <Bar dataKey="smp" stackId="a" fill="#0177c7" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="ecosystem" stackId="a" fill="#03b3e2" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="promotions" stackId="a" fill="#00c3b1" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="b2b" stackId="a" fill="#8092DC" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Project Performance Tab Content */}
            <TabsContent value="project-performance" className="mt-6">
              {/* Desktop: Grid Layout */}
              <div className="hidden lg:block space-y-6">
                {/* Completed projects */}
              <Card className="border border-[#ececec] bg-white">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-[#03b3e2]">Completed projects</CardTitle>
                    <p className="text-sm text-[#646464]">Most recent deliveries with key delivery metrics.</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f1f1f3] hover:bg-[#f1f1f3] border-b border-[#ececec]">
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Project</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Category</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Tokens spent</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Duration</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">On-time</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Change requests</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Average rounds of amends</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Assets RFT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedProjectsData.map((project, index) => {
                        const onTimeClasses = project.onTime
                          ? "inline-flex items-center px-2 py-1 rounded-md bg-[#00C3B10F] text-[#00C3B1] text-xs font-medium"
                          : "inline-flex items-center px-2 py-1 rounded-md bg-[#FF43370F] text-[#FF4337] text-xs font-medium";
                        return (
                          <TableRow
                            key={project.id}
                            className={`border-b border-[#ececec] ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#f1f1f3]`}
                          >
                            <TableCell className="px-4 py-4 text-black font-medium">{project.projectName}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.category}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.tokensSpent.toLocaleString()}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.durationWeeks} wks</TableCell>
                            <TableCell className="px-4 py-4 text-black">
                              <span className={onTimeClasses}>{project.onTime ? "On time" : "Delayed"}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.changeRequests}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.roundsOfAmends}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.assetsRightFirstTime}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

                {/* Row 1: Rounds 30% / Change Requests 70% */}
                <div className="grid grid-cols-10 gap-5">
                  {/* Average rounds of amends */}
                  <Card className="border border-[#ececec] bg-white col-span-3 flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average rounds of amends</CardTitle>
                  </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                    <ChartContainer config={roundsOfAmendsConfig} className="h-[250px] md:h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={roundsOfAmendsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="roundsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0177c7" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#0177c7" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={true} />
                          <XAxis 
                            dataKey="period" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Quarter", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[1.5, 3.0]}
                            ticks={[1.5, 2.0, 2.5, 3.0]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Rounds", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Area
                            type="monotone"
                            dataKey="rounds"
                            stroke="#0177c7"
                            strokeWidth={2}
                            fill="url(#roundsGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                  {/* CHANGE REQUESTS */}
                  <Card className="border border-[#ececec] bg-white col-span-7">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-[#03b3e2]" />
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">CHANGE REQUESTS</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Main Metric */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[48px] font-bold leading-[57.6px]" style={{ color: "#03b3e2" }}>5%</div>
                      <div className="text-sm text-black">Q1 2025: 8% → Q2 2025: 5%</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00C3B10F] w-fit">
                        <span className="text-sm font-medium text-[#00C3B1]">-3% vs Q1 2025</span>
                      </div>
                    </div>

                    {/* Breakdown by Product Line */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold leading-[18.62px] text-black">Change in request rate by category</h4>
                      <div className="space-y-3">
                        {changeRequestsData.map((item) => {
                          const absValue = Math.abs(item.changeRate);
                          const maxValue = 25;
                          const widthPercent = (absValue / maxValue) * 100;
                          const colorMap: Record<string, string> = {
                            SMP: "#0177c7",
                            Ecosystem: "#03b3e2",
                            Promotions: "#00c3b1",
                            B2B: "#8092DC",
                          };
                          const color = colorMap[item.productLine] || "#0177c7";

                          return (
                            <div key={item.productLine} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">{item.productLine}</span>
                              </div>
                              <div className="relative h-6 w-full bg-[#f1f1f3] rounded-md overflow-hidden">
                                <div
                                  className="h-full flex items-center justify-end pr-2 rounded-md"
                                  style={{
                                    width: `${widthPercent}%`,
                                    backgroundColor: color,
                                  }}
                                >
                                  <span className="text-white text-xs font-medium">{absValue}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>

                {/* Row 2: Additional token spend / Brand Legal / On-time */}
                <div className="grid grid-cols-10 gap-5">
                  {/* Additional token spend */}
                  <Card className="border border-[#ececec] bg-white col-span-3 flex flex-col">
                  <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Additional token spend</CardTitle>
                  </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                      <ChartContainer config={additionalTokenSpendConfig} className="h-[250px] md:h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={additionalTokenSpendData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
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
                              domain={[0, 500]}
                              ticks={[0, 100, 200, 300, 400, 500]}
                              tick={{ fill: "#646464", fontSize: 11 }}
                              label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 10, style: { fill: "#646464", fontSize: 11, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="tokens" fill="#8092DC" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Brand and legal amends - right first time */}
                  <Card className="border border-[#ececec] bg-white col-span-2 flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brand and legal amends - right first time</CardTitle>
                  </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                    <ChartContainer config={brandLegalAmendsConfig} className="h-[250px] md:h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={brandLegalAmendsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <defs>
                            <linearGradient id="brandLegalGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00c3b1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#00c3b1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={true} />
                          <XAxis 
                            dataKey="period" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Quarter", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            domain={[80, 95]}
                            ticks={[80, 85, 90, 95]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                            label={{ value: "Right First Time (%)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Area
                            type="monotone"
                            dataKey="percentage"
                            stroke="#00c3b1"
                            strokeWidth={2}
                            fill="url(#brandLegalGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                  {/* ON-TIME DELIVERY */}
                  <Card className="border border-[#ececec] bg-white col-span-5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-[#03b3e2]" />
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black uppercase">ON-TIME DELIVERY</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Main Metric */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[48px] font-bold leading-[57.6px]" style={{ color: "#03b3e2" }}>91%</div>
                      <div className="text-sm text-black">Q1 2025: 87% → Q2 2025: 91%</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00C3B10F] border border-[#00C3B1]/20 w-fit">
                        <span className="text-sm font-medium text-[#00C3B1]">+4% vs Q1 2025</span>
                      </div>
                    </div>

                    {/* Breakdown by Product Line */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold leading-[18.62px] text-black">Change in on-time delivery by category</h4>
                      <div className="space-y-3">
                        {onTimeDeliveryData.map((item) => {
                          const maxValue = 32;
                          const widthPercent = (item.changeRate / maxValue) * 100;
                          const colorMap: Record<string, string> = {
                            Mobile: "#0177c7",
                            Tablet: "#03b3e2",
                            Wearable: "#00c3b1",
                              Ecosystem: "#00c3b1",
                          };
                          const badgeColorMap: Record<string, string> = {
                            Mobile: "#0177c7",
                            Tablet: "#03b3e2",
                            Wearable: "#00c3b1",
                              Ecosystem: "#00c3b1",
                          };
                          const color = colorMap[item.productLine] || "#0177c7";
                          const badgeColor = badgeColorMap[item.productLine] || "#0177c7";

                          return (
                            <div key={item.productLine} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">{item.productLine}</span>
                                <div className="inline-flex items-center px-2 py-0.5 rounded-md" style={{ backgroundColor: `${badgeColor}1A`, color: badgeColor }}>
                                  <span className="text-sm font-medium">+{item.changeRate}%</span>
                                </div>
                              </div>
                              <div className="relative h-6 w-full bg-[#f1f1f3] rounded-md overflow-hidden">
                                <div
                                  className="h-full flex items-center justify-end pr-2 rounded-md"
                                  style={{
                                    width: `${widthPercent}%`,
                                    backgroundColor: color,
                                  }}
                                >
                                  <span className="text-white text-xs font-medium">+{item.changeRate}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>

                {/* Row 3: Top Reasons for Issues - All Categories */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[22px] font-bold leading-[29.26px] text-black">Top reasons for issues - all categories</h3>
                    <p className="text-sm text-[#646464]">Analysis of primary factors causing project delays and performance issues.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Late briefs */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Late briefs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={lateBriefsConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <ChartTooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return <PieChartTooltip data={lateBriefsData.map(item => ({ name: item.name, value: item.value, color: item.color }))} config={lateBriefsConfig} />;
                                  }
                                  return null;
                                }}
                              />
                              <Pie
                                data={lateBriefsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {lateBriefsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="flex flex-col gap-1">
                          <div className="text-[32px] font-bold leading-[38.4px]" style={{ color: "#03b3e2" }}>13%</div>
                          <p className="text-sm text-black">of projects were briefed later than expected.</p>
                          <p className="text-xs text-[#646464]">Q2 2025: 8%</p>
                    </div>
                        {/* Results at bottom - Tablet only */}
                        <div className="lg:hidden pt-4 border-t border-[#ececec] space-y-2">
                          {lateBriefsData.map((item, index) => {
                            const total = lateBriefsData.reduce((sum, entry) => sum + entry.value, 0);
                            const percentage = ((item.value / total) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-xs text-black">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-black">{percentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 2: Extended / delayed projects */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Extended / delayed projects</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={extendedProjectsConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <ChartTooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return <PieChartTooltip data={extendedProjectsData.map(item => ({ name: item.name, value: item.value, color: item.color }))} config={extendedProjectsConfig} />;
                                  }
                                  return null;
                                }}
                              />
                              <Pie
                                data={extendedProjectsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {extendedProjectsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="flex flex-col gap-1">
                          <div className="text-[32px] font-bold leading-[38.4px]" style={{ color: "#03b3e2" }}>41%</div>
                          <p className="text-sm text-black">of projects were delayed/extended In flight.</p>
                          <p className="text-xs text-[#646464]">Q2 2025: 32%</p>
                        </div>
                        {/* Results at bottom - Tablet only */}
                        <div className="lg:hidden pt-4 border-t border-[#ececec] space-y-2">
                          {extendedProjectsData.map((item, index) => {
                            const total = extendedProjectsData.reduce((sum, entry) => sum + entry.value, 0);
                            const percentage = ((item.value / total) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-xs text-black">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-black">{percentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 3: Insufficient time */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Insufficient time</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={insufficientTimeConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <ChartTooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return <PieChartTooltip data={insufficientTimeData.map(item => ({ name: item.name, value: item.value, color: item.color }))} config={insufficientTimeConfig} />;
                                  }
                                  return null;
                                }}
                              />
                              <Pie
                                data={insufficientTimeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {insufficientTimeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="flex flex-col gap-1">
                          <div className="text-[32px] font-bold leading-[38.4px]" style={{ color: "#03b3e2" }}>30%</div>
                          <p className="text-sm text-black">of projects were briefed with Insufficient time.</p>
                          <p className="text-xs text-[#646464]">Q2 2025: 22%</p>
                        </div>
                        {/* Results at bottom - Tablet only */}
                        <div className="lg:hidden pt-4 border-t border-[#ececec] space-y-2">
                          {insufficientTimeData.map((item, index) => {
                            const total = insufficientTimeData.reduce((sum, entry) => sum + entry.value, 0);
                            const percentage = ((item.value / total) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-xs text-black">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-black">{percentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Row 5: Issues Breakdown */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px]" style={{ color: "#03b3e2" }}>Issues Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f1f1f3] hover:bg-[#f1f1f3] border-b border-[#ececec]">
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Issue type</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">In flight</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Resolved</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Impact</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Primary categore</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {issuesBreakdownData.map((issue, index) => (
                          <TableRow 
                            key={issue.issueType} 
                            className={`border-b border-[#ececec] ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#f1f1f3]`}
                          >
                            <TableCell className="px-4 py-4 text-black font-medium">{issue.issueType}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{issue.inFlight}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{issue.resolved}</TableCell>
                            <TableCell className="px-4 py-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#00C3B10F] text-[#00C3B1] text-sm">
                                {issue.impact}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-black text-sm">{issue.primaryProductLine}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Tablet/Mobile: Vertical Stack */}
              <div className="lg:hidden space-y-6">
                {/* Completed projects */}
              <Card className="border border-[#ececec] bg-white">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-[#03b3e2]">Completed projects</CardTitle>
                    <p className="text-sm text-[#646464]">Most recent deliveries with key delivery metrics.</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f1f1f3] hover:bg-[#f1f1f3] border-b border-[#ececec]">
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Project</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Category</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Tokens spent</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Duration</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">On-time</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Change requests</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Average rounds of amends</TableHead>
                        <TableHead className="h-12 px-4 text-left font-bold text-black">Assets RFT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedProjectsData.map((project, index) => {
                        const onTimeClasses = project.onTime
                          ? "inline-flex items-center px-2 py-1 rounded-md bg-[#00C3B10F] text-[#00C3B1] text-xs font-medium"
                          : "inline-flex items-center px-2 py-1 rounded-md bg-[#FF43370F] text-[#FF4337] text-xs font-medium";
                        return (
                          <TableRow
                            key={project.id}
                            className={`border-b border-[#ececec] ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#f1f1f3]`}
                          >
                            <TableCell className="px-4 py-4 text-black font-medium">{project.projectName}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.category}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.tokensSpent.toLocaleString()}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.durationWeeks} wks</TableCell>
                            <TableCell className="px-4 py-4 text-black">
                              <span className={onTimeClasses}>{project.onTime ? "On time" : "Delayed"}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.changeRequests}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.roundsOfAmends}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{project.assetsRightFirstTime}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

                {/* Row 1: Additional token spend */}
                <Card className="border border-[#ececec] bg-white flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px] text-black">Additional token spend</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center">
                    <ChartContainer config={additionalTokenSpendConfig} className="h-[250px] md:h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={additionalTokenSpendData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
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
                            domain={[0, 500]}
                            ticks={[0, 100, 200, 300, 400, 500]}
                            tick={{ fill: "#646464", fontSize: 11 }}
                            label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 10, style: { fill: "#646464", fontSize: 11, textAnchor: "middle" } }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="tokens" fill="#8092DC" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Row 2: Average rounds of amends + Brand and Legal amends side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Average rounds of amends */}
                  <Card className="border border-[#ececec] bg-white flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Average rounds of amends</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                      <ChartContainer config={roundsOfAmendsConfig} className="h-[250px] md:h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={roundsOfAmendsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <defs>
                              <linearGradient id="roundsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0177c7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0177c7" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={true} />
                            <XAxis 
                              dataKey="period" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Quarter", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[1.5, 3.0]}
                              ticks={[1.5, 2.0, 2.5, 3.0]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Rounds", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Area
                              type="monotone"
                              dataKey="rounds"
                              stroke="#0177c7"
                              strokeWidth={2}
                              fill="url(#roundsGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Brand and legal amends - right first time */}
                  <Card className="border border-[#ececec] bg-white flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Brand and legal amends - right first time</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                      <ChartContainer config={brandLegalAmendsConfig} className="h-[250px] md:h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={brandLegalAmendsData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <defs>
                              <linearGradient id="brandLegalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00c3b1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00c3b1" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={true} />
                            <XAxis 
                              dataKey="period" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Quarter", position: "insideBottom", offset: -5, style: { fill: "#646464", fontSize: 12 } }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[80, 95]}
                              ticks={[80, 85, 90, 95]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Right First Time (%)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Area
                              type="monotone"
                              dataKey="percentage"
                              stroke="#00c3b1"
                              strokeWidth={2}
                              fill="url(#brandLegalGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Row 2: CHANGE REQUESTS */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-[#03b3e2]" />
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">CHANGE REQUESTS</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Main Metric */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[48px] font-bold leading-[57.6px]" style={{ color: "#03b3e2" }}>5%</div>
                      <div className="text-sm text-black">Q1 2025: 8% → Q2 2025: 5%</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00C3B10F] w-fit">
                        <span className="text-sm font-medium text-[#00C3B1]">-3% vs Q1 2025</span>
                      </div>
                    </div>

                    {/* Breakdown by Product Line */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold leading-[18.62px] text-black">Change in request rate by category</h4>
                      <div className="space-y-3">
                        {changeRequestsData.map((item) => {
                          const absValue = Math.abs(item.changeRate);
                          const maxValue = 25;
                          const widthPercent = (absValue / maxValue) * 100;
                          const colorMap: Record<string, string> = {
                            SMP: "#0177c7",
                            Ecosystem: "#03b3e2",
                            Promotions: "#00c3b1",
                            B2B: "#8092DC",
                          };
                          const color = colorMap[item.productLine] || "#0177c7";

                          return (
                            <div key={item.productLine} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">{item.productLine}</span>
                              </div>
                              <div className="relative h-6 w-full bg-[#f1f1f3] rounded-md overflow-hidden">
                                <div
                                  className="h-full flex items-center justify-end pr-2 rounded-md"
                                  style={{
                                    width: `${widthPercent}%`,
                                    backgroundColor: color,
                                  }}
                                >
                                  <span className="text-white text-xs font-medium">{absValue}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Row 3: ON-TIME DELIVERY */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-[#03b3e2]" />
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black uppercase">ON-TIME DELIVERY</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Main Metric */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[48px] font-bold leading-[57.6px]" style={{ color: "#03b3e2" }}>91%</div>
                      <div className="text-sm text-black">Q1 2025: 87% → Q2 2025: 91%</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00C3B10F] border border-[#00C3B1]/20 w-fit">
                        <span className="text-sm font-medium text-[#00C3B1]">+4% vs Q1 2025</span>
                      </div>
                    </div>

                    {/* Breakdown by Product Line */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold leading-[18.62px] text-black">Change in on-time delivery by category</h4>
                      <div className="space-y-3">
                        {onTimeDeliveryData.map((item) => {
                          const maxValue = 32;
                          const widthPercent = (item.changeRate / maxValue) * 100;
                          const colorMap: Record<string, string> = {
                            SMP: "#0177c7",
                            Ecosystem: "#03b3e2",
                            Promotions: "#00c3b1",
                            B2B: "#8092DC",
                          };
                          const badgeColorMap: Record<string, string> = {
                            SMP: "#0177c7",
                            Ecosystem: "#03b3e2",
                            Promotions: "#00c3b1",
                            B2B: "#8092DC",
                          };
                          const color = colorMap[item.productLine] || "#0177c7";
                          const badgeColor = badgeColorMap[item.productLine] || "#0177c7";

                          return (
                            <div key={item.productLine} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">{item.productLine}</span>
                                <div className="inline-flex items-center px-2 py-0.5 rounded-md" style={{ backgroundColor: `${badgeColor}1A`, color: badgeColor }}>
                                  <span className="text-sm font-medium">+{item.changeRate}%</span>
                                </div>
                              </div>
                              <div className="relative h-6 w-full bg-[#f1f1f3] rounded-md overflow-hidden">
                                <div
                                  className="h-full flex items-center justify-end pr-2 rounded-md"
                                  style={{
                                    width: `${widthPercent}%`,
                                    backgroundColor: color,
                                  }}
                                >
                                  <span className="text-white text-xs font-medium">+{item.changeRate}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Row 4: Top Reasons for Issues - All Categories */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[22px] font-bold leading-[29.26px] text-black">Top reasons for issues - all categories</h3>
                    <p className="text-sm text-[#646464]">Analysis of primary factors causing project delays and performance issues.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Late briefs */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Late briefs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={lateBriefsConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={lateBriefsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {lateBriefsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="flex flex-col gap-1">
                          <div className="text-[32px] font-bold leading-[38.4px]" style={{ color: "#03b3e2" }}>13%</div>
                          <p className="text-sm text-black">of projects were briefed later than expected.</p>
                          <p className="text-xs text-[#646464]">Q2 2025: 8%</p>
                        </div>
                        {/* Results at bottom - Tablet only */}
                        <div className="pt-4 border-t border-[#ececec] space-y-2">
                          {lateBriefsData.map((item, index) => {
                            const total = lateBriefsData.reduce((sum, entry) => sum + entry.value, 0);
                            const percentage = ((item.value / total) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-xs text-black">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-black">{percentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 2: Extended / delayed projects */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Extended / delayed projects</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={extendedProjectsConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={extendedProjectsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {extendedProjectsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="flex flex-col gap-1">
                          <div className="text-[32px] font-bold leading-[38.4px]" style={{ color: "#03b3e2" }}>41%</div>
                          <p className="text-sm text-black">of projects were delayed/extended In flight.</p>
                          <p className="text-xs text-[#646464]">Q2 2025: 32%</p>
                        </div>
                        {/* Results at bottom - Tablet only */}
                        <div className="pt-4 border-t border-[#ececec] space-y-2">
                          {extendedProjectsData.map((item, index) => {
                            const total = extendedProjectsData.reduce((sum, entry) => sum + entry.value, 0);
                            const percentage = ((item.value / total) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-xs text-black">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-black">{percentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 3: Insufficient time */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Insufficient time</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ChartContainer config={insufficientTimeConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={insufficientTimeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {insufficientTimeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="flex flex-col gap-1">
                          <div className="text-[32px] font-bold leading-[38.4px]" style={{ color: "#03b3e2" }}>30%</div>
                          <p className="text-sm text-black">of projects were briefed with Insufficient time.</p>
                          <p className="text-xs text-[#646464]">Q2 2025: 22%</p>
                        </div>
                        {/* Results at bottom - Tablet only */}
                        <div className="pt-4 border-t border-[#ececec] space-y-2">
                          {insufficientTimeData.map((item, index) => {
                            const total = insufficientTimeData.reduce((sum, entry) => sum + entry.value, 0);
                            const percentage = ((item.value / total) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-xs text-black">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-black">{percentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Row 5: Issues Breakdown */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold leading-[21.28px]" style={{ color: "#03b3e2" }}>Issues Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f1f1f3] hover:bg-[#f1f1f3] border-b border-[#ececec]">
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Issue type</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">In flight</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Resolved</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Impact</TableHead>
                          <TableHead className="h-12 px-4 text-left font-bold text-black">Primary category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {issuesBreakdownData.map((issue, index) => (
                          <TableRow 
                            key={issue.issueType} 
                            className={`border-b border-[#ececec] ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#f1f1f3]`}
                          >
                            <TableCell className="px-4 py-4 text-black font-medium">{issue.issueType}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{issue.inFlight}</TableCell>
                            <TableCell className="px-4 py-4 text-black">{issue.resolved}</TableCell>
                            <TableCell className="px-4 py-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#00C3B10F] text-[#00C3B1] text-sm">
                                {issue.impact}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-4 text-black text-sm">{issue.primaryProductLine}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Budget Tab Content */}
            <TabsContent value="budget" className="mt-6">
              <TooltipProvider>
                {/* Desktop: Side-by-side layout */}
                <div className="hidden lg:grid lg:grid-cols-10 lg:gap-5">
                  {/* Wallet Component */}
                  <Card className="border border-[#ececec] bg-white lg:col-span-7">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wallet size={20} className="text-[#03b3e2]" />
                            <CardTitle className="text-base font-bold leading-[21.28px] text-black">Wallet</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 bg-[#f1f1f3] rounded-md p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setBudgetView("quarter")}
                              className={`h-8 px-3 text-sm ${budgetView === "quarter" ? "bg-white text-black shadow-sm" : "text-[#646464]"}`}
                            >
                              Quarter
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setBudgetView("annual")}
                              className={`h-8 px-3 text-sm ${budgetView === "annual" ? "bg-white text-black shadow-sm" : "text-[#646464]"}`}
                            >
                              Annual
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {(() => {
                          const budgetData = budgetView === "quarter" ? quarterBudgetData : annualBudgetData;
                          const periodLabel = budgetView === "quarter" ? "this quarter" : "per annum";
                          
                          return (
                            <>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-black">Total budget {periodLabel}</span>
                                  <span className="text-lg font-bold text-black">{budgetData.totalBudget.toLocaleString()} tokens</span>
                                </div>
                                
                                {/* Metrics Grid - 2x2 */}
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Tokens spent */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens spent on completed projects</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Tokens used for completed projects. This amount reflects budget already spent.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-black">{budgetData.tokensSpent.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensSpent / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>

                                  {/* Tokens committed  */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens committed to WIP projects</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Tokens allocated to projects currently in progress. If a project is paused or stopped, unused tokens may be reinstated depending on its stage.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-black">{budgetData.tokensCommitted.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensCommitted / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>

                                  {/* Tokens remaining */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens remaining in budget this quarter</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Tokens still available in your overall budget that have not yet been used or allocated.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-[#03b3e2]">{budgetData.tokensRemaining.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensRemaining / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>

                                  {/* Tokens pending */}
                                  <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-black">Tokens pending for briefs in progress</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                          <p className="text-xs">Estimated token amounts assigned to briefs in progress that are awaiting confirmation or project start.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="text-2xl font-bold text-black">{budgetData.tokensPending.toLocaleString()}</div>
                                    <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensPending / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                        
                        {/* View Token Transactions Button */}
                        <div className="pt-4 border-t border-[#ececec]">
                          <Button
                            variant="outline"
                            onClick={() => navigate("/dashboard/token-transactions")}
                            className="w-full border-[#e0e0e0] bg-white text-black hover:bg-[#f5f5f5]"
                          >
                            View token transactions
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                  {/* Token Distribution by Category */}
                  <Card className="border border-[#ececec] bg-white lg:col-span-3">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Token distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={tokenDistributionCategoryConfig} className="h-[300px] md:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={tokenDistributionByCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 8000]}
                              ticks={[0, 2000, 4000, 6000, 8000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="tokens" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5 mt-6">
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Historical spend per category</CardTitle>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger className="w-[120px] border-[#e0e0e0] rounded-md px-3 py-2 h-auto bg-white [&_span]:text-black [&>svg]:text-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="2023" className="text-black">2023</SelectItem>
                            <SelectItem value="2024" className="text-black">2024</SelectItem>
                            <SelectItem value="2025" className="text-black">2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={historicalSpendConfig} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={historicalSpendData[selectedYear as keyof typeof historicalSpendData]} margin={{ left: 10, right: 10, top: 10, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 5000]}
                              ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Spend (Tokens)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="spend" fill="#0177c7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Change request spend by category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={changeRequestsSpendByCategoryConfig} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={changeRequestsSpendByCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis
                              dataKey="category"
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 4000]}
                              ticks={[0, 1000, 2000, 3000, 4000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="tokens" fill={changeRequestsSpendByCategoryConfig.tokens.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Quarterly budget vs actual spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={quarterlySpendComparisonConfig} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={quarterlySpendComparisonData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
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
                              domain={[0, 11000]}
                              ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 12 }} />
                            <Bar dataKey="expected" name={quarterlySpendComparisonConfig.expected.label} fill={quarterlySpendComparisonConfig.expected.color} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" name={quarterlySpendComparisonConfig.actual.label} fill={quarterlySpendComparisonConfig.actual.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Tablet/Mobile: Vertical Stack */}
                <div className="lg:hidden space-y-6">
                  {/* Wallet Component */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet size={20} className="text-[#03b3e2]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Wallet</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 bg-[#f1f1f3] rounded-md p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBudgetView("quarter")}
                            className={`h-8 px-3 text-sm ${budgetView === "quarter" ? "bg-white text-black shadow-sm" : "text-[#646464]"}`}
                          >
                            Quarter
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBudgetView("annual")}
                            className={`h-8 px-3 text-sm ${budgetView === "annual" ? "bg-white text-black shadow-sm" : "text-[#646464]"}`}
                          >
                            Annual
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(() => {
                        const budgetData = budgetView === "quarter" ? quarterBudgetData : annualBudgetData;
                        const periodLabel = budgetView === "quarter" ? "this quarter" : "per annum";
                        
                        return (
                          <>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Total budget {periodLabel}</span>
                                <span className="text-lg font-bold text-black">{budgetData.totalBudget.toLocaleString()} tokens</span>
                              </div>
                              
                                {/* Metrics Grid - 2x2 */}
                                <div className="grid grid-cols-2 gap-4">
                                {/* Tokens spent */}
                                <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-black">Tokens spent on completed projects</span>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                        <p className="text-xs">Tokens used for completed projects. This amount reflects budget already spent.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <div className="text-2xl font-bold text-black">{budgetData.tokensSpent.toLocaleString()}</div>
                                  <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensSpent / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                </div>

                                {/* Tokens committed  */}
                                <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-black">Tokens committed to WIP projects</span>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                        <p className="text-xs">Tokens allocated to projects currently in progress. If a project is paused or stopped, unused tokens may be reinstated depending on its stage.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <div className="text-2xl font-bold text-black">{budgetData.tokensCommitted.toLocaleString()}</div>
                                  <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensCommitted / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                </div>

                                {/* Tokens remaining */}
                                <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-black">Tokens remaining in budget this quarter</span>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                        <p className="text-xs">Tokens still available in your overall budget that have not yet been used or allocated.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <div className="text-2xl font-bold text-[#03b3e2]">{budgetData.tokensRemaining.toLocaleString()}</div>
                                  <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensRemaining / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                </div>

                                {/* Tokens pending */}
                                <div className="border border-[#ececec] rounded-lg p-4 bg-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-black">Tokens pending for briefs in progress</span>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle size={16} className="text-[#646464] cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white border border-[#ececec] text-black max-w-xs">
                                        <p className="text-xs">Estimated token amounts assigned to briefs in progress that are awaiting confirmation or project start.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <div className="text-2xl font-bold text-black">{budgetData.tokensPending.toLocaleString()}</div>
                                  <div className="text-xs text-[#646464] mt-1">{((budgetData.tokensPending / budgetData.totalBudget) * 100).toFixed(1)}% of budget</div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* Token Distribution by Category */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Token distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={tokenDistributionCategoryConfig} className="h-[300px] md:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={tokenDistributionByCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 8000]}
                              ticks={[0, 2000, 4000, 6000, 8000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="tokens" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Change request spend by category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={changeRequestsSpendByCategoryConfig} className="h-[300px] md:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={changeRequestsSpendByCategoryData} margin={{ left: 10, right: 10, top: 10, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis
                              dataKey="category"
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 4000]}
                              ticks={[0, 1000, 2000, 3000, 4000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="tokens" fill={changeRequestsSpendByCategoryConfig.tokens.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Quarterly budget vs actual spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={quarterlySpendComparisonConfig} className="h-[300px] md:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={quarterlySpendComparisonData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
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
                              domain={[0, 11000]}
                              ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 12 }} />
                            <Bar dataKey="expected" name={quarterlySpendComparisonConfig.expected.label} fill={quarterlySpendComparisonConfig.expected.color} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" name={quarterlySpendComparisonConfig.actual.label} fill={quarterlySpendComparisonConfig.actual.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Historical Spend per Category */}
                  <Card className="border border-[#ececec] bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Historical spend per category</CardTitle>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger className="w-[120px] border-[#e0e0e0] rounded-md px-3 py-2 h-auto bg-white [&_span]:text-black [&>svg]:text-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="2023" className="text-black">2023</SelectItem>
                            <SelectItem value="2024" className="text-black">2024</SelectItem>
                            <SelectItem value="2025" className="text-black">2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={historicalSpendConfig} className="h-[300px] md:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={historicalSpendData[selectedYear as keyof typeof historicalSpendData]} margin={{ left: 10, right: 10, top: 10, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis 
                              dataKey="category" 
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 5000]}
                              ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Spend (Tokens)", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="spend" fill="#0177c7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TooltipProvider>
            </TabsContent>

            {/* Predictive analytics & insights Tab Content */}
            <TabsContent value="predictive-analytics" className="mt-6">
              {/* Desktop: Side-by-side layout */}
              <div className="hidden lg:block space-y-6">
                {/* Row 1: Ask TIKO */}
                <div className="grid grid-cols-1 gap-5">
                {/* Ask TIKO a question */}
                  <Card className="border border-[#ececec] bg-white rounded-xl overflow-hidden relative">
                    <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#ffb546] flex items-center justify-center flex-shrink-0">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black mb-1">Ask TIKO a question</CardTitle>
                        <p className="text-sm text-[#646464]">Get AI-powered insights on any aspect of your project data</p>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                    <div className="relative">
                      <Textarea
                        value={tikoQuestion}
                        onChange={(e) => setTikoQuestion(e.target.value)}
                        placeholder="e.g., Why are Mobile campaigns taking longer than Tablet campaigns?"
                          className="min-h-[80px] w-full bg-[#f9f9f9] border border-[#ececec] rounded-lg px-4 py-3 text-sm text-black placeholder:text-[#646464] focus:outline-none focus:ring-2 focus:ring-[#03b3e2] focus:ring-offset-2 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.ctrlKey) {
                            handleAskTiko();
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAskTiko}
                          variant="outline"
                          className="h-10 px-6 border-none bg-[#ffb546] hover:opacity-90 text-black whitespace-nowrap"
                      >
                          <span className="text-black font-semibold whitespace-nowrap">Ask TIKO</span>
                          <ChevronRight size={20} className="ml-2 text-black" />
                      </Button>
                    </div>
                    
                    {/* Example Questions and Answers */}
                    <div className="space-y-4 pt-4 border-t border-[#ececec]">
                      <p className="text-sm font-medium text-black">Example questions:</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black">Q: "Which team has the best brief quality score?"</p>
                          <p className="text-sm text-[#646464] pl-4">A: "Based on current data, Omni & Digital leads with a 95% brief quality score, followed by Marcomms at 94%. Brief quality correlates strongly with completion—complete briefs score 4.9/5 vs 3.1/5 for incomplete ones."</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black">Q: "How can we reduce change requests?"</p>
                          <p className="text-sm text-[#646464] pl-4">A: "Complete briefing templates score 4.9/5 vs 3.1/5 for incomplete briefs. Missing 'target operator' field results in 34% more change requests. Implementing mandatory field validation could reduce change requests by 65%."</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black">Q: "Which category has the highest token efficiency?"</p>
                          <p className="text-sm text-[#646464] pl-4">A: "SMP category shows the highest token efficiency at 96%, with 4,500 tokens spent across 68 briefs. This is followed by B2B at 95% efficiency. Ecosystem and Promotions categories could benefit from process optimisation."</p>
                        </div>
                      </div>
                    </div>
                    
                    {showTikoResponse && (
                      <div className="space-y-4 pt-2 border-t border-[#ececec]">
                        <p className="text-sm text-black">
                          Status of your project you can find at the{" "}
                          <button
                            onClick={() => navigate("/dashboard/projects")}
                            className="text-[#03b3e2] hover:underline font-medium"
                          >
                            Projects
                          </button>{" "}
                          page.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <p className="text-sm text-[#646464]">
                            If this doesn't answer your question fully, feel free to send your question to Admin.
                          </p>
                          <Button
                            onClick={handleSendToAdmin}
                            variant="outline"
                            className="h-10 px-6 border border-[#ececec] bg-white hover:bg-[#f9f9f9] text-black whitespace-nowrap"
                          >
                            Send to Admin
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                </div>

                {/* Row 2: Duplicate brief prevention impact */}
                <div className="grid grid-cols-10 gap-5">
                  <Card className="border border-[#ececec] bg-white col-span-6 flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Duplicate brief prevention</CardTitle>
                        <span className="text-xs font-medium text-[#03b3e2] bg-[#03b3e20f] rounded-full px-3 py-1">AI flags similar briefs before submission</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-[36px] font-bold leading-[43.2px] text-[#03b3e2]">{duplicateBriefsStats.preventedTotal}</div>
                        <p className="text-sm text-[#646464]">duplicate briefs prevented in the last 6 months</p>
                      </div>
                      <ChartContainer config={duplicateBriefsTrendConfig} className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={duplicateBriefsTrendData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#646464", fontSize: 12 }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 8]}
                              ticks={[0, 2, 4, 6, 8]}
                              tick={{ fill: "#646464", fontSize: 12 }}
                              label={{ value: "Prevented duplicates", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                            <Bar dataKey="prevented" name={duplicateBriefsTrendConfig.prevented.label} fill={duplicateBriefsTrendConfig.prevented.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#ececec] bg-white col-span-4 flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-bold leading-[21.28px] text-black">Why this matters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f9f9f9]">
                        <div className="text-[32px] font-bold leading-[38.4px] text-[#03b3e2]">{duplicateBriefsStats.tokensSaved.toLocaleString()}+</div>
                        <p className="text-sm text-[#646464]">tokens safeguarded by consolidating overlapping work</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 rounded-lg border border-[#ececec] p-3">
                          <span className="text-xs font-medium text-[#848487]">Hours saved</span>
                          <span className="text-lg font-semibold text-black">{duplicateBriefsStats.hoursSaved}+</span>
                          <span className="text-xs text-[#646464]">delivery hours redirected to live briefs</span>
                        </div>
                        <div className="flex flex-col gap-1 rounded-lg border border-[#ececec] p-3">
                          <span className="text-xs font-medium text-[#848487]">Teams collaborating</span>
                          <span className="text-lg font-semibold text-black">{duplicateBriefsStats.teamsImpacted}</span>
                          <span className="text-xs text-[#646464]">cross-team briefs merged before kickoff</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#f9f9f9] border border-[#ececec] p-3">
                        <p className="text-xs font-bold text-[#00C3B1] tracking-wide">Insight</p>
                        <p className="text-sm text-[#646464]">Clients keep an average of 1.4 additional briefs off the roadmap every month, protecting budget and campaign focus.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Tablet/Mobile: Vertical Stack */}
              <div className="lg:hidden space-y-6">
                {/* 1. Ask TIKO a question */}
                <Card className="border border-[#ececec] bg-white rounded-xl overflow-hidden relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#ffb546] flex items-center justify-center flex-shrink-0">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black mb-1">Ask TIKO a question</CardTitle>
                        <p className="text-sm text-[#646464]">Get AI-powered insights on any aspect of your project data</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-4">
                    <div className="relative">
                      <Textarea
                        value={tikoQuestion}
                        onChange={(e) => setTikoQuestion(e.target.value)}
                        placeholder="e.g., Why are Mobile campaigns taking longer than Tablet campaigns?"
                        className="min-h-[80px] w-full bg-[#f9f9f9] border border-[#ececec] rounded-lg px-4 py-3 text-sm text-black placeholder:text-[#646464] focus:outline-none focus:ring-2 focus:ring-[#03b3e2] focus:ring-offset-2 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.ctrlKey) {
                            handleAskTiko();
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAskTiko}
                        variant="outline"
                        className="h-10 px-6 border-none bg-[#ffb546] hover:opacity-90 text-black whitespace-nowrap"
                      >
                        <span className="text-black font-semibold whitespace-nowrap">Ask TIKO</span>
                        <ChevronRight size={20} className="ml-2 text-black" />
                      </Button>
                    </div>
                    
                    {/* Example Questions and Answers */}
                    <div className="space-y-4 pt-4 border-t border-[#ececec]">
                      <p className="text-sm font-medium text-black">Example questions:</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black">Q: "Which team has the best brief quality score?"</p>
                          <p className="text-sm text-[#646464] pl-4">A: "Based on current data, Omni & Digital leads with a 95% brief quality score, followed by Marcomms at 94%. Brief quality correlates strongly with completion—complete briefs score 4.9/5 vs 3.1/5 for incomplete ones."</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black">Q: "How can we reduce change requests?"</p>
                          <p className="text-sm text-[#646464] pl-4">A: "Complete briefing templates score 4.9/5 vs 3.1/5 for incomplete briefs. Missing 'target operator' field results in 34% more change requests. Implementing mandatory field validation could reduce change requests by 65%."</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-black">Q: "Which category has the highest token efficiency?"</p>
                          <p className="text-sm text-[#646464] pl-4">A: "SMP category shows the highest token efficiency at 96%, with 4,500 tokens spent across 68 briefs. This is followed by B2B at 95% efficiency. Ecosystem and Promotions categories could benefit from process optimisation."</p>
                        </div>
                      </div>
                    </div>
                    
                    {showTikoResponse && (
                      <div className="space-y-4 pt-2 border-t border-[#ececec]">
                        <p className="text-sm text-black">
                          Status of your project you can find at the{" "}
                          <button
                            onClick={() => navigate("/dashboard/projects")}
                            className="text-[#03b3e2] hover:underline font-medium"
                          >
                            Projects
                          </button>{" "}
                          page.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <p className="text-sm text-[#646464]">
                            If this doesn't answer your question fully, feel free to send your question to Admin.
                          </p>
                          <Button
                            onClick={handleSendToAdmin}
                            variant="outline"
                            className="h-10 px-6 border border-[#ececec] bg-white hover:bg-[#f9f9f9] text-black whitespace-nowrap"
                          >
                            Send to Admin
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Duplicate brief prevention */}
                <Card className="border border-[#ececec] bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#03b3e2] flex items-center justify-center text-white text-lg font-bold">AI</div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Duplicate brief prevention</CardTitle>
                        <p className="text-sm text-[#646464]">We notify teams when a similar brief already exists so they can consolidate work before kick-off.</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[36px] font-bold leading-[43.2px] text-[#03b3e2]">{duplicateBriefsStats.preventedTotal}</span>
                      <span className="text-sm text-[#646464]">duplicates prevented in the last 6 months</span>
                    </div>
                    <ChartContainer config={duplicateBriefsTrendConfig} className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={duplicateBriefsTrendData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 8]}
                            ticks={[0, 2, 4, 6, 8]}
                            tick={{ fill: "#646464", fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                          <Bar dataKey="prevented" name={duplicateBriefsTrendConfig.prevented.label} fill={duplicateBriefsTrendConfig.prevented.color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col gap-1 rounded-lg border border-[#ececec] p-3">
                        <span className="text-xs font-medium text-[#848487]">Tokens safeguarded</span>
                        <span className="text-lg font-semibold text-black">{duplicateBriefsStats.tokensSaved.toLocaleString()}+</span>
                        <span className="text-xs text-[#646464]">redirected to priority deliverables</span>
                      </div>
                      <div className="flex flex-col gap-1 rounded-lg border border-[#ececec] p-3">
                        <span className="text-xs font-medium text-[#848487]">Hours saved</span>
                        <span className="text-lg font-semibold text-black">{duplicateBriefsStats.hoursSaved}+</span>
                        <span className="text-xs text-[#646464]">delivery time protected across {duplicateBriefsStats.teamsImpacted} teams</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#f9f9f9] border border-[#ececec] p-3">
                      <p className="text-xs font-bold text-[#00C3B1] tracking-wide">Insight</p>
                      <p className="text-sm text-[#646464]">AI alerts are saving an estimated 180 hours of rework and keep budgets focused on live priorities.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>                {/* Optimization Opportunities */}
              <div className="space-y-4 pt-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[22px] font-bold leading-[29.26px] text-black">Optimisation opportunities</h3>
                    <p className="text-sm text-[#646464]">Data-driven insights for performance improvement, budget optimisation, and process enhancement</p>
                  </div>
                {/* Desktop: 3 columns inline */}
                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
                  {/* 1. Performance driver */}
                    <Card className="border border-[#ececec] bg-white flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Target size={20} className="text-[#03b3e2]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Performance driver</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col">
                        <p className="text-sm text-black leading-[18.62px]">
                          Complete briefing templates score 4.9/5 vs 3.1/5 for incomplete briefs. Missing "target operator" field = 34% more change requests.
                        </p>
                        <div className="flex-1 flex flex-col">
                          <ChartContainer config={performanceDriverConfig} className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={performanceDriverData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                <XAxis 
                                  dataKey="category" 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: "#646464", fontSize: 12 }}
                                />
                                <YAxis 
                                  axisLine={false}
                                  tickLine={false}
                                  domain={[0, 28]}
                                  ticks={[0, 7, 14, 21, 28]}
                                  tick={{ fill: "#646464", fontSize: 12 }}
                                />
                                <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                                <Legend />
                                <Bar dataKey="satisfaction" fill="#0177c7" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="changeRequests" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Key Driver</p>
                          <p className="text-xs text-black">Implement mandatory field validation. Projected: 65% fewer change requests.</p>
                        </div>
                      </CardContent>
                    </Card>

                  {/* 2. Budget risk alert */}
                    <Card className="border border-[#ececec] bg-white flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={20} className="text-[#8092DC]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Budget risk alert</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col">
                        <p className="text-sm text-black leading-[18.62px]">
                          Mobile division tracking 97% token utilization with 23% Q4 overrun risk. Current token usage vs. allocated tokens shows escalating variance.
                        </p>
                        <div className="flex-1 flex flex-col">
                          <ChartContainer config={budgetRiskConfig} className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={budgetRiskData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                <XAxis 
                                  dataKey="month" 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: "#646464", fontSize: 12 }}
                                />
                                <YAxis 
                                  axisLine={false}
                                  tickLine={false}
                                  domain={[700, 1300]}
                                  ticks={[800, 950, 1100, 1250]}
                                  tick={{ fill: "#646464", fontSize: 12 }}
                                  label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                                />
                                <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="tokensUsed" 
                                  stroke="#0177c7" 
                                  strokeWidth={2} 
                                  dot={{ fill: "#0177c7", r: 4 }}
                                  name="Tokens used"
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="tokensAllocated" 
                                  stroke="#03b3e2" 
                                  strokeWidth={2} 
                                  strokeDasharray="5 5"
                                  dot={{ fill: "#03b3e2", r: 4 }}
                                  name="Tokens allocated"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Mitigation</p>
                          <p className="text-xs text-black">Expedite HQ asset prioritization. Implement bi-weekly delivery checkpoints.</p>
                        </div>
                      </CardContent>
                    </Card>

                  {/* 3. Process optimization */}
                    <Card className="border border-[#ececec] bg-white flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#00C3B1]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Process optimisation</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col">
                        <p className="text-sm text-black leading-[18.62px]">
                          JFDI: 35% faster, 0.9 lower satisfaction. Creative: highest satisfaction, 3x longer.
                        </p>
                        <div className="flex-1 flex flex-col">
                          <ChartContainer config={processOptimizationConfig} className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={processOptimizationData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                <XAxis 
                                  dataKey="method" 
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: "#646464", fontSize: 12 }}
                                />
                                <YAxis 
                                  axisLine={false}
                                  tickLine={false}
                                  domain={[0, 12]}
                                  ticks={[0, 3, 6, 9, 12]}
                                  tick={{ fill: "#646464", fontSize: 12 }}
                                />
                                <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                                <Legend />
                                <Bar dataKey="days" fill="#0177c7" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="satisfaction" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Opportunity</p>
                          <p className="text-xs text-black">Create hybrid approach: JFDI execution with creative consultation checkpoints.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                {/* Tablet/Mobile: Vertical Stack */}
                <div className="lg:hidden space-y-5">
                  {/* 1. Performance driver */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Target size={20} className="text-[#03b3e2]" />
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Performance driver</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-black leading-[18.62px]">
                          Complete briefing templates score 4.9/5 vs 3.1/5 for incomplete briefs. Missing "target operator" field = 34% more change requests.
                        </p>
                        <ChartContainer config={performanceDriverConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceDriverData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                              <XAxis 
                                dataKey="category" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 28]}
                                ticks={[0, 7, 14, 21, 28]}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                              <Legend />
                              <Bar dataKey="satisfaction" fill="#0177c7" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="changeRequests" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Key Driver</p>
                          <p className="text-xs text-black">Implement mandatory field validation. Projected: 65% fewer change requests.</p>
                        </div>
                      </CardContent>
                    </Card>

                  {/* 2. Budget risk alert */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={20} className="text-[#8092DC]" />
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Budget risk alert</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-black leading-[18.62px]">
                          Mobile division tracking 97% token utilization with 23% Q4 overrun risk. Current token usage vs. allocated tokens shows escalating variance.
                        </p>
                        <ChartContainer config={budgetRiskConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={budgetRiskData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                              <XAxis 
                                dataKey="month" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                domain={[700, 1300]}
                                ticks={[800, 950, 1100, 1250]}
                                tick={{ fill: "#646464", fontSize: 12 }}
                                label={{ value: "Tokens", angle: -90, position: "insideLeft", offset: 15, style: { fill: "#646464", fontSize: 12, textAnchor: "middle" } }}
                              />
                              <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="tokensUsed" 
                                stroke="#0177c7" 
                                strokeWidth={2} 
                                dot={{ fill: "#0177c7", r: 4 }}
                                name="Tokens used"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="tokensAllocated" 
                                stroke="#03b3e2" 
                                strokeWidth={2} 
                                strokeDasharray="5 5"
                                dot={{ fill: "#03b3e2", r: 4 }}
                                name="Tokens allocated"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Mitigation</p>
                          <p className="text-xs text-black">Expedite HQ asset prioritization. Implement bi-weekly delivery checkpoints.</p>
                        </div>
                      </CardContent>
                    </Card>

                  {/* 3. Process optimization */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#00C3B1]" />
                        <CardTitle className="text-base font-bold leading-[21.28px] text-black">Process optimisation</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-black leading-[18.62px]">
                          JFDI: 35% faster, 0.9 lower satisfaction. Creative: highest satisfaction, 3x longer.
                        </p>
                        <ChartContainer config={processOptimizationConfig} className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processOptimizationData} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                              <XAxis 
                                dataKey="method" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 12]}
                                ticks={[0, 3, 6, 9, 12]}
                                tick={{ fill: "#646464", fontSize: 12 }}
                              />
                              <ChartTooltip content={<ChartTooltipContent className="bg-white [&_span]:text-black [&_div]:text-black" />} />
                              <Legend />
                              <Bar dataKey="days" fill="#0177c7" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="satisfaction" fill="#03b3e2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Opportunity</p>
                          <p className="text-xs text-black">Create hybrid approach: JFDI execution with creative consultation checkpoints.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Predictive Insights */}
              <div className="space-y-4 pt-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[22px] font-bold leading-[29.26px] text-black">Predictive insights</h3>
                    <p className="text-sm text-[#646464]">AI-powered forecasting and trend predictions based on current data patterns.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Top-Left: Process efficiency gains */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={20} className="text-[#00C3B1]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Process efficiency gains</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-black leading-[18.62px] font-medium">
                          Streamline workflows to reduce delivery time by 32%.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Current average timeline</span>
                            <span className="text-sm font-bold text-black">14.2 days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Optimised timeline</span>
                            <span className="text-sm font-bold text-black">9.6 days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Time saved</span>
                            <span className="text-sm font-bold text-[#00C3B1]">4.6 days (32%)</span>
                          </div>
                        </div>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Action required</p>
                          <p className="text-xs text-black">Implement automated brief validation and parallel approval workflows. Est. ROI: 340% within 6 months.</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top-Right: Budget optimization */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <PoundSterling size={20} className="text-[#ff9800]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Budget optimisation</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-black leading-[18.62px] font-medium">
                          Reallocate token spend to achieve 23% cost efficiency improvement.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Over-allocated divisions</span>
                            <span className="text-sm font-bold text-black">3 divisions</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Under-utilized tokens</span>
                            <span className="text-sm font-bold text-black">2,400 tokens</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Potential savings</span>
                            <span className="text-sm font-bold text-[#00C3B1]">£1.4M annual</span>
                          </div>
                        </div>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Action required</p>
                          <p className="text-xs text-black">Redistribute 1,200 tokens from Mobile to Wearable division. Implement quarterly budget reviews.</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bottom-Left: Quality enhancement */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={20} className="text-[#03b3e2]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Quality enhancement</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-black leading-[18.62px] font-medium">
                          Elevate first-round approval rate from 78% to 94% target.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Current approval rate</span>
                            <span className="text-sm font-bold text-black">78%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Target approval rate</span>
                            <span className="text-sm font-bold text-black">94%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Quality improvement</span>
                            <span className="text-sm font-bold text-[#00C3B1]">+16 points</span>
                          </div>
                        </div>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Action required</p>
                          <p className="text-xs text-black">Mandatory brief completeness checks and creative review checkpoints for all Strategic briefs.</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bottom-Right: Resource allocation */}
                    <Card className="border border-[#ececec] bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Menu size={20} className="text-[#8092DC]" />
                          <CardTitle className="text-base font-bold leading-[21.28px] text-black">Resource allocation</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-black leading-[18.62px] font-medium">
                          Optimise team allocation to handle 5% increased brief volume.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Current capacity</span>
                            <span className="text-sm font-bold text-black">214 briefs/month</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Projected demand</span>
                            <span className="text-sm font-bold text-black">225 briefs/month</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-black">Capacity gap</span>
                            <span className="text-sm font-bold text-[#8092DC]">11 briefs (5%)</span>
                          </div>
                        </div>
                        <div className="border border-[#00C3B1] rounded-lg bg-[#00C3B10F] p-3">
                          <p className="text-xs font-bold text-[#00C3B1] mb-1">Action required</p>
                          <p className="text-xs text-black">Cross-train 3 team members across categorys. Optimise scheduling for peak periods.</p>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Send Question to Admin Modal */}
      <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <DialogContent className="bg-white border border-[#ececec] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold leading-[21.28px] text-black">Send Question to Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-black mb-2 block">Your Question</label>
              <Textarea
                value={adminQuestion}
                onChange={(e) => setAdminQuestion(e.target.value)}
                placeholder="Enter your question..."
                className="min-h-[100px] w-full bg-[#f9f9f9] border border-[#ececec] rounded-lg px-4 py-3 text-sm text-black placeholder:text-[#646464] focus:outline-none focus:ring-2 focus:ring-[#03b3e2] focus:ring-offset-2 resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowAdminModal(false);
                setAdminQuestion("");
              }}
              className="h-10 px-6 border border-[#ececec] bg-white hover:bg-[#f9f9f9] text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAdminQuestion}
              variant="outline"
              className="h-10 px-6 border-none bg-[#ffb546] hover:opacity-90 text-black"
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}


