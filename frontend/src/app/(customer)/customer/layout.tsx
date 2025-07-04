import { RoleAccess } from "@/store";
import { ReactNode } from "react";
import { Role } from "@/common/enums";
import { CustomerFooter } from "@/components/layout/footer";

export interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <RoleAccess roles={[Role.USER]}>
      <div className="h-screen">{children}</div>
      <CustomerFooter />
    </RoleAccess>
  );
}
