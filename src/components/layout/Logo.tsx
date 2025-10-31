import React from "react";
import { BRAND } from "@/constants/branding";

type LogoProps = {
  variant?: "sidebar" | "full";
  logoSrc?: string;
  logoDotSrc?: string;
  className?: string;
};

export default function Logo({ variant = "sidebar", logoSrc, logoDotSrc, className = "" }: LogoProps) {
  const resolvedLogoSrc = logoSrc ?? BRAND.logo;
  const resolvedLogoDotSrc = logoDotSrc ?? BRAND.logoDot;
  if (variant === "sidebar") {
    return (
      <a className={`main-logo flex items-center gap-1.5 ${className} lg:pl-0 pl-0`} href="/dashboard">
        <img src={resolvedLogoSrc} alt="TIKO" className="h-8" />
        {resolvedLogoDotSrc ? <img src={resolvedLogoDotSrc} alt="" className="w-[14.6px] h-[14.6px]" /> : null}
      </a>
    );
  }

  return (
    <div className={`flex items-end ${className}`}>
      <img src={resolvedLogoSrc} alt="TIKO" className="h-8" />
      {resolvedLogoDotSrc ? <img src={resolvedLogoDotSrc} alt="" className="w-[14.6px] h-[14.6px] ml-1" /> : null}
    </div>
  );
}


