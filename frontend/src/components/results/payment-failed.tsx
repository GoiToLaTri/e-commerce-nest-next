"use client";

import { CloseCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export function PaymentResultFailed() {
  const router = useRouter();
  const handleNav = () => {
    router.replace("/customer/shopping-cart");
  };
  return (
    <div className="mx-auto max-w-[36rem] w-full">
      <CloseCircleOutlined
        style={{
          fontSize: "8rem",
          color: "#ff4d4f",
        }}
      />
      <h2 className="text-3xl font-bold text-red-400 mt-4">Payment Failed</h2>
      <p className="text-white/80 mt-2 text-lg">
        Unfortunately, your transaction could not be completed. Please try again
        or use a different payment method.
      </p>
      <button
        className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-300"
        onClick={handleNav}
      >
        Try Again
      </button>
    </div>
  );
}
