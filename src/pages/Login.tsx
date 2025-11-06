import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { triggerArrow } from "@/lib/animations";
import { isValidEmail } from "@/lib/validation";
import AuthLayout from "@/components/layout/AuthLayout";
import { StyledInput } from "@/components/common/StyledInput";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password !== "admin123") {
      setErrorMessage("Password is incorect");
      setPassword("");
      return;
    }

    setIsLoading(true);
    // Simulate login
    triggerArrow();
    setTimeout(() => {
      toast.success("Welcome back!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <AuthLayout showArrow={true} svgAnimationClass="animate-scale2">
      <h1 className="h1-heading text-5xl font-bold text-card-foreground mb-8">
        Welcome back!
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <StyledInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="login"
          />
        </div>

        <div className="relative">
          <StyledInput
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="login"
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-card-foreground/70 hover:text-card-foreground transition-colors"
          >
            Forgot password?
          </Link>
        </div> */}

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="login-btn w-full h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all animate-gentle-bounce"
          >
            Login
            <img src="https://www.figma.com/api/mcp/asset/33c5c1d3-721c-423d-8e72-cd89fd07637c" alt="" className="h-[14px] w-[15.567px]"/>
          </Button>
          <div className="h-14">
            <div
              className={`flex h-14 w-full items-center justify-center rounded-full bg-[#ff4337] px-6 font-semibold text-lg text-white transition-all duration-200 ${errorMessage ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {errorMessage}
            </div>
          </div>
        </div>
        {/* 
        <p className="text-center text-card-foreground/70 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-card-foreground font-semibold hover:text-accent transition-colors"
          >
            Sign up
          </Link>
        </p> */}
      </form>
    </AuthLayout>
  );
};

export default Login;
