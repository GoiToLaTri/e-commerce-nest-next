import { Role } from "@/common/enums";
import { RoleAccess } from "@/store";
import { ReactNode } from "react";

export interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleAccess roles={[Role.ADMIN]}>
      AdminLayout
      {children}
    </RoleAccess>
  );
}
