import React from "react";

interface BarData {
  value: number;
  color: string;
  label: string;
}

interface LegendItem {
  color: string;
  label: string;
}

interface HorizontalBarChartProps {
  title: string;
  bars: BarData[];
  legend: LegendItem[];
  totalText?: string;
  barHeight?: number;
  minWidth?: number;
  className?: string;
}

export default function HorizontalBarChart({
  title,
  bars,
  legend,
  totalText,
  barHeight = 65,
  minWidth = 40,
  className = "",
}: HorizontalBarChartProps) {
  const totalValue = bars.reduce((sum, bar) => sum + bar.value, 0);

  // Calculate flex ratios based on values
  const maxValue = Math.max(...bars.map(b => b.value));
  const flexRatios = bars.map(bar => ({
    ...bar,
    flexRatio: bar.value / maxValue,
  }));

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h3 className="text-lg font-bold leading-[23.94px] text-black">{title}</h3>
      
      {/* Horizontal bars */}
      <div className={`flex items-center gap-0`} style={{ height: `${barHeight}px` }}>
        {flexRatios.map((bar, index) => (
          <div
            key={index}
            className="chart-item h-full rounded-[12.718px] flex items-center justify-center min-w-[60px]"
            style={{
              backgroundColor: bar.color,
              flex: bar.flexRatio,
            }}
          >
            <span className="text-base font-bold leading-[21.28px] text-white">{bar.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 items-center">
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[2.5px]" style={{ backgroundColor: item.color }} />
              <span className="text-xs leading-[15.96px] text-black">{item.label}</span>
            </div>
          ))}
        </div>
        {totalText && (
          <p className="text-xs leading-[15.96px] text-black text-center">
            {totalText}
          </p>
        )}
      </div>
    </div>
  );
}

