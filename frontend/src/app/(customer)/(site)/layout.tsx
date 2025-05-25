import { ReactNode } from "react";

export interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return <div>{children}</div>;
}
