import { Button } from "antd";
import { ReactNode } from "react";

export interface PrupleButtonProps {
  children: ReactNode;
}

export function PrupleButton({ children }: PrupleButtonProps) {
  return (
    <Button
      type="primary"
      size="large"
      className="!bg-[#924dff] !rounded-[4rem] !text-[1rem] !font-medium leading-[1.6] !px-[2rem] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
    >
      {children}
    </Button>
  );
}
