"use client";

import { authApi } from "@/api-client";
import { queryKeys, Role } from "@/common/enums";
import { useUserSession } from "@/hooks/useUserSession";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

export interface AuthContextData {
  getIsAccess: (roles: Role[]) => Promise<{
    isLogin: boolean;
    isPermission: boolean;
    isServerError: boolean;
  }>;
  user_session: IUserSession | null;
}

const AuthContext = createContext<AuthContextData>({
  getIsAccess: async () => ({
    isLogin: false,
    isPermission: false,
    isServerError: false,
  }),
  user_session: null,
});

export const AuthData = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data } = useUserSession();
  const queryClient = useQueryClient();
  // Set default options for react-query queries (e.g., 5 minutes cache time)
  queryClient.setDefaultOptions({
    queries: {
      gcTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  });
  const [user_session, setUserSession] = useState<IUserSession | null>(null);

  const checkSession = async () => {
    try {
      const response = await authApi.getUserSession(); // Axios request
      console.log("checkSession response", response);

      queryClient.setQueryData([queryKeys.USER_SESSION], response.data);
      setUserSession(response.data);

      return { status: response.status, data: response.data };
    } catch (error) {
      console.log("Error checking session:", error);
      // Nếu là lỗi mạng hoặc bug code => ném exception thật
      throw error;
    }
  };

  const getIsAccess = async (roles: Role[]) => {
    // const data = queryClient.getQueryData<{
    //   session_user: IUserSession;
    // }>([queryKeys.USER_SESSION]);
    console.log("Get is access", data?.session_user);
    // const session_user = sessionData?.session_user;
    try {
      if (!data) {
        const response = await checkSession();
        if (response.status !== 200) {
          return {
            isLogin: false,
            isPermission: false,
            isServerError: true,
          };
        }
        const role = response.data?.session_user.user.roleId as Role;
        if (!roles.includes(role)) {
          return {
            isLogin: true,
            isPermission: false,
            isServerError: false,
          };
        }
        return {
          isLogin: true,
          isPermission: true,
          isServerError: false,
        };
      }

      // Implement your logic to check access based on roles
      // console.log("_______", data);
      const role = data.session_user.user.roleId as Role;
      if (!roles.includes(role)) {
        return {
          isLogin: true,
          isPermission: false,
          isServerError: false,
        };
      }

      return {
        isLogin: true,
        isPermission: true,
        isServerError: false,
      };
    } catch (error: unknown) {
      console.log("Error checking session:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof (error as { status: number }).status === "number" &&
        (error as { status: number }).status === 401
      ) {
        return {
          isLogin: false,
          isPermission: false,
          isServerError: false,
        };
      }
      return {
        isLogin: false,
        isPermission: false,
        isServerError: true,
      };
    }
  };

  return (
    <AuthContext.Provider value={{ getIsAccess, user_session }}>
      {children}
    </AuthContext.Provider>
  );
}
