"use client";

import { useGetProductReviews } from "@/hooks/useGetProductReviews";
import FeedbackCard from "../ui/cards/feedback-card";
import { LoadingSpin } from "../ui";

export interface ListProductFeedbackProps {
  productId: string;
}
export default function ListProductFeedback({
  productId,
}: ListProductFeedbackProps) {
  const { data, isLoading } = useGetProductReviews(productId);
  // console.log(data);
  return (
    <div className="bg-[#241932] border-[2px] border-solid border-[#302540] rounded-2xl p-6 flex flex-col items-start gap-4 shadow-lg sm:col-span-2 w-[60%]">
      <h2 className="font-semibold text-xl mb-1 text-white">Client feedback</h2>
      <div className="bg-[#352C43] rounded-2xl w-full max-h-[40rem] h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-xl">
        {isLoading && <LoadingSpin />}
        {!isLoading && (!data || (data && data.length === 0)) && (
          <div className="p-4 w-full">No content.</div>
        )}
        {data && data.map((item) => <FeedbackCard key={item.id} data={item} />)}
      </div>
    </div>
  );
}
