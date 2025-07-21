"use client";

import { useGetProductStatistics } from "@/hooks/useGetProductStatistics";
import { Descriptions, Rate, Skeleton } from "antd";

export default function ProductStatistics({ id }: { id: string }) {
  const { data, isLoading } = useGetProductStatistics(id);

  return (
    <div>
      {isLoading && <Skeleton loading />}
      {data && (
        <Descriptions
          column={4}
          styles={{
            title: {
              fontSize: "20px",
              lineHeight: "1.75rem",
              fontWeight: 600,
              color: "#fff",
            },
            label: { fontSize: "16px" },
            content: { fontSize: "16px" },
          }}
        >
          <Descriptions.Item label="Rate">
            <Rate allowHalf disabled defaultValue={data.averageRating} />
          </Descriptions.Item>
          <Descriptions.Item label="Review">
            {data?.ratingCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="View">
            {data.interactions.filter((item) => item.action === "VIEW")[0]
              .count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Saled">
            {data.totalSold || 0}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
}
