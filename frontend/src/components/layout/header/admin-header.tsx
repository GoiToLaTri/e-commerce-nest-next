"use client";

import { GlobalContainer, ZwindLogo } from "@/components/ui";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { adminSideBarItem } from "../sidebar/admin-sidebar-item";
import { useUserSession } from "@/hooks/useUserSession";
import { Role } from "@/common/enums";
import AdminModal from "@/components/modals/admin-modal";

export default function AdminHeader() {
  const { data, isLoading } = useUserSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const haveSession = !isLoading && data && data.session_user.user.avatar;
  const isAdmin = haveSession && data.session_user.user.roleId === Role.ADMIN;
  return (
    <header className="admin-header w-full pt-[1.5rem] pb-[1rem] fixed z-[99] my-0 mx-auto">
      <GlobalContainer>
        <div
          className={`relativebg-[rgba(26,14,46,.4)] !border-[1.5px] border-solid border-[rgba(86,67,115,.2)] rounded-[4rem] flex items-center justify-between py-[1rem] px-[1.25rem] transition-all duration-300 ${
            isScrolled ? "backdrop-blur-md bg-[rgba(26,14,46,.8)]" : ""
          }`}
        >
          <ZwindLogo />
          <div className="absolute font-bold tracking-[1.6] text-xl left-[50%] translate-x-[-50%]">
            {adminSideBarItem.find((item) => pathName === item.href)?.label ||
              "Zwind"}
          </div>
          {isAdmin && <AdminModal data={data} />}
        </div>
      </GlobalContainer>
    </header>
  );
}
