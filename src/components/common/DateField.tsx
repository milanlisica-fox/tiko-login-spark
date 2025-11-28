import React, { useState } from "react";
import { Field } from "@/components/common/Field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type DateFieldProps = {
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
};

export default function DateField({ label, helpText, value, onChange, placeholder = "Pick a date", className = "" }: DateFieldProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Field label={label} helpText={helpText} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={`bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg px-5 py-2.5 text-left text-sm w-full ${value ? 'text-black' : 'text-[#848487]'}`}>
            {value ? value.toLocaleDateString() : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg [&_button]:text-black [&_td]:text-black [&_.day]:text-black [&_.caption_label]:text-black">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            initialFocus
            classNames={{
              caption_label: "text-sm font-medium text-black",
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}


