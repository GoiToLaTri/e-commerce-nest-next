"use client";

import { productApi } from "@/api-client";
import { IImage, ImageResponsePayload, ProductInfoPayload } from "@/models";
import { Button, Form, Input, InputNumber } from "antd";
import React from "react";
import { sonnerLoading } from "../sonner/sonner";

export interface ProductInfoFormProps {
  thumbnail?: Pick<IImage, "public_id" | "url" | "is_temp">[];
  imageList?: Pick<ImageResponsePayload, "images">[];
}

const handleAdd = async (
  data: ProductInfoPayload & {
    thumbnail: Pick<IImage, "public_id" | "url" | "is_temp">[];
    imageList: Pick<ImageResponsePayload, "images">[];
  }
) => {
  try {
    await productApi.addProduct(data);
    return "Product created";
  } catch (error) {
    throw error;
  }
};

export default function ProductInfoForm({
  thumbnail,
  imageList,
}: ProductInfoFormProps) {
  const onFinish = (payload: ProductInfoPayload) => {
    console.log(thumbnail);
    sonnerLoading(
      handleAdd({
        ...payload,
        thumbnail:
          thumbnail?.map((tn) => ({
            is_temp: false,
            public_id: tn.public_id,
            url: tn.url,
          })) || [],
        imageList:
          imageList?.map((image) => ({
            images: image.images.map((img) => ({
              id: "",
              public_id: img.public_id,
              url: img.url,
              is_temp: false,
              is_thumbnail: false,
            })),
          })) || [],
      })
        .then((message) => ({ message }))
        .catch((error) => {
          throw new Error(error.message || "Add product failed!");
        })
    );
  };

  return (
    <Form layout="vertical" onFinish={onFinish} size={"large"}>
      <h3 className="font-semibold text-lg">Basic Information</h3>
      <Form.Item
        label="Brand"
        name="brand"
        rules={[{ required: true, message: "Please input the brand!" }]}
        tooltip="Enter the product's brand, e.g., GIGABYTE"
      >
        <Input placeholder="GIGABYTE" className="py-2" />
      </Form.Item>

      <Form.Item
        label="Model"
        name="model"
        rules={[{ required: true, message: "Please input the model!" }]}
        tooltip="Enter the product's model name or number"
      >
        <Input placeholder="GIGABYTE GAMING A16 PRO DYH" className="py-2" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input the description!" }]}
        tooltip="Provide a brief description of the product"
      >
        <Input.TextArea placeholder="Description" className="py-2" rows={3} />
      </Form.Item>
      <h3 className="font-semibold text-lg">Specification</h3>
      <Form.Item
        label="CPU"
        name="cpu"
        rules={[{ required: true, message: "Please input the CPU!" }]}
        tooltip="Specify the CPU model, e.g., AMD Ryzen 7 7840HS"
      >
        <Input placeholder="AMD Ryzen 7 7840HS" className="py-2" />
      </Form.Item>

      <Form.Item
        label="GPU"
        name="gpu"
        rules={[{ required: true, message: "Please input the GPU!" }]}
        tooltip="Specify the GPU model, e.g., AMD Radeon RX 9060 XT 16GB"
      >
        <Input placeholder="AMD Radeon RX 9060 XT 16GB" className="py-2" />
      </Form.Item>

      <Form.Item
        label="Display"
        name="display"
        rules={[{ required: true, message: "Please input the display!" }]}
        tooltip='Describe the display, e.g., 16.1" 16:9 IPS (1920x1080) 144Hz, 3ms, 100% sRGB, 250nits'
      >
        <Input
          placeholder='16" 16:10 IPS (2560×1600) 165Hz, 3ms, 100% sRGB, 400nits'
          className="py-2"
        />
      </Form.Item>

      <Form.Item
        label="RAM"
        name="ram"
        rules={[{ required: true, message: "Please input the RAM!" }]}
        tooltip="Specify RAM details, e.g., 2x 32GB LPDDR5x 7500MHz"
      >
        <Input
          placeholder="2x 32GB LPDDR5x 7500MHz, up to 64GB"
          className="py-2"
        />
      </Form.Item>

      <Form.Item
        label="Storage"
        name="storage"
        rules={[{ required: true, message: "Please input the storage!" }]}
        tooltip="Specify storage details, e.g., 1x 512GB PCIe Gen4 NVMe TLC M.2 SSD, up to 2TB, 2x M.2 slots"
      >
        <Input
          placeholder="2x 256GB PCIe Gen4x4 M.2 slot, up to 4TB PCIe NVMe M.2 SSD, 2x M.2 slots"
          className="py-2"
        />
      </Form.Item>
      <h3 className="font-semibold text-lg">Quanity And Pricing</h3>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please input the quantity!" }]}
        tooltip="Enter the available quantity (must be at least 1)"
      >
        <InputNumber
          placeholder="Enter quantity"
          className="py-2 !w-full"
          min={1}
          step={1}
          type="number"
        />
      </Form.Item>

      <Form.Item
        label="Pricing"
        name="pricing"
        rules={[{ required: true, message: "Please input the pricing!" }]}
        tooltip="Enter the product price in your currency"
      >
        <InputNumber
          placeholder="Enter price"
          className="py-2 !w-full"
          min={0}
          step={0.01}
          type="number"
        />
      </Form.Item>

      <Button
        htmlType="submit"
        type="primary"
        className="w-full bg-blue-900 hover:bg-blue-800 h-10 rounded-md"
      >
        Submit
      </Button>
    </Form>
  );
}
