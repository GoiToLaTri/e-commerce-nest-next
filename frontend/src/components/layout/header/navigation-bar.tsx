"use client";

import { DropdownMenu, GlobalContainer, ZwindLogo } from "@/components/ui";
import { CaretDownOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import { ReactNode } from "react";
import { customerNavItem } from "./customer-nav-item";
import { usePathname } from "next/navigation";

export interface NavigationBarProps {
  children: ReactNode;
}

export function NavigationBar() {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <header className="customer-navigation-bar w-full pt-[1.5rem] pb-[1rem] fixed z-[99] my-0 mx-auto">
      <GlobalContainer>
        <div className="bg-[rgba(26,14,46,.4)] !border-[1.5px] border-solid border-[rgba(86,67,115,.2)] rounded-[4rem] flex items-center justify-between py-[1rem] px-[1.25rem]">
          <Link href="/" className="flex items-center no-underline">
            <ZwindLogo />
          </Link>
          <nav className="flex items-center justify-center gap-[2.25rem]">
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
                      className={`!text-[1rem] !rounded-[4rem] flex items-center gap-[0.5rem]`}
                    >
                      {item.label}
                      <CaretDownOutlined />
                    </Button>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href ?? "#"}
                    passHref
                    legacyBehavior
                  >
                    <Button
                      type="text"
                      className={`!text-[1rem] !rounded-[4rem]  ${
                        pathName === item.href
                          ? "!text-[#0984e3] !font-bold"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </nav>
          <div className="flex items-center gap-[1rem]">
            <Link href="/auth/signup" passHref legacyBehavior>
              <Button
                type="primary"
                size="large"
                className="!text-[1rem] !rounded-[4rem] !bg-gradient-to-r !from-purple-600 !to-blue-600 !border-0 !shadow-lg hover:!from-blue-600 hover:!to-purple-600 transition-all duration-300"
              >
                Signup/Signin
              </Button>
            </Link>
          </div>
        </div>
      </GlobalContainer>
    </header>
  );
}
