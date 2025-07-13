import { ReactNode } from "react";
import "@/styles/payment-result.style.css";
import { RoleAccess } from "@/store";
import { Role } from "@/common/enums";

interface PaymentResultLayoutProps {
  children: ReactNode;
}

export default function PaymentResultLayout({
  children,
}: PaymentResultLayoutProps) {
  return (
    <RoleAccess roles={[Role.USER]}>
      <div className="payment-result-layout h-screen">{children}</div>
    </RoleAccess>
  );
}
