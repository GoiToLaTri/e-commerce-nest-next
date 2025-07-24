"use client";

import { useGetLaptopBrandChart } from "@/hooks/useGetLaptopBrandChart";
import { Descriptions, Spin } from "antd";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Line,
  Tooltip,
} from "recharts";

const CustomChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    fill: string;
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
                    style={{ backgroundColor: item.stroke || item.fill }}
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

export function LaptopbrandChart() {
  const { data, isLoading, isFetching } = useGetLaptopBrandChart();
  const loading = Boolean(isFetching || isLoading);
  console.log(data);
  return (
    <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 shadow-lg w-full">
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold">Laptop brand overview</h4>
          <p className="text-sm text-gray-400 mb-[1em]">
            All general information appears in this page
          </p>
        </div>
      </div>
      <div>{loading && <Spin />}</div>
      {!loading && (!data || data.length === 0) && <div>No content</div>}
      {!loading && data && (
        <div>
          <ComposedChart width={1230.4} height={400} data={data}>
            <CartesianGrid
              strokeDasharray="4 0"
              stroke="#564373"
              // vertical={false}
            />
            <XAxis dataKey="name" tickMargin={10} />
            <YAxis tickMargin={20} />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend />
            <Bar dataKey="value" barSize={20} fill="#00cec9" />
            <Line type="monotone" dataKey="percentage" stroke="#00b894" />
          </ComposedChart>
        </div>
      )}
    </div>
  );
}
