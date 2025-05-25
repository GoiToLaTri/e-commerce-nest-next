import { Spin } from "antd";

export function LoadingSpin() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spin size="large" />
    </div>
  );
}
