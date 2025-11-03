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
import SOW from "./pages/SOW";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/briefs" element={<Briefs />} />
          <Route path="/dashboard/briefs/review" element={<BriefReview />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/tracker" element={<Tracker />} />
          <Route path="/dashboard/calculator" element={<Calculator />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/dashboard/sow" element={<SOW />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
