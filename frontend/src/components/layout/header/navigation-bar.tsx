"use client";

import { DropdownMenu, GlobalContainer, ZwindLogo } from "@/components/ui";
import { CaretDownOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { customerNavItem } from "./customer-nav-item";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/common/enums";
import SkeletonAvatar from "antd/es/skeleton/Avatar";
import { authApi } from "@/api-client";

export interface NavigationBarProps {
  children: ReactNode;
}

export function NavigationBar() {
  const pathName = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.USER_SESSION],
    queryFn: async () => {
      const response = await authApi.getUserSession();
      return response.data as { session_user: IUserSession };
    },
  });

  console.log("isLoading", isLoading);
  console.log("data", data);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            {isLoading && <SkeletonAvatar active size={40} />}
            {!isLoading && data && data.session_user.user.avatar && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">
                  {`${data.session_user.user.first_name} ${data.session_user.user.last_name} `}
                </span>
                <Avatar
                  src={data.session_user.user.avatar}
                  size={40}
                  style={{
                    backgroundColor: "#fff",
                  }}
                />
              </div>
            )}
            {!isLoading && !data && (
              <Link href="/auth/signup" passHref legacyBehavior>
                <Button
                  type="primary"
                  size="large"
                  className="!text-[1rem] !rounded-[4rem] !bg-gradient-to-r !from-purple-600 !to-blue-600 !border-0 !shadow-lg hover:!from-blue-600 hover:!to-purple-600 transition-all duration-300"
                >
                  Signup/Signin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </GlobalContainer>
    </header>
  );
}
