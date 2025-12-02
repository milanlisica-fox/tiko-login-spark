import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Briefs from "./pages/Briefs";
import Projects from "./pages/Projects";
import Tracker from "./pages/Tracker";
import Calculator from "./pages/Calculator";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import BriefReview from "./pages/BriefReview";
import BriefSingle from "./pages/BriefSingle";
import SOW from "./pages/SOW";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <>
    <svg
      className="login-arrow hidden md:block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1680.59 423.25"
      aria-hidden="true"
    >
      <path d="M1459.13,423.25H60.74c-33.55,0-60.74-27.19-60.74-60.74v-25.11c0-13.64,8.31-25.9,20.98-30.96l135-64.13c27.89-11.12,28.01-50.56.18-61.84L20.8,115.12C8.23,110.02,0,97.81,0,84.24v-23.5C0,27.19,27.19,0,60.74,0h1398.39c13.23,0,26.09,4.32,36.64,12.29l160.72,150.88c32.14,24.3,32.14,72.59,0,96.89l-160.72,150.88c-10.55,7.98-23.41,12.29-36.64,12.29Z" />
    </svg>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/briefs" element={<Briefs />} />
          <Route path="/dashboard/briefs/:id" element={<BriefSingle />} />
          <Route path="/dashboard/briefs/review" element={<BriefReview />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/tracker" element={<Tracker />} />
          <Route path="/dashboard/calculator" element={<Calculator />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/dashboard/sow" element={<SOW />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
