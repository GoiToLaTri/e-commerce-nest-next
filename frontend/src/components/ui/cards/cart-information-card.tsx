import React from "react";
import Card from "./card";
import { ICart } from "@/models";
import { Descriptions } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { PurpleButton } from "../button/purple-button";

export interface CartInformationCardProps {
  data?: ICart;
}

export default function CartInformationCard({
  data,
}: CartInformationCardProps) {
  return (
    <div className="w-full cart-information">
      <Card>
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">
            Cart information
          </h2>
          {!data && <div>No data</div>}
          {data && (
            <div>
              <Descriptions column={1}>
                <DescriptionsItem label="Cart id">{data.id}</DescriptionsItem>
                <DescriptionsItem label="Total product">
                  {data.items.length}
                </DescriptionsItem>
                <DescriptionsItem label="Total item">
                  {data.items.reduce((total, item) => total + item.quantity, 0)}
                </DescriptionsItem>
                <DescriptionsItem label="Total price">
                  {convertNumberToCurrency(
                    data.items.reduce(
                      (total, item) =>
                        total + item.priceAtAdded * item.quantity,
                      0
                    )
                  )}
                </DescriptionsItem>
                <DescriptionsItem label="Latest update">
                  {new Date(data.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DescriptionsItem>
              </Descriptions>
              <div className="mt-4">
                <PurpleButton>Check out</PurpleButton>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
