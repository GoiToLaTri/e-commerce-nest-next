import { Spin } from "antd";

export function LoadingSpin() {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <Spin size="large" />
    </div>
  );
}
