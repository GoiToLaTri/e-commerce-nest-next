import { Form, InputNumber } from "antd";
import React from "react";

export interface QuantityAndPriceProps {
  onFinish: (value: any) => void;
}

export default function QuantityAndPrice({ onFinish }: QuantityAndPriceProps) {
  return (
    <Form layout="vertical" onFinish={onFinish} size={"large"}>
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please input the quantity!" }]}
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
      >
        <InputNumber
          placeholder="Enter price"
          className="py-2 !w-full"
          min={0}
          step={0.01}
          type="number"
        />
      </Form.Item>
    </Form>
  );
}
