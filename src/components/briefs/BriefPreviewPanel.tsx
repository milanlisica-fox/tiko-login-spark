import React from "react";

interface BriefPreviewPanelProps {
  projectTitle: string;
  launchDate: string;
  projectLead: string;
  objective: string;
}

export default function BriefPreviewPanel({
  projectTitle,
  launchDate,
  projectLead,
  objective,
}: BriefPreviewPanelProps) {
  return (
    <div className="bg-white flex flex-col gap-4 p-6 rounded-xl min-h-0 overflow-y-auto h-full">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center">
          <p className="text-[22px] font-bold leading-[29.26px] text-black">
            {projectTitle}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm leading-[18.62px] text-[#09090a]">
              <span className="font-bold">Launch date: </span>
              <span className="font-normal">{launchDate}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm leading-[18.62px] text-[#09090a]">
              <span className="font-bold">Project lead: </span>
              <span className="font-normal">{projectLead}</span>
            </p>
          </div>

          <p className="text-sm leading-[18.62px] text-[#09090a]">
            <span className="font-bold">Objective: </span>
            <span className="font-normal">{objective}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

