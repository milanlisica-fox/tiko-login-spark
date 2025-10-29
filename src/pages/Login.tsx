import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import TikoLogo from "@/components/TikoLogo";
import confetti from "canvas-confetti";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate login
    triggerConfetti();
    setTimeout(() => {
      toast.success("Welcome back!");
      navigate("/dashboard");
      setIsLoading(false);
    
    }, 1000);
  };

  const triggerConfetti = () => {
      // Create a burst of confetti from multiple angles
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#00D4FF', '#FFB800', '#1C1C1C', '#FFFFFF'],
      };
  
      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }
  
      // Fire confetti in multiple bursts for a more dramatic effect
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
  
      fire(0.2, {
        spread: 60,
      });
  
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
  
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
  
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <svg className="animate-scale" xmlns="http://www.w3.org/2000/svg" width="1206" height="739" viewBox="0 0 1206 739" fill="none" style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transition: "0.6s ease",
    transform: "translate(-50%, -44%) scale(3)",
  }}>
       <path d="M8.17 435.09L387.35 727.98C394.62 736.09 405.52 739.94 416.27 738.21L1178.69 625.53C1194.24 623.02 1205.65 609.57 1205.59 593.82L1203.99 199.33C1203.94 185.43 1194.92 173.15 1181.67 168.95L916.14 54.71C914.65 54.24 913.13 53.88 911.59 53.63L274.46 0.41C272.76 0.13 271.05 0 269.33 0H32C14.33 0 0 14.33 0 32V413.73C0 421.61 2.91 429.22 8.17 435.09Z" fill="black"/>
      </svg>
      <div className="w-full max-w-7xl relative">
        {/* Organic shape container */}
        <div className="p-8 md:p-16 relative overflow-hidden">
          {/* Irregular shape effect */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-card-foreground/5 rounded-full blur-3xl" />
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Logo and tagline */}
            <div className="flex items-center justify-center animate-fade-up-left">
              <TikoLogo />
            </div>

            {/* Right side - Login form */}
            <div className="flex flex-col justify-center max-w-md mx-auto w-full animate-fade-up">
              <h1 className="text-5xl font-bold text-card-foreground mb-8">
                Welcome back!
              </h1>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-full bg-input text-secondary px-6 text-base border-0 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-full bg-input text-secondary px-6 pr-12 text-base border-0 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-card-foreground/70 hover:text-card-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all animate-gentle-bounce"
                >
                  Login
                  <ArrowRight className="ml-2" size={20} />
                </Button>

                <p className="text-center text-card-foreground/70 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-card-foreground font-semibold hover:text-accent transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
