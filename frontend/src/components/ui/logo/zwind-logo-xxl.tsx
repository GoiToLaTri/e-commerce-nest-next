import { VercelIcon } from "@/components/icon";

export function ZwindLogoXXL() {
  return (
    <div className="flex gap-4 items-end select-none">
      <div className="relative w-[80px] h-[80px]D">
        <VercelIcon />
      </div>
      <div>
        <div className="font-bold tracking-[3.2] text-[3rem] leading-[4rem]">
          ZWIND
        </div>
        <div className="text-[16px] tracking-[4.8] uppercase">zwind group</div>
      </div>
    </div>
  );
}
