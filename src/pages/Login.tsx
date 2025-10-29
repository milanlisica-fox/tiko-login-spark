import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import TikoLogo from "@/components/TikoLogo";
import { motion } from "framer-motion";

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
    setTimeout(() => {
      toast.success("Welcome back!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      initial={{ backgroundColor: "hsl(0, 0%, 0%)" }}
      animate={{ backgroundColor: "hsl(var(--primary))" }}
      transition={{ delay: 2, duration: 1 }}
    >
      <div className="w-full max-w-7xl relative">
        <motion.div 
          className="bg-card rounded-[5rem] shadow-2xl p-8 md:p-16 relative overflow-hidden"
          initial={{ 
            width: "100vw",
            height: "100vh",
            borderRadius: "0rem",
            position: "fixed",
            top: 0,
            left: 0,
          }}
          animate={{ 
            width: "100%",
            height: "auto",
            borderRadius: "5rem",
            position: "relative",
            top: "auto",
            left: "auto",
          }}
          transition={{ delay: 2, duration: 1, ease: "easeInOut" }}
        >
          {/* Irregular shape effect */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-card-foreground/5 rounded-full blur-3xl" />
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          
          <motion.div 
            className="relative z-10 grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Left side - Logo and tagline */}
            <div className="flex items-center justify-center">
              <TikoLogo />
            </div>

            {/* Right side - Login form */}
            <div className="flex flex-col justify-center max-w-md mx-auto w-full">
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

                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 3.2,
                    duration: 0.6,
                    repeat: 1,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Login
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </motion.div>

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
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
