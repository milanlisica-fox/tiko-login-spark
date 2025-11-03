import React from "react";
import { BRIEFS_ASSETS } from "@/constants/briefs-assets";

const createBriefArrowIcon = BRIEFS_ASSETS.createBriefArrowIcon;

type FormFooterProps = {
  onDiscard?: () => void;
  onSaveDraft?: () => void;
  onReview?: () => void;
};

export default function FormFooter({ onDiscard, onSaveDraft, onReview }: FormFooterProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onDiscard}
        className="px-2 h-8 bg-[#03b3e2] text-black hover:opacity-80 rounded-[28px] transition"
      >
        <span className="text-[13px] font-semibold leading-[18.62px]">Discard</span>
      </button>
      <div className="flex gap-1 items-center">
        <button
          onClick={onSaveDraft}
          className="h-8 px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-[10px] transition"
        >
          <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Save draft</span>
          <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
        </button>
        <button
          onClick={onReview}
          className="h-8 px-4 bg-[#ffb546] hover:opacity-90 rounded-[28px] flex items-center justify-center gap-[10px] transition"
        >
          <span className="text-[13px] font-semibold leading-[18.62px] text-black whitespace-nowrap">Review brief</span>
          <img src={createBriefArrowIcon} alt="" className="h-[14px] w-[15.567px]" />
        </button>
      </div>
    </div>
  );
}


