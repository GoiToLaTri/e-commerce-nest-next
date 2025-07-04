import { Image } from "antd";
import FacebookIconSVG from "../../../public/facebook.svg";

export function FacebookIcon({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={FacebookIconSVG.src}
      alt="facebook-icon"
      preview={false}
      width={width}
      height={height}
    />
  );
}
