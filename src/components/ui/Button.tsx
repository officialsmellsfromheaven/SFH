import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variants = {
  primary:  "btn-shine text-white font-bold shadow-lg",
  secondary:"bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold shadow-md transition-colors",
  outline:  "border-2 font-bold transition-all duration-200",
  ghost:    "font-medium transition-colors",
  danger:   "bg-red-500 hover:bg-red-600 text-white font-bold",
};

const sizes = { sm:"px-3 py-1.5 text-sm", md:"px-5 py-2.5 text-sm", lg:"px-8 py-3.5 text-base" };

export default function Button({ variant="primary", size="md", loading=false, className, children, disabled, ...props }: Props) {
  const outlineStyle = variant === "outline"
    ? { borderColor:"#38a8e8", color:"#1a7ab8" } : {};

  return (
    <button
      style={outlineStyle}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  );
}
