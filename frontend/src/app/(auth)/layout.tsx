import { ReactNode } from "react";
import "@/styles/authlayout.style.css";
export interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="auth-layout h-screen">{children}</div>;
}
