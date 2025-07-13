"use client";

import { GlobalContainer, ZwindLogo } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import { Role } from "@/common/enums";
import { CustomerModal } from "@/components/modals";
import Link from "next/link";

export function CheckoutHeader() {
  const { data, isLoading } = useUserSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const haveSession = !isLoading && data && data.session_user.user.avatar;
  const isUser = haveSession && data.session_user.user.roleId === Role.USER;
  return (
    <header className="admin-header w-full pt-[1.5rem] pb-[1rem] fixed z-[99] my-0 mx-auto">
      <GlobalContainer>
        <div
          className={`relativebg-[rgba(26,14,46,.4)] !border-[1.5px] border-solid border-[rgba(86,67,115,.2)] rounded-[4rem] flex items-center justify-between py-[1rem] px-[1.25rem] transition-all duration-300 ${
            isScrolled ? "backdrop-blur-md bg-[rgba(26,14,46,.8)]" : ""
          }`}
        >
          <Link href={"/"}>
            <ZwindLogo />
          </Link>
          <div className="absolute font-bold tracking-[1.6] text-xl left-[50%] translate-x-[-50%]">
            Checkout
          </div>
          {isUser && <CustomerModal data={data} />}
        </div>
      </GlobalContainer>
    </header>
  );
}
