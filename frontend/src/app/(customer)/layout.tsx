import { NavigationBar } from "@/components/layout/header";
import { GlobalContainer } from "@/components/ui";
import { ReactNode } from "react";

export interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div>
      <NavigationBar />
      <div className="pt-[8rem]">
        {/* Padding to account for the fixed header height */}
        <GlobalContainer>{children}</GlobalContainer>
      </div>
    </div>
  );
}
