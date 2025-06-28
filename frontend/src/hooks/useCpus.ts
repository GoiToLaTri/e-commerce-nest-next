import { productSpecificationApi } from "@/api-client";
import { queryKeys } from "@/common/enums";
import { useQuery } from "@tanstack/react-query";

export default function useCpus() {
  return useQuery({
    queryKey: [queryKeys.GET_PROCESSORS],
    queryFn: async () => {
      const res = await productSpecificationApi.findManyCpu();
      return res.data;
    },
  });
}
