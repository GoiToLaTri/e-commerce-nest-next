"use client";

import { envConfig } from "@/common/configs";
import { CheckoutPayload } from "@/models";
import {
  Button,
  Cascader,
  Form,
  Input,
  Radio,
  RadioProps,
  Select,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import MomoCircleLogo from "../icon/logo-icon.tsx/momo-circle-logo";
import "@/styles/payment-select.style.css";
import { useRouter } from "next/navigation";
import { useUpdateCheckoutSession } from "@/hooks/useUpdateCheckoutSession";
import { sonnerError, sonnerLoading } from "../sonner/sonner";
import { usePaymentMomo } from "@/hooks/usePaymentMomo";
const { Option } = Select;

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

interface CheckoutFormProps {
  handleSetShippingFee?: (value: number) => void;
  sessionId?: string;
}

export function CheckoutForm({
  handleSetShippingFee,
  sessionId,
}: CheckoutFormProps) {
  const [regions, setRegions] = useState<Option[]>([]);
  const [btnConfirmLoading, setBtnConfirmLoading] = useState<boolean>(false);
  const [countryCodes, setCountryCodes] = useState<
    { value: string; label: string }[]
  >([]);

  const updateCheckoutSessionMutation = useUpdateCheckoutSession();
  const paymentMomoMutation = usePaymentMomo();
  // Ensure unique country codes by value
  const uniqueCountryCodes = countryCodes
    .filter(
      (code, index, self) =>
        index === self.findIndex((c) => c.value === code.value)
    )
    .map((code) => ({
      ...code,
      label: `(${code.label}) ${code.value}`,
    }));

  const [form] = Form.useForm();
  const router = useRouter();
  const onFinish = async (values: CheckoutPayload) => {
    setBtnConfirmLoading(true);
    const shippingFee = values.delivery === "shipping" ? 40000 : 0;
    const payload = {
      shippingInfo: {
        fullName: values.fullname,
        address: values.address,
        phone: `${values.phone?.countrycode || ""}${
          values.phone?.number || ""
        }`,
        delivery: values.delivery,
        shippingfee: shippingFee,
      },
      paymentMethod: values.paymentMethod,
    };

    if (!sessionId) {
      sonnerError("Session invalid");
      return;
    }

    sonnerLoading(
      updateCheckoutSessionMutation
        .mutateAsync({
          ...payload,
          sessionId,
        })
        .then(async (message) => {
          const res = await paymentMomoMutation.mutateAsync();
          // console.log(res);
          router.replace(res.shortLink);
          setBtnConfirmLoading(false);
          return { message };
        })
        .catch((error) => {
          setBtnConfirmLoading(false);
          throw error.response.data.message || "Update session failed!";
        })
    );
  };

  const fetchRegionJson = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return res.json();
  };

  const fetchCountryCodeJson = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return res.json();
  };

  useEffect(() => {
    (async () => {
      // console.log("env", envConfig.FRONTEND_URL);

      const data = await fetchRegionJson(
        `${envConfig.FRONTEND_URL}/json/region.json`
      );
      const countryCodesData = await fetchCountryCodeJson(
        `${envConfig.FRONTEND_URL}/json/CountryCodes.json`
      );
      setRegions(data);
      setCountryCodes(countryCodesData);
    })();
  }, []);

  const handleBack = () => {
    router.back();
  };

  // const onChange: CascaderProps<Option>["onChange"] = (value) => {
  //   console.log(value);
  // };

  const deliveryChange: RadioProps["onChange"] = (event) => {
    const delivery: "shipping" | "pickup" = event.target.value;
    const shippingFee = delivery === "shipping" ? 40000 : 0;

    // Chỉ update nếu giá trị thay đổi để tránh render lặp
    if (form.getFieldValue("shippingfee") !== shippingFee)
      if (handleSetShippingFee) handleSetShippingFee(shippingFee);
  };

  const popupRender = (menus: React.ReactNode) => (
    <div>
      <div className="custom-scrollbar-sidebar">{menus}</div>
      <style jsx global>
        {`
          .custom-scrollbar-sidebar .ant-cascader-menu::-webkit-scrollbar {
            width: 0px;
          }

          .custom-scrollbar-sidebar
            .ant-cascader-menu::-webkit-scrollbar-track {
            background: #f3f4f6;
          }

          .custom-scrollbar-sidebar
            .ant-cascader-menu::-webkit-scrollbar-thumb {
            background-color: #d4d4d4;
            border-radius: 20px;
          }

          .dark
            .custom-scrollbar-sidebar
            .ant-cascader-menu::-webkit-scrollbar-track {
            background: #18181b;
          }

          .dark
            .custom-scrollbar-sidebar
            .ant-cascader-menu::-webkit-scrollbar-thumb {
            background-color: #4b5563;
          }

          .custom-scrollbar-sidebar .ant-cascader-menu {
            scrollbar-width: none;
            scrollbar-color: #d4d4d4 #f3f4f6;
          }

          .dark .custom-scrollbar-sidebar .ant-cascader-menu {
            scrollbar-color: #4b5563 #18181b;
          }
        `}
      </style>
    </div>
  );

  return (
    <div className="w-full select-none">
      <h2 className="text-xl font-semibold mb-4">Payment information</h2>
      <style jsx global>
        {`
          .country-select .ant-select-selector {
            background: transparent !important;
            border-color: rgba(255, 255, 255, 0.04) !important;
          }
        `}
      </style>
      <Form layout="vertical" onFinish={onFinish} form={form} size={"large"}>
        <Form.Item name="delivery" initialValue={"shipping"}>
          <Radio.Group
            className="custom-delivery-ratio !w-full"
            onChange={deliveryChange}
            options={[
              {
                value: "shipping",
                label: <div> Get delivered in only 30 minutes</div>,
              },
              {
                value: "pickup",
                label: <div>Pickup available in 4 stores near you</div>,
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Consignee"
          name="fullname"
          rules={[
            { required: true, message: "Please input full name" },
            { min: 2, message: "Full name must be at least 2 characters" },
          ]}
        >
          <Input
            placeholder="Please input full name"
            className="!bg-[rgba(255,255,255,.05)] !outline-0 !border-[rgba(255,255,255,0.04)] rounded-md"
          />
        </Form.Item>
        <Form.Item
          label="Shipping address"
          name="address"
          rules={[{ required: true, message: "Please select region" }]}
        >
          <Cascader
            options={regions}
            // onChange={onChange}
            placeholder="Please select region"
            popupRender={popupRender}
            className="!bg-[rgba(255,255,255,.05)] !outline-0 !border-[rgba(255,255,255,0.04)] country-select rounded-md"
          />
        </Form.Item>

        <Form.Item label="Phone">
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name={["phone", "countrycode"]}
              noStyle
              rules={[{ required: true, message: "Country code is required" }]}
            >
              <Select
                showSearch
                placeholder="Country code"
                style={{ width: 120 }}
                options={uniqueCountryCodes}
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="!bg-[rgba(255,255,255,.05)] !outline-0 !border-[rgba(255,255,255,0.04)] country-select rounded-md"
              />
            </Form.Item>
            <Form.Item
              name={["phone", "number"]}
              noStyle
              rules={[
                { required: true, message: "Phone number is required" },
                { pattern: /^[0-9]{6,15}$/, message: "Invalid phone number" },
              ]}
            >
              <Input
                placeholder="Phone number"
                style={{ width: "100%" }}
                className="!bg-[rgba(255,255,255,.05)] !outline-0 !border-[rgba(255,255,255,0.04)] rounded-md"
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label="Payment method"
          name="paymentMethod"
          initialValue={"momo"}
          className="mb-6"
        >
          <Radio.Group
            style={{ display: "flex", gap: 8 }}
            className="radio-custom"
            options={[
              {
                value: "momo",
                label: <MomoCircleLogo width={32} height={32} />,
              },
            ]}
          />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea
            placeholder="Optional notes..."
            className="py-2 !bg-[rgba(255,255,255,.05)] !outline-0 !border-[rgba(255,255,255,0.04)] rounded-md"
          />
        </Form.Item>

        <div className="flex gap-4">
          <Button onClick={handleBack} disabled={btnConfirmLoading}>
            Back
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            className="!bg-[#924dff] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
            loading={btnConfirmLoading}
          >
            Confirm payment
          </Button>
        </div>
      </Form>
    </div>
  );
}
