"use client";

import { StockExportPayload } from "@/models";
import { useEffect } from "react";
import { sonnerLoading } from "../sonner/sonner";
import { Button, Form, Input, InputNumber } from "antd";
import { useInventory } from "@/hooks/useInventory";
import { useRouter } from "next/navigation";
import { useStockExport } from "@/hooks/useStockExport";

export function StockExportForm({ id }: { id: string }) {
  const [form] = Form.useForm();
  const { data } = useInventory(id);
  const router = useRouter();
  const stockImportMutation = useStockExport();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        product: data.product?.model,
      });
    }
  }, [data, form]);

  const onFinish = async (values: StockExportPayload) => {
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
  };

  return (
    <div className="w-full select-none">
      <h2 className="text-xl font-semibold mb-4">Stock Export Form</h2>

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
          label="Reason"
          name="reason"
          rules={[{ required: true, message: "Please enter the reason!" }]}
        >
          <Input.TextArea placeholder="Reason..." className="py-2" />
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
