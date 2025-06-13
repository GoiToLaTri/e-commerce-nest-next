"use client";

import { GlobalContainer, ZwindLogo } from "@/components/ui";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { adminSideBarItem } from "../sidebar/admin-sidebar-item";

export default function AdminHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header className="admin-header w-full pt-[1.5rem] pb-[1rem] fixed z-[99] my-0 mx-auto">
      <GlobalContainer>
        <div
          className={`bg-[rgba(26,14,46,.4)] !border-[1.5px] border-solid border-[rgba(86,67,115,.2)] rounded-[4rem] flex items-center justify-between py-[1rem] px-[1.25rem] transition-all duration-300 ${
            isScrolled ? "backdrop-blur-md bg-[rgba(26,14,46,.8)]" : ""
          }`}
        >
          <div className="font-bold tracking-[1.6] text-xl">
            {adminSideBarItem.find((item) => pathName === item.href)?.label ||
              "Zwind"}
          </div>
          <ZwindLogo />
        </div>
      </GlobalContainer>
    </header>
  );
}
