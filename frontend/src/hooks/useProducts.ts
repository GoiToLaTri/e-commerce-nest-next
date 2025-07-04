import { productApi, QueryParams } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { IProduct } from "@/models";
import { useQuery } from "@tanstack/react-query";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductResponse {
  listProduct: IProduct[];
  total: number;
  page: number;
  limit: number;
}

export function useProducts(
  query: { search?: string; status?: boolean } & QueryParams & PaginationParams
) {
  return useQuery({
    queryKey: [queryKeys.GET_LIST_PRODUCT_DATA, query],
    queryFn: async () => {
      const res = await productApi.getAllProduct({ ...query });
      return res.data;
    },
  });
}
