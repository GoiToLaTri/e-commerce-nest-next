import { Image } from "antd";
import GoogleIconSVG from "../../../public/google.svg";

export function GoogleIcon({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={GoogleIconSVG.src}
      alt="google-icon"
      preview={false}
      width={width}
      height={height}
    />
  );
}
