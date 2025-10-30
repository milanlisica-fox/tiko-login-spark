import React from "react";

type StatCardProps = {
  title: string;
  subtitle?: string;
  value: string | number;
  barPercent?: number; // 0-100
  barColor?: string; // hex or tailwind class
  className?: string;
  titleBold?: boolean;
};

export default function StatCard({ title, subtitle, value, barPercent, barColor = "#03b3e2", className = "", titleBold = false }: StatCardProps) {
  return (
    <div className={`card-base radius-xl p-section flex flex-col justify-center ${className}`}>
      <div className="flex flex-col gap-3">
        <h3 className={`text-base leading-[24px] text-black ${titleBold ? 'font-bold' : 'font-normal'}`}>{title}</h3>
        {subtitle ? <p className="text-sm leading-[18.62px] text-[#646464]">{subtitle}</p> : null}
        <p className="text-[32px] leading-[38.4px] font-bold text-black">{value}</p>
        {typeof barPercent === "number" && (
          <div className="relative h-3 w-full bg-[#f1f1f3] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(100, barPercent))}%`, backgroundColor: barColor }} />
          </div>
        )}
      </div>
    </div>
  );
}


