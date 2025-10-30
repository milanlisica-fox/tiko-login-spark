import React from "react";

type BriefCardProps = {
  title: string;
  description?: string;
  meta?: React.ReactNode; // tags/owners/etc.
  right?: React.ReactNode; // actions/chevron/etc.
  className?: string;
  children?: React.ReactNode;
};

export default function BriefCard({ title, description, meta, right, className = "", children }: BriefCardProps) {
  return (
    <div className={`card-base radius-md p-5 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold leading-[18.62px] text-black truncate">{title}</h4>
        {right ? <div className="flex items-center">{right}</div> : null}
      </div>
      {description ? (
        <p className="text-sm leading-[18.62px] text-[#646464] min-h-[38px] overflow-hidden line-clamp-2">{description}</p>
      ) : null}
      {meta ? <div className="pt-1">{meta}</div> : null}
      {children}
    </div>
  );
}


