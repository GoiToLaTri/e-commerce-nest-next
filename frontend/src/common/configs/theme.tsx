import { ConfigProvider, theme, type ThemeConfig } from "antd";
import { ReactNode } from "react";

export interface ThemeConfigProps {
  children: ReactNode;
}

const config: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
};

export function AntdThemeConfig({ children }: ThemeConfigProps) {
  return <ConfigProvider theme={config}>{children}</ConfigProvider>;
}
