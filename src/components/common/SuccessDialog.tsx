import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PillAccent } from "@/components/common/buttons";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
}

export default function SuccessDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Brief successfully submitted!",
  description = "Your brief status has been updated to Review. We will get back to you soon.",
  confirmText = "View all briefs",
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md !bg-white border border-[#e0e0e0] rounded-xl p-8 [&>button]:hidden">
        <DialogHeader className="flex flex-col gap-4 items-center text-center">
          <DialogTitle className="text-h1 text-black text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-[18.62px] text-[#424242] text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <PillAccent type="button" onClick={onConfirm} size="md">
            <span className="text-sm font-semibold leading-[18.62px] text-black">{confirmText}</span>
          </PillAccent>
        </div>
      </DialogContent>
    </Dialog>
  );
}

