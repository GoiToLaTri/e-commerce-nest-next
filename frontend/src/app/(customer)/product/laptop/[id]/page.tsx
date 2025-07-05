import { productApi } from "@/api-client";
import ProductDetailTracker from "@/components/trackers/product-detail-tracker";
import { ProductDetailAction } from "@/components/ui";
import ProductImagePreview from "@/components/ui/preview/product-image-preview";
import { IProduct } from "@/models";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { Descriptions, Image, Rate } from "antd";
import { notFound } from "next/navigation";

export interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { id } = await params;
  const res = await productApi.getClientDetailProduct(id);
  const data = (await res.data) as IProduct;

  if (!data) notFound();

  return (
    <div className="flex gap-4 mb-[8rem]">
      <div className="product-images">
        <div>
          <Image src={data.thumbnail} alt="thumbnail" width={400} />
        </div>
        <div className="max-w-[400px]">
          <ProductImagePreview images={data.images} />
        </div>
      </div>
      <div className="product-info">
        <div className="w-full border-[1px] border-solid border-[rgba(160,145,184,.4784313725)] rounded-[12px]">
          <div className="flex justify-between p-8">
            <div className="w-[60%]">
              <h2 className="font-semibold text-xl mb-1 text-white">
                {data.model}
              </h2>
              <p className="text-balance text-[#7a7990] mt-[4px] leading-6">
                {data.description}
              </p>
            </div>
            <div className="flex items-end flex-col gap-4">
              <div className="font-semibold text-4xl">
                {convertNumberToCurrency(data.price)}
              </div>
              <ProductDetailAction productId={data.id} />
            </div>
          </div>
          <div className="border-t-[1px] border-solid border-[rgba(160,145,184,.4784313725)]  p-8">
            <Descriptions
              column={3}
              styles={{
                title: {
                  fontSize: "20px",
                  lineHeight: "1.75rem",
                  fontWeight: 600,
                  color: "#fff",
                },
                label: { fontSize: "16px" },
                content: { fontSize: "16px" },
              }}
            >
              <Descriptions.Item label="Rate">
                <Rate allowHalf disabled defaultValue={4} />
              </Descriptions.Item>
              <Descriptions.Item label="View">40.4k</Descriptions.Item>
              <Descriptions.Item label="Saled">20.4k</Descriptions.Item>
            </Descriptions>
          </div>
          <div className="border-t-[1px] border-solid border-[rgba(160,145,184,.4784313725)]  p-8">
            <Descriptions
              title="Product Specification"
              column={1}
              styles={{
                title: {
                  fontSize: "20px",
                  lineHeight: "1.75rem",
                  fontWeight: 600,
                  color: "#fff",
                },
                label: { fontSize: "16px" },
                content: { fontSize: "16px" },
              }}
            >
              <Descriptions.Item label="Processor">
                {data.Processor.model || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Video Graphics">
                {data.VideoGraphics.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Display">
                {data.Display.info || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Memory">
                {data.Memory.info || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Storage">
                {data.Storage.info || "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>
      {id && <ProductDetailTracker productId={id} />}
    </div>
  );
}
