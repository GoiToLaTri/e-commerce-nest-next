import ListProductFeedback from "@/components/lists/list-product-feedback";
import ListProductForyou from "@/components/lists/list-product-foryou";

export interface ProductDetailFooterProps {
  productId: string;
}

export default function ProductDetailFooter({
  productId,
}: ProductDetailFooterProps) {
  return (
    <div className="bg-[#1b1428] border-[1px] border-solid border-[#564373] rounded-2xl p-6 flex items-stretch gap-4 shadow-lg sm:col-span-2 mb-[8rem]">
      <ListProductFeedback productId={productId} />
      <ListProductForyou />
    </div>
  );
}
