import { Spin } from "antd";
import React from "react";

export function LoadingSpin() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spin size="large" />
    </div>
  );
}
