"use client";

import ProductImageForm from "@/components/forms/product-image-form";
import ProductInfoForm from "@/components/forms/product-info-form";
import Card from "@/components/ui/cards/card";
import { IImage, ImageResponsePayload } from "@/models";
import React, { useState } from "react";

export default function AddProduct() {
  const [thumbnail, setThumbnail] = useState<
    Pick<IImage, "public_id" | "url" | "is_temp">[]
  >([]);
  const [imageList, setImageList] = useState<
    Pick<ImageResponsePayload, "images">[]
  >([]);

  const getThumbnail = (
    value: Pick<IImage, "public_id" | "url" | "is_temp">[]
  ) => setThumbnail(value);
  const getImageList = (listValue: Pick<ImageResponsePayload, "images">[]) =>
    setImageList(listValue);

  return (
    <div className="flex gap-4 justify-stretch">
      <div className="product-image-form w-[40%] h-full">
        <div className="mb-4">
          <Card>
            <div className="w-full">
              <h2 className="font-semibold text-xl mb-1 text-white">
                Product Images
              </h2>
              <ProductImageForm
                getThumbnail={getThumbnail}
                getImageList={getImageList}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="product-info-form w-[60%] h-full">
        <Card>
          <div className="w-full">
            <h2 className="font-semibold text-xl mb-1 text-white">
              Product Information
            </h2>
            <div>
              <ProductInfoForm thumbnail={thumbnail} imageList={imageList} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
