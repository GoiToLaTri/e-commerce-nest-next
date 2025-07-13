import { Image } from "antd";
import MomoCirLogo from "../../../../public/momo_circle.svg";

export default function MomoCircleLogo({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={MomoCirLogo.src}
      alt="momo-icon"
      preview={false}
      width={width}
      height={height}
    />
  );
}
