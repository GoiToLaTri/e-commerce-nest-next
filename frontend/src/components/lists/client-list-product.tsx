"use client";

import { useCustomerProducts } from "@/hooks/useCustomerProducts";
import { IProductResponse } from "@/models";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { Card as AntdCard, Image, Pagination, Skeleton } from "antd";
import Meta from "antd/es/card/Meta";
import "@/styles/client-list-product.style.css";
import Link from "next/link";
import { ClientProductFilter, PurpleButton } from "../ui";
import { useUserSession } from "@/hooks/useUserSession";
import { useAddUserInteraction } from "@/hooks/useAddUserInteraction";
import { Role } from "@/common/enums";
import Card from "../ui/cards/card";
import { useState } from "react";

export default function ClientListProduct({
  initialData,
}: {
  initialData: IProductResponse;
}) {
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    sortField: "created_at",
    sortOrder: "asc",
    filters: {},
  });

  const { data, isLoading, isError } = useCustomerProducts({
    ...params,
    initialData,
  });

  const { data: sessionData } = useUserSession();
  const addUserInteractionMutation = useAddUserInteraction();

  const handleAddUserInteraction = async (productId: string) => {
    if (!sessionData?.session_user.user_id) return;
    if (sessionData.session_user.user.roleId !== Role.USER) return;
    await addUserInteractionMutation.mutateAsync({
      productId,
      userId: sessionData?.session_user.user_id,
      action: "VIEW",
    });
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setParams((prev) => ({ ...prev, filters }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Laptop</h2>
      <div className="flex w-full gap-4">
        <div className="flex client-product-filter">
          <Card>
            <div className="w-[240px]">
              <ClientProductFilter onFilterChange={handleFilterChange} />
            </div>
          </Card>
        </div>
        <div>
          {isLoading && <Skeleton paragraph={{ rows: 4 }} />}
          {!isLoading && !isError && data?.data.length === 0 && (
            <div>No products found.</div>
          )}
          {isError && (
            <div className="text-red-500">
              An error occurred while fetching products.
            </div>
          )}
          <AntdCard.Grid>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {data &&
                data.data &&
                data.data.length > 0 &&
                data.data.map((laptop, index) => (
                  <AntdCard
                    key={laptop.id}
                    className="product-card !bg-[#1b1428] !border-[1px] !border-solid !border-[#564373] !rounded-2xl shadow-lg !flex !flex-col"
                    style={{ animationDelay: `${index * 240}ms` }}
                    cover={
                      <Image
                        alt="laptop thumbnail"
                        src={laptop.thumbnail}
                        preview={false}
                        className="!rounded-t-2xl"
                      />
                    }
                    actions={[
                      <Link
                        href={`laptop/${laptop.id}`}
                        key={`detail-${laptop.id}`}
                      >
                        <PurpleButton
                          onClick={() => handleAddUserInteraction(laptop.id)}
                        >
                          Detail
                        </PurpleButton>
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
          <div className="mt-4">
            <Pagination
              total={data?.total || 0}
              defaultCurrent={data?.page || 1}
              pageSize={data?.limit || 12}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
