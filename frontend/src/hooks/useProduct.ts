import { useQuery } from "@tanstack/react-query";
import { IProduct } from "@/models";
import { queryKeys } from "@/common/enums";
import { productApi } from "@/api-client";

export function useProduct({ id }: { id: string }) {
  return useQuery<IProduct>({
    queryKey: [queryKeys.DET_DETAIL_PRODUCT_DATA, id],
    queryFn: async () => {
      const res = await productApi.getDetailProduct(id);
      return res.data;
    },
  });
}
