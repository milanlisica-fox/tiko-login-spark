import React from "react";
import { PillAccent, PillGhost, PillSubtle } from "@/components/common/buttons";

type FormFooterProps = {
  onDiscard?: () => void;
  onSaveDraft?: () => void;
  onReview?: () => void;
};

export default function FormFooter({ onDiscard, onSaveDraft, onReview }: FormFooterProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <PillGhost onClick={onDiscard} size="sm" className="px-2 h-8">
        <span className="text-[13px] font-semibold leading-[18.62px] text-black">Discard</span>
      </PillGhost>
      <div className="flex gap-1 items-center">
        <PillSubtle onClick={onSaveDraft} size="sm" className="h-8 bg-[#f9f9f9] hover:bg-[#e5e5e5]">
          <span className="text-[13px] font-semibold leading-[18.62px] text-[#848487]">Save draft</span>
        </PillSubtle>
        <PillAccent onClick={onReview} size="sm" className="h-8">
          <span className="text-[13px] font-semibold leading-[18.62px] text-black">Review brief</span>
        </PillAccent>
      </div>
    </div>
  );
}


