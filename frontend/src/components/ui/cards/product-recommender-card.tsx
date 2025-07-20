import { Image } from "antd";
import Link from "next/link";
import { PurpleButton } from "../button/purple-button";

interface ProductRecommenderCardProps {
  data: { id: string; thumbnail: string; model: string };
}

export default function ProductRecommenderCard({
  data,
}: ProductRecommenderCardProps) {
  return (
    <div className="bg-[#352C43] border-[1px] border-solid border-[#564373] rounded-2xl flex items-stretch gap-4 shadow-lg sm:col-span-2 w-full">
      <div className="max-w-[160px] border-r-[1px] border-solid border-[#564373] p-4 w-full">
        <div>
          <Image src={data.thumbnail} alt={data.model} preview={false} />
        </div>
      </div>
      <div className="p-4 pb-0">
        <h4 className="font-semibold">{data.model}</h4>
        <div className="mt-[2rem]">
          <Link href={`${data.id}`} prefetch>
            <PurpleButton>Detail</PurpleButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
