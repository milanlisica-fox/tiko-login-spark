import React, { FormEvent } from "react";

type ChatInputProps = {
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  leftIconSrc?: string;
  leftIcon?: React.ReactNode;
  rightIconSrc?: string;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  helpText?: string;
  className?: string;
  containerClassName?: string;
};

export default function ChatInput({
  value = "",
  onChange,
  onSubmit,
  leftIconSrc,
  leftIcon,
  rightIconSrc,
  rightIcon,
  placeholder = "Type here...",
  helpText,
  className = "w-[516px]",
  containerClassName = "",
}: ChatInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${containerClassName}`}>
      <form onSubmit={handleSubmit} className={`${className} bg-white border border-[#e0e0e0] rounded-[23px] p-1 flex items-center justify-between`}>
        <div className="flex gap-[7px] items-center flex-1">
          {leftIcon ? (
            <div className="h-10 w-[35.514px] shrink-0 flex items-center justify-center">
              {leftIcon}
            </div>
          ) : leftIconSrc ? (
            <div className="h-10 w-[35.514px] shrink-0">
              <img src={leftIconSrc} alt="" className="w-full h-full" />
            </div>
          ) : null}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-sm leading-[18.62px] text-[#848487] bg-transparent border-none outline-none placeholder-[#848487]"
          />
        </div>
        <button type="submit" className="w-10 h-10 shrink-0 relative cursor-pointer hover:opacity-80 transition flex items-center justify-center">
          {rightIcon ? (
            <span className="w-full h-full flex items-center justify-center">{rightIcon}</span>
          ) : rightIconSrc ? (
            <img src={rightIconSrc} alt="Submit" className="w-full h-full" />
          ) : (
            <span className="text-sm">Send</span>
          )}
        </button>
      </form>
      {helpText ? (
        <p className="text-[12px] leading-[15.96px] text-[#424242] text-center w-[347px]">{helpText}</p>
      ) : null}
    </div>
  );
}


