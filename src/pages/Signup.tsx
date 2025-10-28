import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import TikoLogo from "@/components/TikoLogo";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate signup
    setTimeout(() => {
      toast.success("Account created successfully!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-7xl relative">
        {/* Organic shape container */}
        <div className="bg-card rounded-[5rem] shadow-2xl p-8 md:p-16 relative overflow-hidden">
          {/* Irregular shape effect */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-card-foreground/5 rounded-full blur-3xl" />
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Logo and tagline */}
            <div className="flex items-center justify-center">
              <TikoLogo />
            </div>

            {/* Right side - Signup form */}
            <div className="flex flex-col justify-center max-w-md mx-auto w-full">
              <h1 className="text-5xl font-bold text-card-foreground mb-8">
                Join TIKO!
              </h1>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-14 rounded-full bg-input text-secondary px-6 text-base border-0 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-14 rounded-full bg-input text-secondary px-6 text-base border-0 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
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

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-14 rounded-full bg-input text-secondary px-6 pr-12 text-base border-0 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Sign up
                  <ArrowRight className="ml-2" size={20} />
                </Button>

                <p className="text-center text-card-foreground/70 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="text-card-foreground font-semibold hover:text-accent transition-colors"
                  >
                    Login
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

export default Signup;
