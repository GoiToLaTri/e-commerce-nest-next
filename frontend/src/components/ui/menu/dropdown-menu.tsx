import { Dropdown, MenuProps } from "antd";
import { ReactNode } from "react";

export interface DropdownMenuProps {
  children: ReactNode;
  menu: MenuProps;
}

export function DropdownMenu({ children, menu }: DropdownMenuProps) {
  return <Dropdown menu={menu}>{children}</Dropdown>;
}
