import { ReactNode } from "react";

export interface GlobalContainerProps {
  children: ReactNode;
}

export function GlobalContainer({ children }: GlobalContainerProps) {
  return (
    <div className="px-[2.5rem]">
      <div className="max-w-[80rem] w-full mx-auto">{children}</div>
    </div>
  );
}
