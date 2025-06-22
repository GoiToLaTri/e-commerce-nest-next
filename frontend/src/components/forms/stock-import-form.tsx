"use client";

import { StockImportPayload } from "@/models";
import React, { useEffect } from "react";
import { sonnerLoading } from "../sonner/sonner";
import { Button, Form, Input, InputNumber } from "antd";
import { useInventory } from "@/hooks/useInventory";
import { useRouter } from "next/navigation";
import { useStockImport } from "@/hooks/useStockImport";

export default function StockImportForm({ id }: { id: string }) {
  const [form] = Form.useForm();
  const { data } = useInventory(id);
  const router = useRouter();
  const stockImportMutation = useStockImport();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        product: data.product?.model,
      });
    }
  }, [data, form]);

  const onFinish = async (values: StockImportPayload) => {
    sonnerLoading(
      stockImportMutation
        .mutateAsync({
          ...values,
          productId: data?.product.id || "",
        })
        .then((message) => {
          router.push("/admin/inventory");
          return { message };
        })
        .catch((error) => {
          throw error.response.data.message || "Stock import failed!";
        })
    );
    // try {
    //   await stockImportMutation.mutateAsync({
    //     ...values,
    //     productId: data?.product.id || "",
    //   });

    //   // Navigate sau khi mutation thành công
    //   router.push("/admin/inventory/");
    // } catch (error) {
    //   console.error("Import error:", error);
    // }
  };

  return (
    <div className="w-full select-none">
      <h2 className="text-xl font-semibold mb-4">Stock Import Form</h2>

      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        size={"large"}
        initialValues={{
          product: data?.product.model,
        }}
      >
        <Form.Item
          label="Product"
          name="product"
          rules={[{ required: true, message: "Please enter a product!" }]}
        >
          <Input placeholder="Enter a product" className="py-2" disabled />
        </Form.Item>

        <Form.Item
          label="Supplier"
          name="supplier"
          rules={[{ required: true, message: "Please enter a supplier!" }]}
        >
          <Input placeholder="Enter a supplier" className="py-2" />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter the quantity!" }]}
        >
          <InputNumber
            placeholder="Enter quantity"
            className="py-2 !w-full"
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="Purchase Price"
          name="price"
          rules={[
            { required: true, message: "Please enter the purchase price!" },
          ]}
        >
          <InputNumber placeholder="Enter price" className="py-2 !w-full" />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea placeholder="Optional notes..." className="py-2" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          className="w-full bg-blue-900 hover:bg-blue-800 h-10 rounded-md"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
