import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { triggerConfetti } from "@/lib/animations";
import { isValidEmail } from "@/lib/validation";
import AuthLayout from "@/components/layout/AuthLayout";
import { StyledInput } from "@/components/common/StyledInput";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [teamDepartment, setTeamDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !teamDepartment || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate signup
    triggerConfetti();
    setTimeout(() => {
      toast.success("Welcome to TIKO!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <AuthLayout showArrow={false} svgAnimationClass="animate-scale">
      {/* Frame 596 - Header Section */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="h1-heading text-[38px] font-bold leading-[46px] text-card-foreground mb-1 text-left w-full">
          Welcome to TIKO!
        </h1>
        <div className="flex flex-col w-full px-1 py-1">
          <p className="text-sm leading-[17px] text-card-foreground/70 text-left">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-bold text-card-foreground/70 hover:text-card-foreground transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Frame 428 - Form Section */}
      <div className="flex flex-col space-y-6">
        {/* Frame 432 - Input Fields Container */}
        <div className="flex flex-col space-y-3">
          {/* Frame 597 - First Name and Last Name side by side */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="relative">
                <StyledInput
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  variant="signup"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <StyledInput
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  variant="signup"
                />
              </div>
            </div>
          </div>

          {/* Team / Department */}
          <div className="relative">
            <StyledInput
              type="text"
              placeholder="Team / Department"
              value={teamDepartment}
              onChange={(e) => setTeamDepartment(e.target.value)}
              variant="signup"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <StyledInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="signup"
            />
          </div>

          {/* Frame 430 - Password with Eye Icon */}
          <div className="relative">
            <StyledInput
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="signup"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#848487] hover:text-secondary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Frame 454 - Button and Terms Section */}
        <div className="flex flex-col space-y-2">
          {/* Create Account Button */}
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSignup}
            className="w-full h-12 rounded-[28px] bg-[#ffb546] hover:bg-[#ffb546]/90 text-black font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Create account
            <ArrowRight className="ml-4" size={16} />
          </Button>

          {/* Frame 430 - Terms and Privacy Policy */}
          <div className="flex justify-center px-1 py-1">
            <p className="text-center text-[#eaeaea] text-sm leading-6">
              By continuing, you are agreeing to TIKO's{" "}
              <Link
                to="/terms"
                className="text-[#eaeaea] font-semibold hover:text-accent transition-colors underline"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-[#eaeaea] font-semibold hover:text-accent transition-colors underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Frame 3 - "Or register with" text */}
      <div className="flex justify-center my-6">
        <span 
          className="text-center text-[#eaeaea] font-normal text-sm leading-6"
          style={{ fontFamily: 'SamsungOne, sans-serif' }}
        >
          Or register with
        </span>
      </div>

      {/* Frame 455 - Social Login Buttons */}
      <div className="flex flex-col space-y-2">
        {/* Frame 31 - Social Buttons Container */}
        <div className="flex flex-col space-y-4">
          {/* Google Button */}
          <div className="w-full">
            <button
              style={{backgroundColor: 'transparent'}}
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="relative w-full h-12 rounded-[40px] bg-white border border-white flex items-center justify-center space-x-4 hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fa2547d0-1e39-4ba0-96d7-fecf4702854c"
                alt="Google"
                className="absolute left-[166px] top-4 w-4 h-[17px]"
              />
              <span 
                className="text-[#fcfcff] font-semibold text-sm leading-6"
                style={{ fontFamily: 'SamsungOne, sans-serif' }}
              >
                Google
              </span>
            </button>
          </div>

          {/* Facebook Button */}
          <div className="w-full">
            <button
             style={{backgroundColor: 'transparent'}}
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="relative w-full h-12 rounded-[40px] bg-white border border-white flex items-center justify-center space-x-4 hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9575eb73-6614-49b3-a714-3394ddb57f3b"
                alt="Facebook"
                className="absolute left-[162px] top-[15px] w-[9px] h-[18px]"
              />
              <span 
                className="text-[#fcfcff] font-semibold text-sm leading-6"
                style={{ fontFamily: 'SamsungOne, sans-serif' }}
              >
                Facebook
              </span>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
