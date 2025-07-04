"use client";

import { useInventory } from "@/hooks/useInventory";
import React from "react";
import Card from "./card";
import { Descriptions, Image, Skeleton, Tag } from "antd";
import { convertNumberToCurrency } from "@/utils/currency.util";

export interface InventoryCardProps {
  id: string;
}

export function InventoryCard({ id }: InventoryCardProps) {
  const { data, isLoading } = useInventory(id);
  if (isLoading)
    return (
      <Card>
        <Skeleton />
      </Card>
    );
  return (
    <Card>
      <div className="w-full">
        <div className="w-fit mx-auto mb-4">
          <Image src={data?.product.thumbnail} width={200} alt="thumbnail" />
        </div>
        <div>
          <Descriptions
            column={1}
            styles={{
              title: {
                fontSize: "20px",
                lineHeight: "1.75rem",
                fontWeight: 600,
                color: "#fff",
                width: "fit",
              },
              label: { fontSize: "16px" },
              content: { fontSize: "16px" },
              root: {
                width: "fit",
              },
            }}
          >
            <Descriptions.Item label="Model">
              {data?.product.model}
            </Descriptions.Item>
            <Descriptions.Item label="Cost">
              {convertNumberToCurrency(data?.cost || 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {convertNumberToCurrency(data?.product.price || 0)}
            </Descriptions.Item>
            <Descriptions.Item label="In stock">
              {data?.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Minimum alert quantity">
              {data?.min_alert_quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {(() => {
                let color: string;
                let content: string;
                if (data!.quantity === 0) {
                  color = "error";
                  content = "Sold out";
                } else if (
                  data!.quantity > 0 &&
                  data!.quantity <= data!.min_alert_quantity
                ) {
                  color = "warning";
                  content = "Sold out";
                } else {
                  color = "success";
                  content = "Available";
                }
                return <Tag color={color}>{content.toUpperCase()}</Tag>;
              })()}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  );
}
