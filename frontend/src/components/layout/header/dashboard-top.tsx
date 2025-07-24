"use client";

import StatCard from "@/components/ui/cards/stat-card";
import { useGetDashboardOverview } from "@/hooks/useGetDashboardOverView";
import {
  FileSearchOutlined,
  FundViewOutlined,
  ImportOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import { CSSProperties } from "react";

export function DashboardTop() {
  const { data, isLoading } = useGetDashboardOverview();
  //   console.log(data);

  const iconStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -46%)",
    color: "white",
    fontSize: "2rem",
  };

  return (
    <div>
      {isLoading && <Skeleton />}
      {!isLoading && !data && <div>No content</div>}
      {!isLoading && data && (
        <div>
          <div className="flex gap-5 mb-5">
            <StatCard
              icon={
                <div className="rounded-full bg-[#e84393] mb-[1rem] w-[4rem] h-[4rem] relative">
                  <FundViewOutlined style={iconStyle} />
                </div>
              }
              title="Views"
              current={data.views.current}
              previous={data.views.previous}
              percent={data.views.change.percent}
              trend={data.views.change.trend}
            />
            <StatCard
              icon={
                <div className="rounded-full bg-[#fd79a8] mb-[1rem] w-[4rem] h-[4rem] relative">
                  <InboxOutlined style={iconStyle} />
                </div>
              }
              title="Inventory"
              current={data.inventory.current}
              previous={data.inventory.previous}
              percent={data.inventory.change.percent}
              trend={data.inventory.change.trend}
            />
            <StatCard
              icon={
                <div className="rounded-full bg-[#6c5ce7] mb-[1rem] w-[4rem] h-[4rem] relative">
                  <FileSearchOutlined style={iconStyle} />
                </div>
              }
              title="Reviews"
              current={data.reviews.current}
              previous={data.reviews.previous}
              percent={data.reviews.change.percent}
              trend={data.reviews.change.trend}
            />
            <StatCard
              icon={
                <div className="rounded-full bg-[#a29bfe] mb-[1rem] w-[4rem] h-[4rem] relative">
                  <ImportOutlined style={iconStyle} />
                </div>
              }
              title="Sales"
              current={data.sales.current}
              previous={data.sales.previous}
              percent={data.sales.change.percent}
              trend={data.sales.change.trend}
            />
            <StatCard
              icon={
                <div className="rounded-full bg-[#74b9ff] mb-[1rem] w-[4rem] h-[4rem] relative">
                  <UserOutlined style={iconStyle} />
                </div>
              }
              title="User"
              current={data.user.current}
              previous={data.user.previous}
              percent={data.user.change.percent}
              trend={data.user.change.trend}
            />
          </div>
        </div>
      )}
    </div>
  );
}
