"use client";

import { CheckCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export function PaymentResultSuccess() {
  const router = useRouter();
  const handleNav = () => {
    router.replace("/");
  };

  return (
    <div className="mx-auto max-w-[36rem] w-full">
      <CheckCircleOutlined
        style={{
          fontSize: "8rem",
          color: "#52c41a",
        }}
      />
      <h2 className="text-3xl font-bold text-green-400 mt-4">
        Payment Successful!
      </h2>
      <p className="text-white/80 mt-2 text-lg">
        Thank you for your purchase. Your transaction has been completed
        successfully.
      </p>
      <button
        className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors duration-300"
        onClick={handleNav}
      >
        Continue Shopping
      </button>
    </div>
  );
}
