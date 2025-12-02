import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { triggerArrow, finishArrow } from "@/lib/animations";
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

    try {
      await triggerArrow();
      toast.success("Welcome back!");
      navigate("/dashboard");
      await finishArrow();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout svgAnimationClass="animate-scale2">
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
            className="login-btn w-full h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all animate-gentle-bounce flex items-center justify-center gap-[10px]"
          >
            <span>Login</span>
            <svg
              className="h-[14px] w-[15.567px]"
              width="45"
              height="40"
              viewBox="0 0 45 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.8229 40H5.80935C2.59694 40 0 37.4332 0 34.2582V31.8843C0 30.5935 0.795591 29.4362 2.0115 28.9614L14.9212 22.908C17.5932 21.8546 17.5932 18.1306 14.9362 17.0623L1.99648 10.8902C0.795576 10.4154 0 9.25816 0 7.96736V5.74184C0 2.56677 2.59694 0 5.80935 0H23.8229C25.0838 0 26.3147 0.400603 27.3205 1.15728L42.692 15.4154C45.7693 17.7151 45.7693 22.27 42.692 24.5697L27.3205 38.8279C26.3147 39.5846 25.0838 39.9852 23.8229 39.9852V40Z"
                fill="#000"
              ></path>
            </svg>
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
