import { CheckoutHeader } from "@/components/layout/header";
import { GlobalContainer } from "@/components/ui";
import { ReactNode } from "react";

export interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div>
      <CheckoutHeader />
      <div className="pt-[8rem]">
        {/* Padding to account for the fixed header height */}
        <GlobalContainer>{children}</GlobalContainer>
        <div className="pt-[8rem]"></div>
      </div>
    </div>
  );
}
