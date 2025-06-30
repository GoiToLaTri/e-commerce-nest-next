import { CustomerFooter } from "@/components/layout/footer";
import { ReactNode } from "react";

export interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div>
      <div className="min-h-screen">{children}</div>
      <CustomerFooter />
    </div>
  );
}
