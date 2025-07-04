import { ReactNode } from "react";

export interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return <div>{children}</div>;
}
