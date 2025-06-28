import { productApi, QueryParams } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { IProductResponse } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams } from "./useProducts";

export function useCustomerProducts({
  page,
  limit,
  sortField,
  sortOrder,
  filters,
  initialData,
}: { initialData: IProductResponse } & QueryParams & PaginationParams) {
  return useQuery<IProductResponse>({
    queryKey: [
      queryKeys.GET_CUSTOMER_LIST_PRODUCT_DATA,
      { page, limit, sortField, sortOrder, filters },
    ],
    queryFn: async () => {
      const res = await productApi.findAll({
        page,
        limit,
        sortField,
        sortOrder,
        filters,
      });
      return res.data;
    },
    initialData,
  });
}
