import { productApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { IProduct } from "@/models";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams } from "./useProducts";

export function useCustomerProducts({
  page,
  limit,
  initialData,
}: { initialData: IProduct[] } & PaginationParams) {
  return useQuery<IProduct[]>({
    queryKey: [queryKeys.GET_CUSTOMER_LIST_PRODUCT_DATA, page, limit],
    queryFn: async () => {
      const res = await productApi.findAll({ page });
      return res.data;
    },
    initialData,
  });
}
