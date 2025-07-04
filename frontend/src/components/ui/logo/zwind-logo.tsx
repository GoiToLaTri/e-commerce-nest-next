import { VercelIcon } from "@/components/icon";

export interface ZwindLogoProps {
  width: string;
  height: string;
}

export function ZwindLogo() {
  return (
    <div className="flex gap-4 items-end select-none">
      <div className="relative w-[40px] h-[40px]">
        <VercelIcon width={40} height={40} />
      </div>
      <div>
        <div className="font-bold tracking-[1.6px] text-2xl">ZWIND</div>
        <div className="text-[8px] tracking-[2.4px] uppercase">zwind group</div>
      </div>
    </div>
  );
}
