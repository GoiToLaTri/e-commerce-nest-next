"use client";

import { useGetOrderStatusChart } from "@/hooks/useGetOrderStatusChart";
import { Descriptions, Spin } from "antd";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const CustomChartTooltip = ({
  active,
  payload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  label,
}: {
  active?: boolean;
  payload?: {
    payload: { fill: string; stroke: string; label: string; value: string };
  }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#352C43] border-[2px] border-solid border-[#302540] rounded-2xl p-4 w-[200px]">
        <Descriptions title={payload[0].payload.label} column={1}>
          <Descriptions.Item
            label={
              <div className="flex items-center gap-4">
                <div
                  className={`w-4 h-4 rounded-sm`}
                  style={{ backgroundColor: payload[0].payload.fill }}
                />
                value
              </div>
            }
          >
            {payload[0].payload.value}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
  return null;
};

export default function OrderStatusChart() {
  const { data, isLoading, isFetching } = useGetOrderStatusChart();
  const loading = Boolean(isFetching || isLoading);
  console.log(data);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (!data) return;
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
      >
        {`${data[index].percentage.toFixed(0)}%`}
      </text>
    );
  };

  const renderCustomLegend = () => {
    if (!data) return;

    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          textAlign: "center",
        }}
      >
        {data.map((entry, index) => (
          <li
            key={entry.label + index}
            style={{ display: "inline-block", marginRight: 16 }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                backgroundColor: entry.color,
                marginRight: 6,
                borderRadius: "50%",
              }}
            />
            <span style={{ fontSize: 14 }}>{entry.label}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 shadow-lg w-[400px]">
      <div className="flex justify-between mb-4">
        <div>
          <h4 className="font-semibold">Order status overview</h4>
        </div>
      </div>
      <div>{loading && <Spin />}</div>
      {!loading && (!data || data.length === 0) && <div>No content</div>}
      {!loading && data && (
        <div>
          <PieChart width={350.4} height={240}>
            <Pie
              stroke="#564373"
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.label}-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomChartTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              content={renderCustomLegend}
            />
          </PieChart>
        </div>
      )}
    </div>
  );
}
