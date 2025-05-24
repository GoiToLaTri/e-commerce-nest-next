import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme, type ThemeConfig } from "antd";
import { ReactNode } from "react";

export interface ThemeConfigProps {
  children: ReactNode;
}

const config: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
};

export function AntdThemeConfig({ children }: ThemeConfigProps) {
  return (
    <ConfigProvider theme={config}>
      {/* Fix delay antd style */}
      <AntdRegistry>{children}</AntdRegistry>
    </ConfigProvider>
  );
}
