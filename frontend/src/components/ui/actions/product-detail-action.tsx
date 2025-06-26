"use client";

import { Role } from "@/common/enums";
import { useUserSession } from "@/hooks/useUserSession";
import { Button} from "antd";
import SkeletonButton from "antd/es/skeleton/Button";
import Link from "next/link";
import React from "react";

export function ProductDetailAction() {
  const { data, isLoading } = useUserSession();
  const haveSession = !isLoading && data && data.session_user.user.avatar;
  const isAdmin = haveSession && data.session_user.user.roleId === Role.ADMIN;
  const isCustomer = haveSession && data.session_user.user.roleId === Role.USER;
  return (
    <div className="flex flex-col gap-4">
      {isLoading && <SkeletonButton />}
      {isLoading && <SkeletonButton />}
      {!haveSession && (
        <div>
          <Link href={"/auth/signin"}>
            <Button
              type="primary"
              size="large"
              className="!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 !py-"
            >
              Sign in to action
            </Button>
          </Link>
        </div>
      )}
      {isCustomer && (
        <div className="flex flex-col gap-4">
          <Button
            type="primary"
            size="large"
            className="!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300 !py-"
          >
            Buy now
          </Button>
          <Button
            type="default"
            size="large"
            className="!rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] !bg-transparent !border !border-[#924dff] !text-[#924dff] hover:!bg-[#f5f0ff] transition-colors duration-300"
          >
            Add to cart
          </Button>
        </div>
      )}
    </div>
  );
}
