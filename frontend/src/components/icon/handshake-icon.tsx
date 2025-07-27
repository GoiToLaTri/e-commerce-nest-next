"use client";

import handShake from "../../../public/handshake_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
import { Image } from "antd";

export function HandshakeIcon({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={handShake.src}
      alt="vercel-icon"
      preview={false}
      width={width}
      height={height}
    />
  );
}
