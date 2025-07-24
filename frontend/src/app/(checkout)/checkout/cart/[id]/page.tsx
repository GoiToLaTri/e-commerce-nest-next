"use client";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { GoneError } from "@/components/results/gone-error";
import { LoadingSpin } from "@/components/ui";
import Card from "@/components/ui/cards/card";
import { useGetCheckOutSession } from "@/hooks/useGetCheckoutSession";
import { convertNumberToCurrency } from "@/utils/currency.util";
import { FormProps, Descriptions, Divider, Form, Button, Input } from "antd";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";

type FieldType = {
  couponcode?: string;
};

export default function CheckoutCartItemPage() {
  const { data, isLoading, isError, error, refetch } = useGetCheckOutSession();
  const [shippingFee, setShippingFee] = useState<number>(40000);
  const isBrowser = typeof window !== "undefined";

  const getInitialCountdown = () => {
    if (!isBrowser) return 0;
    const expiredAtStr = localStorage.getItem("checkoutSessionExpiredAt");
    if (!expiredAtStr) return 0;

    const expiredAtMs = new Date(expiredAtStr).getTime();
    const diffSeconds = Math.max(
      Math.floor((expiredAtMs - Date.now()) / 1000),
      0
    );
    return diffSeconds;
  };

  const [countdown, setCountdown] = useState<number>(getInitialCountdown);

  // Cập nhật localStorage khi data mới về
  useEffect(() => {
    if (data?.expiredAt) {
      localStorage.setItem("checkoutSessionExpiredAt", data.expiredAt);

      const expiredAtMs = new Date(data.expiredAt).getTime();
      const diffSeconds = Math.max(
        Math.floor((expiredAtMs - Date.now()) / 1000),
        0
      );
      setCountdown(diffSeconds);
    }
  }, [data]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      refetch();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, refetch]);

  if (isLoading) return <LoadingSpin />;

  if (!isLoading && isError && (error as { status?: number })?.status === 410)
    return <GoneError message="Checkout session has expired" />;

  if (!isLoading && isError && (error as { status?: number })?.status === 404)
    notFound();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleSetShippingFee = (value: number) => {
    setShippingFee(value);
  };

  return (
    <div className="flex gap-4">
      <div className="expire-time flex h-fit max-w-[220px]">
        <Card>
          <div>
            <div className="flex items-center mb-4">
              <span className="text-white font-medium mr-2">
                Session expire in:
              </span>
              <span className="bg-[#2d2d2d] text-[#924dff] px-3 py-1 rounded font-mono text-lg">
                {Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="text-red-600 font-semibold text-sm mt-2">
              ⚠️ Note: Please complete your payment{" "}
              <span className="font-bold">
                within 30 minutes after confirming your checkout
              </span>{" "}
              to avoid automatic order cancellation.
            </div>
          </div>
        </Card>
      </div>
      <div className="form-checkout w-[60%]">
        <Card>
          <CheckoutForm
            handleSetShippingFee={handleSetShippingFee}
            sessionId={data?.id}
          />
        </Card>
      </div>
      <div className="order-summary w-[40%]">
        <Card>
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Order summary</h2>
            {data?.products.map((product) => (
              <div key={product.model} className="pb-4">
                <Descriptions column={3}>
                  <Descriptions.Item span={2}>
                    x{product.quantity} {product.model}
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{ textAlign: "right", width: "100%" }}>
                      {convertNumberToCurrency(product.price)}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ))}
            <Divider />
            <Descriptions column={1}>
              <Descriptions.Item label="Delivery">
                <div style={{ textAlign: "right", width: "100%" }}>
                  {convertNumberToCurrency(shippingFee)}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                <div style={{ textAlign: "right", width: "100%" }}>
                  {convertNumberToCurrency(0)}
                </div>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions column={1}>
              <Descriptions.Item label="Total (exc tax)">
                <div style={{ textAlign: "right", width: "100%" }}>
                  {convertNumberToCurrency(
                    (data?.totalAmount || 0) + shippingFee
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Tax">
                <div style={{ textAlign: "right", width: "100%" }}>
                  {convertNumberToCurrency(0)}
                </div>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Form
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="inline"
              size="large"
              style={{
                width: "100%",
              }}
            >
              <Form.Item style={{ flexGrow: "1" }} name="couponcode">
                <Input placeholder="Please input coupon code" />
              </Form.Item>
              <Form.Item style={{ marginRight: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="!bg-[#924dff] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
