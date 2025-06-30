"use client";

import { useSearchProducts } from "@/hooks/useSearchProducts";
import { Image, Input, Spin } from "antd";
import type { GetProps } from "antd";
import { useState } from "react";
import Link from "next/link";

type SearchProps = GetProps<typeof Input.Search>;

const { Search: AntdSearch } = Input;

export function ClientSearch() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSearchProducts(query.trim());

  const onSearch: SearchProps["onSearch"] = (value) => setQuery(value);

  return (
    <div className="client-search flex items-center flex-col gap-8">
      <AntdSearch
        placeholder="Enter your text"
        onSearch={onSearch}
        allowClear
        enterButton
        size="large"
        className="max-w-[40rem]"
      />
      <div className="block w-full">
        {isLoading && (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        )}
        {!isLoading && !data && (
          <div className="search-product-result text-center">
            No results found. Please try a different search.
          </div>
        )}
        {!isLoading && data?.data.length === 0 && (
          <div className="search-product-result text-center">
            No results found. Please try a different search.
          </div>
        )}
        {data &&
          data.data.map((product) => (
            <Link key={product.id} href={`/product/laptop/${product.id}`}>
              <div className="search-product-result w-[40rem] mx-auto mb-4">
                <div className="transition-all duration-300 g-gradient-to-br from-white/10 to-white/5 backdrop-blur-0 border border-purple-200/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-[24px] flex items-start gap-4 px-6 hover:shadow-xl hover:border-purple-400/60 hover:bg-purple-50/30 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex justify-center mb-2">
                      <Image
                        src={product.thumbnail}
                        alt={product.model}
                        className="object-cover rounded w-40 h-40"
                        preview={false}
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className="text-lg font-semibold text-center">
                      {product.model}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
