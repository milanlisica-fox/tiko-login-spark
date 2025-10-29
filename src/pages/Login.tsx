import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }
    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="flex w-[90%] max-w-5xl bg-secondary text-foreground rounded-[40px] shadow-2xl overflow-hidden">
        {/* Left side */}
        <div className="flex flex-col justify-center items-center w-1/2 bg-secondary p-10">
          <div className="flex flex-col items-center">
            <div className="bg-primary p-6 rounded-xl text-secondary-foreground font-bold text-3xl text-center">
              <p className="text-2xl font-semibold text-left text-secondary-foreground mb-2">
                Samsung
              </p>
              <p className="text-accent text-5xl font-bold leading-tight">
                TIKO
              </p>
              <p className="text-xs mt-2 text-secondary-foreground font-normal">
                Powered by Iris • Open • Suite
              </p>
            </div>
            <p className="text-accent text-xl mt-8 font-medium text-center">
              Your ticket to effortless momentum
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-center w-1/2 bg-secondary p-12">
          <h2 className="text-3xl font-bold mb-6">Welcome back!</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full px-4 py-3 bg-input text-secondary outline-none"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full px-4 py-3 bg-input text-secondary outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 cursor-pointer text-muted"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <div className="text-right text-sm text-muted-foreground">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground font-bold rounded-full py-3 hover:bg-accent/90 transition-all"
            >
              Login →
            </button>

            <p className="text-center text-sm mt-3 text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-foreground hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
