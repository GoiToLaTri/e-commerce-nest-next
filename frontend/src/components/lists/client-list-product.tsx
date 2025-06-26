"use client";

import { useCustomerProducts } from "@/hooks/useCustomerProducts";
import { IProduct } from "@/models";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { Card as AntdCard, Image } from "antd";
import Meta from "antd/es/card/Meta";
import "@/styles/client-list-product.style.css";
import Link from "next/link";
import { PrupleButton } from "../ui";

export default function ClientListProduct({
  initialData,
}: {
  initialData: IProduct[];
}) {
  const {
    data = [],
    isLoading,
    isError,
  } = useCustomerProducts({
    page: 1,
    limit: 10,
    initialData: initialData || [],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occurred while loading data.</div>;
  if (data.length === 0) return <div>No products display.</div>;

  return (
    <div>
      <div style={{ marginTop: 16 }}>
        <AntdCard.Grid>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {data &&
              data.length > 0 &&
              data.map((laptop, index) => (
                <AntdCard
                  key={laptop.id}
                  className="product-card !bg-[#1b1428] !border-[1px] !border-solid !border-[#564373] !rounded-2xl shadow-lg !flex !flex-col"
                  style={{ animationDelay: `${index * 400}ms` }}
                  cover={
                    <Image
                      alt="laptop thumbnail"
                      src={laptop.thumbnail}
                      width={240}
                      height={240}
                      preview={false}
                    />
                  }
                  actions={[
                    <Link
                      href={`laptop/${laptop.id}`}
                      key={`detail-${laptop.id}`}
                    >
                      <PrupleButton>Detail</PrupleButton>
                    </Link>,
                  ]}
                >
                  <Meta
                    title={laptop.model}
                    description={
                      <h4 className="text-xl text-white">
                        {convertNumberToCurrency(laptop.price)}
                      </h4>
                    }
                  />
                </AntdCard>
              ))}
          </div>
        </AntdCard.Grid>
      </div>
    </div>
  );
}
