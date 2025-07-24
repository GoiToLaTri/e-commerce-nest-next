import { Input } from "antd";

interface TextInputProps {
  placeholder?: string;
  className?: string;
}

export function TextInput({ placeholder, className }: TextInputProps) {
  return (
    <Input
      className={`!bg-[rgba(255,255,255,.05)] !outline-0 !border-0 ${className}`}
      placeholder={placeholder}
    />
  );
}
