import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="g-gradient-to-br from-white/10 to-white/5 backdrop-blur-0 border border-purple-200/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-[24px] p-6 flex items-start gap-4 mb-[8rem]">
      {children}
    </div>
  );
}
