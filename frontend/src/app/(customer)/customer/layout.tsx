import { RoleAccess } from "@/store";
import { ReactNode } from "react";
import { Role } from "@/common/enums";

export interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <RoleAccess roles={[Role.USER]}>
      <div>{children}</div>
    </RoleAccess>
  );
}
