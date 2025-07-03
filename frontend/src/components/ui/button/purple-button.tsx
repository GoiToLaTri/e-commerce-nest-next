import { Button } from "antd";
import { MouseEventHandler, ReactNode } from "react";

export interface PurpleButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLElement> | undefined;
}

export function PurpleButton({ children, onClick }: PurpleButtonProps) {
  return (
    <Button
      type="primary"
      size="large"
      className="!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
