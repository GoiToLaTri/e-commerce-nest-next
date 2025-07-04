import { ReactNode } from "react";
import "@/styles/authlayout.style.css";
import { RoleAccess } from "@/store";
import { Role } from "@/common/enums";

export interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <RoleAccess roles={[Role.GUEST]} routeAuth={true}>
      <div className="auth-layout h-screen">{children}</div>
    </RoleAccess>
  );
}
