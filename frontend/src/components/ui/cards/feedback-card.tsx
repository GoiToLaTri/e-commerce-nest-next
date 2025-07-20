import { Review } from "@/models";
import { formatDate } from "@/utils/date.util";
import { Avatar, Rate } from "antd";

interface FeedbackCardProps {
  data: Review;
}

export default function FeedbackCard({ data }: FeedbackCardProps) {
  return (
    <div className="flex items-stretch gap-4 sm:col-span-2 w-full">
      <div className="max-w-[160px] border-r-[1px] border-solid border-[#564373] p-4 w-full">
        <div>
          <Avatar
            src="http://res.cloudinary.com/nohope/image/upload/v1751463279/thumbnails/Asus_Vivobook_14_X1405_1_f4671a95f2_1751463274913.webp"
            size="large"
          />
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">{data.customerName}</h4>
          <h5>{formatDate(new Date(data.createdAt))}</h5>
        </div>
      </div>
      <div className="p-4 pb-0">
        <h4 className="font-semibold">{data.title}</h4>
        <Rate value={4} disabled />
        <p className="text-left leading-6">{data.content}</p>
      </div>
    </div>
  );
}
