"use client";

import { IImage } from "@/models";
import { Image } from "antd";
import React from "react";

export interface ProductImagePreviewProps {
  images: IImage[];
}

export default function ProductImagePreview({
  images,
}: ProductImagePreviewProps) {
  return (
    <Image.PreviewGroup
      // preview={{
      //   onChange: (current, prev) =>
      //     console.log(`current index: ${current}, prev index: ${prev}`),
      // }}
    >
      {images.map((image) => (
        <Image
          src={image.url}
          width={100}
          alt={`product-${image.id}`}
          key={image.id}
        />
      ))}
    </Image.PreviewGroup>
  );
}
