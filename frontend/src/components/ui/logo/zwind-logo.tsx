import Image from "next/image";
import vercelIcon from "../../../../public/vercel.svg";

export interface ZwindLogoProps {
  width: string;
  height: string;
}

export function ZwindLogo() {
  return (
    <div className="flex gap-4 items-end select-none">
      <div className="relative w-[40px] h-[40px]">
        <Image
          src={vercelIcon}
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div>
        <div className="font-bold tracking-[1.6] text-2xl">ZWIND</div>
        <div className="text-[8px] tracking-[2.4] uppercase">zwind group</div>
      </div>
    </div>
  );
}
