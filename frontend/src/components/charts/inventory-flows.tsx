"use client";

import { useGetInventoryFlows } from "@/hooks/useGetInventoryFlows";
import { Spin } from "antd";
import Link from "next/link";

type StatType = "import" | "export" | "adjustment";

const getBorderColor = (type: StatType) => {
  switch (type) {
    case "import":
      return "border-[#6c5ce7]";
    case "export":
      return "border-[#0984e3] border-dashed";
    case "adjustment":
      return "border-[#00cec9] border-dotted";
    default:
      return "";
  }
};

const getArrowColor = (percent: number) => {
  if (percent > 0) return "text-green-400";
  if (percent < 0) return "text-red-400";
  return "text-gray-400";
};

function renderInventoryStat(
  label: string,
  type: StatType,
  current: number,
  previous: number
) {
  const diff = current - previous;
  const trend = diff > 0 ? "increase" : diff < 0 ? "decrease" : "nochange";

  const percent = previous !== 0 ? ((diff / previous) * 100).toFixed(2) : "N/A";

  const arrow = trend === "increase" ? "↑" : trend === "decrease" ? "↓" : "";

  return (
    <div className="mb-4">
      <div className={`border-l-2 border-b-8 ${getBorderColor(type)} px-4`}>
        <div className="text-xl font-semibold text-white mb-1">{current}</div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">
            Compared to {previous} {label.toLowerCase()} last month
          </p>
          <p className={`text-sm ${getArrowColor(Number(percent))}`}>
            {percent !== "N/A" ? (
              <>
                {percent}%
                <span className="align-text-bottom ml-1">{arrow}</span>
              </>
            ) : (
              "No data"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export function InventoryFlows() {
  const { data, isLoading, isFetching } = useGetInventoryFlows();
  // console.log(data);
  const loading = Boolean(isFetching || isLoading);

  return (
    <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 shadow-lg w-[500px] h-[475.2px]">
      <div className="flex justify-between mb-4">
        <div>
          <h4 className="font-semibold">Inventory flows</h4>
        </div>
        <Link href={"stock-history"} className="text-sm text-gray-400">
          View more
        </Link>
      </div>
      <div>{loading && <Spin />}</div>
      {!loading && !data && <div>No content</div>}
      {!loading && data && (
        <div>
          <div className="mb-8">
            <div className="text-3xl font-semibold text-white mb-1">
              {data.currentInventoryStats[0].totalInventory}
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">
                Compared to {data.previousInventoryStats[0].totalInventory}{" "}
                inventory last month
              </p>
            </div>
          </div>
          {renderInventoryStat(
            "Import",
            "import",
            data.currentInventoryStats[0].totalImport,
            data.previousInventoryStats[0].totalImport
          )}
          {renderInventoryStat(
            "Export",
            "export",
            data.currentInventoryStats[0].totalExport,
            data.previousInventoryStats[0].totalExport
          )}
          {renderInventoryStat(
            "Adjustment",
            "adjustment",
            data.currentInventoryStats[0].totalAdjustment,
            data.previousInventoryStats[0].totalAdjustment
          )}
        </div>
      )}
    </div>
  );
}
