"use client";

import { SignupPayload } from "@/models";
import Link from "next/link";
import { sonnerLoading } from "../sonner/sonner";
import { Button, Form, Input } from "antd";
import FacebookIconSVG from "../../../public/facebook.svg";
import GoogleIconSVG from "../../../public/google.svg";
import Image from "next/image";

export const handleSignup = async (signupData: SignupPayload) => {
  try {
    console.log(signupData);
    // await authApi.signin(singinData);
    return "Login successful!";
  } catch (error) {
    throw error;
  }
};

export function SignupForm() {
  const onFinish = (values: SignupPayload) => {
    sonnerLoading(
      handleSignup(values)
        .then((message) => ({ message }))
        .catch((error) => {
          throw error.response.data.message || "Sign up failed!";
        })
    );

    console.log("Received values:", values);
  };

  return (
    <div className="signin-form w-full max-w-lg py-8 px-16 rounded-[24px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white mx-auto select-none">
      <h2 className="text-xl font-semibold mb-4">Sign up</h2>

      <Form layout="vertical" onFinish={onFinish} size={"large"}>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Input placeholder="First name" className="py-2" />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input placeholder="Last name" className="py-2" />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="username@gmail.com" className="py-2" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" className="py-2" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          className="!bg-[#924dff] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 w-full"
        >
          Sign up
        </Button>
      </Form>

      <div className="text-center my-6 text-[14px]">or continue with</div>

      <div className="flex justify-center gap-4 mb-4">
        <Button
          size="middle"
          className="rounded-md p-2 hover:scale-105 transition"
        >
          <Image src={GoogleIconSVG} alt="google icon" width={20} height={20} />
          Google
        </Button>
        <Button
          size="middle"
          className="rounded-md p-2 hover:scale-105 transition"
        >
          <Image
            src={FacebookIconSVG}
            alt="facebook icon"
            width={20}
            height={20}
          />
          Facebook
        </Button>
      </div>

      <div className="text-center text-[14px]">
        Have an account?{" "}
        <Link
          href={"signin"}
          className="font-semibold text-white hover:text-[#0984e3]"
        >
          Sign in now
        </Link>
      </div>
    </div>
  );
}
