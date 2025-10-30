import React from "react";
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
  return (
    <Field label={label} helpText={helpText} className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <button className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg px-5 py-2.5 text-left text-sm text-black w-full">
            {value ? value.toLocaleDateString() : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 bg-white border border-[#e0e0e0] rounded-lg">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => onChange?.(d ?? undefined)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}


