"use client";

import { ReactNode, useState } from "react";
//------------------------------- FIX ANT DESIGN v5 on React 19 -------------------------------
//source: https://github.com/ant-design/v5-patch-for-react-19
import { unstableSetRender } from "antd";
import { createRoot } from "react-dom/client";
import { AntdThemeConfig } from "@/common/configs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/store";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// type RenderType = Parameters<typeof unstableSetRender>[0];

// Fix render type for React 19
type RenderType = NonNullable<Parameters<typeof unstableSetRender>[0]>;
type ContainerType = Parameters<RenderType>[1] & {
  _reactRoot?: ReturnType<typeof createRoot>;
};

unstableSetRender((node, container: ContainerType) => {
  container._reactRoot ||= createRoot(container);
  const root: ReturnType<typeof createRoot> = container._reactRoot;
  root.render(node);

  return () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        root.unmount();
        resolve();
      }, 0);
    });
});
//--------------------------------------------------------------------------------

export interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-center" theme="dark" richColors />
        <AntdThemeConfig>{children}</AntdThemeConfig>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
