import React from "react";
import TikoLogo from "@/components/TikoLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  svgAnimationClass?: string;
}

export default function AuthLayout({ 
  children, 
  svgAnimationClass = "animate-scale",
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      
      <svg 
        className={`${svgAnimationClass}`} 
        xmlns="http://www.w3.org/2000/svg" 
        width="1206" 
        height="739" 
        viewBox="0 0 1206 739" 
        fill="none" 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transition: "0.6s ease",
          transform: "translate(-50%, -44%) scale(3)",
          pointerEvents: "none",
        }}
      >
        <path d="M8.17 435.09L387.35 727.98C394.62 736.09 405.52 739.94 416.27 738.21L1178.69 625.53C1194.24 623.02 1205.65 609.57 1205.59 593.82L1203.99 199.33C1203.94 185.43 1194.92 173.15 1181.67 168.95L916.14 54.71C914.65 54.24 913.13 53.88 911.59 53.63L274.46 0.41C272.76 0.13 271.05 0 269.33 0H32C14.33 0 0 14.33 0 32V413.73C0 421.61 2.91 429.22 8.17 435.09Z" fill="black"/>
      </svg>
      
      <div className="w-full max-w-7xl relative">
        <div className="p-4 md:p-8 lg:p-16 relative overflow-hidden">
          {/* Irregular shape effect */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-card-foreground/5 rounded-full blur-3xl hidden md:block" />
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl hidden md:block" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Logo */}
            <div className="flex items-center justify-start animate-fade-up-left tiko-logo">
              <TikoLogo />
            </div>

            {/* Right side - Form content */}
            <div className="flex flex-col justify-center max-w-md mx-auto w-full animate-fade-up">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

