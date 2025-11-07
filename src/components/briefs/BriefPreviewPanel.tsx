import React from "react";

interface BriefPreviewPanelProps {
  projectTitle?: string;
  launchDate?: string;
  projectLead?: string;
  objective?: string;
}

export default function BriefPreviewPanel({
  projectTitle,
  launchDate,
  projectLead,
  objective,
}: BriefPreviewPanelProps) {
  const hasLaunchDate = Boolean(launchDate);
  const hasProjectLead = Boolean(projectLead);
  const hasObjective = Boolean(objective && objective.trim() !== "");

  return (
    <div className="bg-white flex flex-col gap-4 p-6 rounded-xl min-h-0 overflow-y-auto h-full shadow-sm">
      <div className="flex items-center justify-center">
        <p className="text-[22px] font-bold leading-[29.26px] text-black text-center">
          {projectTitle && projectTitle.trim() !== "" ? projectTitle : "Untitled brief"}
        </p>
      </div>

      <div className="flex flex-col gap-3 text-sm leading-[18.62px] text-[#09090a]">
        {hasLaunchDate ? (
          <p>
            <span className="font-bold">Launch date: </span>
            <span className="font-normal">{launchDate}</span>
          </p>
        ) : null}

        {hasProjectLead ? (
          <p>
            <span className="font-bold">Project lead: </span>
            <span className="font-normal">{projectLead}</span>
          </p>
        ) : null}
      </div>

      {hasObjective ? (
        <p className="text-sm leading-[18.62px] text-[#09090a]">
          <span className="font-bold">Objective: </span>
          <span className="font-normal">{objective}</span>
        </p>
      ) : null}
    </div>
  );
}

