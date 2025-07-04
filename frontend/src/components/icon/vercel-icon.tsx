"use client";

import vercelIcon from "../../../public/vercel.svg";
import { Image } from "antd";

export function VercelIcon({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={vercelIcon.src}
      alt="vercel-icon"
      preview={false}
      width={width}
      height={height}
    />
  );
}
