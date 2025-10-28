import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">TIKO Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-full border-foreground/20 text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-card-foreground mb-2">Welcome to TIKO</h3>
            <p className="text-card-foreground/70">Your ticket to effortless momentum</p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-xl">
            <div className="text-accent text-4xl font-bold mb-2">0</div>
            <p className="text-card-foreground/70">Active Tasks</p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-xl">
            <div className="text-accent text-4xl font-bold mb-2">100%</div>
            <p className="text-card-foreground/70">Efficiency</p>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Getting Started</h2>
          <p className="text-card-foreground/70 mb-4">
            Start building your momentum with TIKO. Track your progress, manage your tasks, and achieve your goals effortlessly.
          </p>
          <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
