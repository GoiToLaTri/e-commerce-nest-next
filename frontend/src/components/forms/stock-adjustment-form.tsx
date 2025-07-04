"use client";

import { StockAdjustmentPayload } from "@/models";
import { useEffect } from "react";
import { sonnerLoading } from "../sonner/sonner";
import { Button, Form, Input, InputNumber } from "antd";
import { useInventory } from "@/hooks/useInventory";
import { useRouter } from "next/navigation";
import { useStockAdjustment } from "@/hooks/useStockAdjustment";

export function StockAdjustmentForm({ id }: { id: string }) {
  const [form] = Form.useForm();
  const { data } = useInventory(id);
  const router = useRouter();
  const stockImportMutation = useStockAdjustment();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        product: data.product?.model,
        system_stock: data.quantity,
      });
    }
  }, [data, form]);

  const onFinish = async (values: StockAdjustmentPayload) => {
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
          throw error.response.data.message || "Stock adjustment failed!";
        })
    );
  };

  return (
    <div className="w-full select-none">
      <h2 className="text-xl font-semibold mb-4">Stock Adjustment Form</h2>

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
          label="System stock"
          name="system_stock"
          rules={[{ required: true, message: "Please enter a product!" }]}
        >
          <Input placeholder="Enter a product" className="py-2" disabled />
        </Form.Item>

        <Form.Item
          label="Actual stock"
          name="actual_stock"
          rules={[
            { required: true, message: "Please enter the actual stock!" },
          ]}
        >
          <InputNumber
            placeholder="Enter actual stock"
            className="py-2 !w-full"
            min={1}
          />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea placeholder="Optional notes..." className="py-2" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          className="!bg-[#924dff] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 w-full"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
