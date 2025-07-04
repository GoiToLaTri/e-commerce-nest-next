import { CustomerFooter } from "@/components/layout/footer";
import React, { ReactNode } from "react";

export interface ProductLayoutProps {
  children: ReactNode;
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <div>
      {children}
      <CustomerFooter />
    </div>
  );
}
