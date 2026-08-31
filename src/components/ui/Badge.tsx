import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variant?: "gold" | "green" | "red" | "blue" | "gray";
  className?: string;
};

const variants = {
  gold: "bg-amber-100 text-amber-800 border border-amber-200",
  green: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  red: "bg-red-100 text-red-700 border border-red-200",
  blue: "bg-blue-100 text-blue-700 border border-blue-200",
  gray: "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function Badge({ children, variant = "gold", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
