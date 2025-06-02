"use client";

import { useEffect, useState, ReactNode } from "react";
import { AuthData } from "./auth.store";
import { Role } from "@/common/enums";

interface RoleAccessProps {
  children: ReactNode;
  roles: Role[];
  error?: ReactNode;
}

export function ViewAccess({ children, roles, error }: RoleAccessProps) {
  const authData = AuthData();
  //console.log("authContext", authContext);

  const [isAccess, setIsAccess] = useState<{
    isLogin: boolean | null;
    isPermission: boolean | null;
  }>({
    isLogin: null,
    isPermission: null,
  });

  // console.log("isAccess", isAccess);
  // console.log("isServerError", isServerError);

  useEffect(() => {
    const getDataIsAccess = async () => {
      const isAccess = await authData.getIsAccess(roles);
      //console.log("getIsAccess_", isAccess);
      if (isAccess.isServerError) {
        setIsAccess({
          isLogin: null,
          isPermission: null,
        });
        return;
      }
      return setIsAccess(isAccess);
    };

    getDataIsAccess();
  }, [roles, authData]);

  //   const isAccessNull =
  //     isAccess.isLogin === null && isAccess.isPermission === null;

  //   const routeAccessDeniedConditions =
  //     isAccess.isLogin === true && isAccess.isPermission === false;

  const privateAccessConditions =
    isAccess.isPermission === true && isAccess.isLogin === true;

  //   const routeAuthConditions =
  //     isAccess.isLogin === false && isAccess.isPermission === false;

  //---------------------------------------------

  //console.log("roleAccessConditions", roleAccessConditions);

  return <>{privateAccessConditions ? children : error ? error : <></>}</>;
}
