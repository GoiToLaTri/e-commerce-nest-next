"use client";

import { useGetInventoryStatsByPeriod } from "@/hooks/useGetInventoryStatsByPeriod";
import { Descriptions, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Tooltip,
} from "recharts";

const CustomChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    stroke: string;
    name: string;
    value: string;
    payload: { name: string };
  }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    // console.log(payload);
    return (
      <div className="bg-[#352C43] border-[2px] border-solid border-[#302540] rounded-2xl p-4 w-[200px]">
        <Descriptions title={label} column={1}>
          {payload.map((item, index) => (
            <Descriptions.Item
              key={item.payload.name + "_" + index}
              label={
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 rounded-sm`}
                    style={{ backgroundColor: item.stroke }}
                  />
                  {item.name}
                </div>
              }
            >
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    );
  }
  return null;
};

export function InventoryTransactionOverview() {
  const [period, setPeriod] = useState<"week" | "month" | "6months" | "year">(
    "week"
  );
  const { data, isLoading, isFetching, refetch } =
    useGetInventoryStatsByPeriod(period);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const handleChange = (value: string) => {
    // console.log(`selected ${value}`);
    setPeriod(value as "week" | "month" | "6months" | "year");
  };
  // console.log(data);

  const loading = Boolean(isFetching || isLoading);

  return (
    <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 shadow-lg w-[760px]">
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold">Inventory transaction overview</h4>
          <p className="text-sm text-gray-400">
            All general information appears in this page
          </p>
        </div>
        <Select
          defaultValue={period}
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "week", label: "1 Week" },
            { value: "month", label: "1 Month" },
            { value: "6months", label: "6 Months" },
            { value: "year", label: "1 Year" },
          ]}
        />
      </div>
      <div>{loading && <Spin />}</div>
      {!loading && (!data || data.length === 0) && <div>No content</div>}
      {!loading && data && (
        <div>
          <AreaChart
            width={710.4}
            height={365.2}
            data={data}
            // margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fd79a8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fd79a8" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a29bfe" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a29bfe" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#74b9ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#74b9ff" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tickMargin={10} />
            <YAxis tickMargin={20} />
            <CartesianGrid
              strokeDasharray="4 0"
              stroke="#564373"
              vertical={false}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Area
              type="monotone"
              dataKey="import"
              stroke="#e84393"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="export"
              stroke="#6c5ce7"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
            <Area
              type="monotone"
              dataKey="adjustment"
              stroke="#0984e3"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </div>
      )}
    </div>
  );
}
