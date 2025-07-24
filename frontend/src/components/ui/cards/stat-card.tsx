import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  current: number;
  previous: number;
  percent: string;
  trend: "increase" | "decrease" | "no_change" | "new";
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "increase":
      return "text-green-400";
    case "decrease":
      return "text-red-400";
    case "no_change":
      return "text-gray-400";
    case "new":
      return "text-blue-400";
    default:
      return "text-white";
  }
};

export default function StatCard({
  icon,
  title,
  current,
  previous,
  percent,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 shadow-lg w-[240px]">
      {icon}
      <h4 className="text-white text-sm font-semibold mb-2">{title}</h4>
      <div className="text-3xl font-semibold text-white mb-1">{current}</div>
      <div className="flex w-full justify-between items-center">
        <span className="text-sm text-gray-400">Previous: {previous}</span>
        <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
          <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
            {percent === "New" ? (
              "New"
            ) : (
              <>
                {percent}{" "}
                <span className="align-text-bottom">
                  {trend === "increase" ? "↑" : trend === "decrease" ? "↓" : ""}
                </span>
              </>
            )}
          </span>
        </span>
      </div>
    </div>
  );
}
