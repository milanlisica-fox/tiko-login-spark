import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import TikoLogo from "@/components/TikoLogo";
import confetti from "canvas-confetti";

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  const triggerConfetti = () => {
    // Create a burst of confetti from multiple angles
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#00D4FF', '#FFB800', '#1C1C1C', '#FFFFFF'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
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

            {/* Right side - Signup form */}
            <div className="flex flex-col justify-center max-w-md mx-auto w-full animate-fade-up">
              {/* Frame 596 - Header Section */}
              <div className="flex flex-col items-center mb-8">
                <h1 className="text-[38px] font-bold leading-[46px] text-card-foreground mb-1 text-left w-full">
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
                        <Input
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-12 rounded-[28px] bg-white text-[#848487] px-6 text-sm border-0 focus-visible:ring-2 focus-visible:ring-accent placeholder:text-[#848487]"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-12 rounded-[28px] bg-white text-[#848487] px-6 text-sm border-0 focus-visible:ring-2 focus-visible:ring-accent placeholder:text-[#848487]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team / Department */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Team / Department"
                      value={teamDepartment}
                      onChange={(e) => setTeamDepartment(e.target.value)}
                      className="h-12 rounded-[28px] bg-white text-[#848487] px-6 text-sm border-0 focus-visible:ring-2 focus-visible:ring-accent placeholder:text-[#848487]"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-[28px] bg-white text-[#848487] px-6 text-sm border-0 focus-visible:ring-2 focus-visible:ring-accent placeholder:text-[#848487]"
                    />
                  </div>

                  {/* Frame 430 - Password with Eye Icon */}
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-[28px] bg-white text-[#848487] px-6 pr-12 text-sm border-0 focus-visible:ring-2 focus-visible:ring-accent placeholder:text-[#848487]"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;