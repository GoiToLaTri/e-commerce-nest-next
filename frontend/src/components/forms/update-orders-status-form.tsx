"use client";

import { IOrder } from "@/models";
import { Button, Form, Select } from "antd";
import { sonnerLoading } from "../sonner/sonner";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import { useRouter } from "next/navigation";
const { Option } = Select;

export interface UpdateOrdersStatusFormProps {
  data: IOrder;
  handleCancel: () => void;
}

export function UpdateOrdersStatusForm({
  data,
  handleCancel,
}: UpdateOrdersStatusFormProps) {
  const router = useRouter();
  const validOrderStatus = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const onFinish = (values: {
    orderStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  }) => {
    sonnerLoading(
      updateOrderStatusMutation
        .mutateAsync({
          id: data.id,
          payload: values,
        })
        .then((message) => {
          router.refresh();
          handleCancel();
          return { message };
        })
        .catch((error) => {
          throw error.response.data.message || "Update status failed!";
        })
    );

    // console.log("Received values:", values);
  };

  return (
    <div>
      <Form size="large" layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="orderStatus"
          label="Order status"
          initialValue={data.orderStatus}
        >
          <Select placeholder="Select a option and change input text above">
            {validOrderStatus.map((value, index) => (
              <Option value={value} key={value + "-" + index}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          className="!bg-[#924dff] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
        >
          Save
        </Button>
      </Form>
    </div>
  );
}
