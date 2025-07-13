import { orderApi } from "@/api-client";
import {
  NotFoundError,
  PaymentResultFailed,
  PaymentResultRefund,
  PaymentResultSuccess,
} from "@/components/results";
import { IOrder } from "@/models";

export interface PaymentResultProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentResult({ params }: PaymentResultProps) {
  const { id } = await params;
  const res = await orderApi.findOne(id);
  const data = (await res.data) as IOrder;
  console.log(data);
  const conditionSuccess =
    data.paymentStatus === "SUCCESS" && data.orderStatus === "PROCESSING";
  const conditionRefund =
    data.paymentStatus === "REFUNDED" && data.orderStatus === "CANCELLED";
  const conditionFailed =
    data.paymentStatus === "FAILED" && data.orderStatus === "CANCELLED";
  const conditionNotFound =
    !data || (!conditionSuccess && !conditionRefund && !conditionFailed);

  if (conditionNotFound) return <NotFoundError />;

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 mx-[8rem] my-[2.4rem] rounded-[24px] g-gradient-to-br from-white/10 to-white/5 backdrop-blur-0 border border-purple-200/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex items-center">
        {conditionSuccess && <PaymentResultSuccess />}
        {conditionFailed && <PaymentResultFailed />}
        {conditionRefund && <PaymentResultRefund />}
      </div>
    </div>
  );
}
