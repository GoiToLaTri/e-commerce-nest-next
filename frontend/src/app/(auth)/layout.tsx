import { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      AuthLayout
      <div>{children}</div>
    </div>
  );
}
