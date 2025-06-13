import Image from "next/image";
import vercelIcon from "../../../../public/vercel.svg";

export interface ZwindLogoProps {
  width: string;
  height: string;
}

export function ZwindLogoNotext() {
  return (
    <div className="select-none">
      <div className="relative w-[24px] h-[24px]">
        <Image
          src={vercelIcon}
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
