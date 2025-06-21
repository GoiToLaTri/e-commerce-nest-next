import { productApi } from "@/api-client";
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

export function useProducts({ page, limit }: PaginationParams) {
  return useQuery<IProduct[]>({
    queryKey: [queryKeys.GET_LIST_PRODUCT_DATA, page, limit],
    queryFn: async () => {
      const res = await productApi.getAllProduct({ page });
      return res.data;
    },
  });
}
