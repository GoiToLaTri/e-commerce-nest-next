import { productApi } from "@/api-client";
import ClientListProduct from "@/components/lists/client-list-product";

export default async function ProductPages() {
  const { data } = await productApi.findAll({ page: 1 });
  return (
    <div className="mb-[8rem]">
      <ClientListProduct initialData={data} />
    </div>
  );
}
