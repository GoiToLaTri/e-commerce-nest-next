"use client";

import {
  DropdownMenu,
  GlobalContainer,
  PurpleButton,
  ZwindLogo,
} from "@/components/ui";
import { CaretDownOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { customerNavItem } from "./customer-nav-item";
import { usePathname } from "next/navigation";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import { useUserSession } from "@/hooks/useUserSession";
import { Role } from "@/common/enums";
import { AdminModal, CustomerModal } from "@/components/modals";

export interface NavigationBarProps {
  children: ReactNode;
}

export function NavigationBar() {
  const pathName = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data, isLoading } = useUserSession();

  // console.log("isLoading", isLoading);
  // console.log("data", data);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const haveSession = !isLoading && data && data.session_user.user.avatar;
  const isAdmin = haveSession && data.session_user.user.roleId === Role.ADMIN;
  const isCustomer = haveSession && data.session_user.user.roleId === Role.USER;

  return (
    <header className="customer-navigation-bar w-full pt-[1.5rem] pb-[1rem] fixed z-[99] my-0 mx-auto">
      <GlobalContainer>
        <div
          className={`bg-[rgba(26,14,46,.4)] !border-[1.5px] border-solid border-[rgba(86,67,115,.2)] rounded-[4rem] flex items-center justify-between py-[1rem] px-[1.25rem] transition-all duration-300 ${
            isScrolled ? "backdrop-blur-md bg-[rgba(26,14,46,.8)]" : ""
          }`}
        >
          <Link href="/" className="flex items-center no-underline">
            <ZwindLogo />
          </Link>
          <nav className="flex items-center justify-center gap-[2.25rem] absolute left-[50%] translate-x-[-50%]">
            <div className="flex items-center justify-center gap-[1.5rem]">
              {customerNavItem.map((item) =>
                item.dropdown ? (
                  <DropdownMenu
                    key={item.label}
                    menu={{
                      items: item.dropdown.map((sub) => ({
                        key: sub.href,
                        label: <Link href={sub.href}>{sub.label}</Link>,
                      })),
                    }}
                  >
                    <Button
                      type="text"
                      className={`!bg-transparent !border-0 !text-[1rem] !rounded-[4rem] flex items-end gap-[0.5rem] hover:!border-0 hover:!bg-[rgba(255,255,255,.04)]`}
                    >
                      {item.label}
                      <CaretDownOutlined />
                    </Button>
                  </DropdownMenu>
                ) : (
                  <Link key={item.label} href={item.href ?? "#"} passHref>
                    <Button
                      type="text"
                      className={`!bg-transparent !border-0 !text-[1rem] !rounded-[4rem] ${
                        pathName === item.href
                          ? "!text-[#0984e3] !font-bold"
                          : ""
                      } hover:!border-0 hover:!bg-[rgba(255,255,255,.04)]`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </nav>
          <div className="flex items-center gap-[1rem]">
            {isLoading && <SkeletonAvatar size={40} />}
            {isAdmin && <AdminModal data={data} />}
            {isCustomer && <CustomerModal data={data} />}
            {!isLoading && !data && (
              <Link href="/auth/signup" passHref>
                <PurpleButton>Signup/Signin</PurpleButton>
              </Link>
            )}
          </div>
        </div>
      </GlobalContainer>
    </header>
  );
}
