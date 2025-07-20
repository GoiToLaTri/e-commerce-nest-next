"use client";

import { useRecommendation } from "@/hooks/useRecommendation";
import { Spin } from "antd";
import ProductRecommenderCard from "../ui/cards/product-recommender-card";

export default function ListProductForyou() {
  const { data, isLoading } = useRecommendation();
  const haveData = data && data.length > 0;
  // console.log(data);
  return (
    <div className="bg-[#241932] border-[2px] border-solid border-[#302540] rounded-2xl p-6 flex flex-col items-start gap-4 shadow-lg sm:col-span-2 w-[40%] ">
      <h2 className="font-semibold text-xl mb-1 text-white">For you</h2>
      {isLoading && <Spin size="large" />}
      {!isLoading && !haveData && <div>No content</div>}
      <div className="flex flex-col gap-4 max-h-[40rem] h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-xl pr-2">
        {!isLoading &&
          data &&
          data.length > 0 &&
          data.map((product) => (
            <ProductRecommenderCard key={product.id} data={product} />
          ))}
      </div>
    </div>
  );
}
