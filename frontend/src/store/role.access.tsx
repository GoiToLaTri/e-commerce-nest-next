"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthData } from "./auth.store";
import GlobalLoading from "@/app/loading";
import { AccessDenied, ServerError } from "@/components/results";
import { useRouter } from "next/navigation";
import { Role } from "@/common/enums";

interface RoleAccessProps {
  children: ReactNode;
  roles: Role[];
  routeAuth?: boolean | false;
}

const pathLogin = "/auth/signin";
const pathLoginSuccess = "/";

export function RoleAccess({ children, roles, routeAuth }: RoleAccessProps) {
  const authData = AuthData();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAccess, setIsAccess] = useState<{
    isLogin: boolean | null;
    isPermission: boolean | null;
  }>({
    isLogin: null,
    isPermission: null,
  });
  const [isServerError, setIsServerError] = useState<boolean>(false);

  // console.log("isAccess", isAccess);
  // console.log("isServerError", isServerError);

  useEffect(() => {
    const getDataIsAccess = async () => {
      const isAccess = await authData?.getIsAccess(roles);
      if (isAccess.isServerError) {
        setIsAccess({
          isLogin: null,
          isPermission: null,
        });
        return setIsServerError(true);
      }
      return setIsAccess(isAccess);
    };

    getDataIsAccess();
  }, [roles, authData]);

  useEffect(() => {
    if (
      routeAuth !== true &&
      isAccess.isLogin === false &&
      isAccess.isPermission === false
    ) {
      setIsRedirecting(true);
      router.push(pathLogin);
    }
  }, [isAccess, authData, routeAuth, router]);

  useEffect(() => {
    if (routeAuth === true && isAccess.isLogin === true) {
      setIsRedirecting(true);
      router.push(pathLoginSuccess);
      // router.back();
    }
  }, [isAccess, authData, routeAuth, router]);

  const isAccessNull =
    isAccess.isLogin === null && isAccess.isPermission === null;

  const routeAccessDeniedConditions =
    isAccess.isLogin === true && isAccess.isPermission === false;

  // const privateAccessConditions =
  //   isAccess.isPermission === true && isAccess.isLogin === true;

  // const routeAuthConditions =
  //   isAccess.isLogin === false && isAccess.isPermission === false;

  //---------------------------------------------
  // const roleAccessConditions = routeAuth
  //   ? routeAuthConditions
  //   : privateAccessConditions;

  // console.log("roleAccessConditions", roleAccessConditions);
  // console.log("routeAccessDeniedConditions", routeAccessDeniedConditions);
  // console.log("isServerError", isServerError);

  if (isRedirecting || isAccessNull) return <GlobalLoading />;
  if (isServerError) return <ServerError />;
  if (routeAccessDeniedConditions) return <AccessDenied />;

  return <>{children}</>;

  // return (
  //   <>
  //     {/* {roleAccessConditions && children}
  //     {!isServerError && isAccessNull && <GlobalLoading />}
  //     {isServerError && <ServerError />}
  //     {routeAccessDeniedConditions && <AccessDenied />} */}

  //   </>
  // );
}
