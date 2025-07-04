"use client";

import { ZwindLogoNotext } from "@/components/ui/logo/zwind-logo-notext";
import { adminSideBarItem } from "./admin-sidebar-item";
import Link from "next/link";
import { Button, Tooltip } from "antd";
import { usePathname } from "next/navigation";

export default function AdminSideBar() {
  const pathName = usePathname();

  return (
    <div className="admin-side-bar max-h-[36rem] h-full">
      <div
        className={`bg-[rgba(26,14,46,.4)] !border-[1.5px] border-solid border-[rgba(86,67,115,.2)] rounded-[4rem] flex flex-col items-center justify-between py-[1rem] px-[1.25rem] h-full`}
      >
        <div className="mb-4">
          <Link href="/" className="flex items-center no-underline">
            <ZwindLogoNotext />
          </Link>
        </div>
        <div className="flex flex-col w-fit">
          {adminSideBarItem.map((item) => (
            <Link key={item.label} href={item.href ?? "#"} passHref>
              <Tooltip placement="right" title={item.label} arrow={false}>
                <Button
                  type="text"
                  shape="circle"
                  size="large"
                  className={`!bg-transparent !border-0  !text-[1rem] !rounded-[4rem] hover:!bg-[rgba(255,255,255,.04)] hover:!border-0 transition ${
                    pathName === item.href ? "!text-[#0984e3] !font-bold" : ""
                  }`}
                >
                  {item.icon}
                </Button>
              </Tooltip>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
