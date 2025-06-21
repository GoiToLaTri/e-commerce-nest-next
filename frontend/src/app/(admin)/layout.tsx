import { Role } from "@/common/enums";
import { AdminFooter } from "@/components/layout/footer";
import AdminHeader from "@/components/layout/header/admin-header";
import AdminSideBar from "@/components/layout/sidebar/admin-side-bar";
import { GlobalContainer } from "@/components/ui";
import { RoleAccess } from "@/store";
import { ReactNode } from "react";

export interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleAccess roles={[Role.ADMIN]}>
      <div className="h-screen">
        <AdminHeader />
        <div className="fixed top-[50%] translate-y-[-50%] left-4">
          <AdminSideBar />
        </div>
        <div className="pt-[8rem]">
          <GlobalContainer>{children}</GlobalContainer>
        </div>

        <div className="pt-[8rem]">
          <GlobalContainer>
            <AdminFooter />
          </GlobalContainer>
        </div>
      </div>
    </RoleAccess>
  );
}
