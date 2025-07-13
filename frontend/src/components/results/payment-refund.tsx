"use client";

import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export function PaymentResultRefund() {
  const router = useRouter();
  const handleNav = () => {
    router.replace("/customer/order");
  };
  return (
    <div className="mx-auto max-w-[36rem] w-full">
      <div className="mx-auto max-w-[36rem] w-full">
        <SyncOutlined
          style={{
            fontSize: "8rem",
            color: "#faad14",
          }}
        />
        <h2 className="text-3xl font-bold text-yellow-400 mt-4">
          Payment Refunded
        </h2>
        <p className="text-white/80 mt-2 text-lg">
          Your payment has been successfully refunded. The refunded amount will
          appear in your account soon.
        </p>
        <button
          className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors duration-300"
          onClick={handleNav}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
