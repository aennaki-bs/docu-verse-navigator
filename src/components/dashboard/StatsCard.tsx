import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

interface StatsCardProps {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  className,
}: StatsCardProps) {
  const { theme } = useSettings();

  const changeColorClass = {
    positive: theme === "dark" ? "text-green-400" : "text-green-500",
    negative: theme === "dark" ? "text-red-400" : "text-red-500",
    neutral: theme === "dark" ? "text-blue-400" : "text-blue-500",
  };

  return (
    <div
      className={cn(
        "rounded-lg p-6 h-full",
        theme === "dark"
          ? "bg-[#0a1033] border border-blue-900/30"
          : "bg-white border border-blue-100 shadow-sm",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={
              theme === "dark"
                ? "text-blue-300 text-sm font-medium"
                : "text-blue-700 text-sm font-medium"
            }
          >
            {title}
          </h3>
          <div
            className={`mt-2 ${
              theme === "dark" ? "text-white" : "text-blue-900"
            } text-3xl font-bold`}
          >
            {value}
          </div>
        </div>
        {icon && (
          <div className={theme === "dark" ? "text-blue-400" : "text-blue-500"}>
            {icon}
          </div>
        )}
      </div>

      {change && (
        <div className="mt-4">
          <span
            className={`text-xs font-medium ${changeColorClass[changeType]}`}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
