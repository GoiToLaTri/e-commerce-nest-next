"use client";

import { useClientPurchased } from "@/hooks/useClientPurchased";
import { Image, Pagination, Skeleton } from "antd";
import { useState } from "react";
import Card from "../ui/cards/card";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { AddReviewModal } from "../modals/add-review-modal";
import { useUserSession } from "@/hooks/useUserSession";

export default function ClientPurchasedProduct() {
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    sortField: "created_at",
    sortOrder: "asc",
    filters: {},
  });

  const { data, isLoading, isError, isFetching } = useClientPurchased({
    ...params,
  });

  const { data: session, isLoading: sessionLoading } = useUserSession();
  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  // const handleFilterChange = (filters: Record<string, string[]>) => {
  //   setParams((prev) => ({ ...prev, filters }));
  // };

  const loading = isLoading || isFetching || sessionLoading;
  const haveData =
    !isLoading && !isFetching && !isError && data && data.data.length > 0;
  console.log(data);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Purchased product</h2>
      {loading && <Skeleton paragraph={{ rows: 4 }} className="!w-full" />}
      {!loading && !haveData && <div>No product is puchased</div>}
      {isError && <div>Error loading products</div>}
      {!loading &&
        haveData &&
        data.data.map((product) => (
          <div key={product.id} className="w-full mb-4">
            <Card>
              <div className="flex items-center gap-8">
                <Image
                  src={product.thumbnail}
                  width={64}
                  height={64}
                  alt={product.model}
                />
                <div>
                  <h4 className="text-lg font-bold mb-4 text-white">
                    {product.model}
                  </h4>
                  <h4 className="text-base font-semibold mb-4 text-[rgba(255,255,255,.85)]">
                    {convertNumberToCurrency(product.price)}
                  </h4>
                  <div>
                    <AddReviewModal
                      data={{
                        userId: session?.session_user.user_id,
                        productId: product.id,
                        productName: product.model,
                        customerName:
                          session?.session_user.user.first_name +
                          " " +
                          session?.session_user.user.first_name,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      <div className="mt-4 w-full">
        <Pagination
          total={data?.total || 0}
          defaultCurrent={data?.page || 1}
          pageSize={data?.limit || 12}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
