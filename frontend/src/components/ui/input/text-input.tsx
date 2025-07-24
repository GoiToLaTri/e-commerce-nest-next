import { Input } from "antd";

interface TextInputProps {
  placeholder?: string;
  className?: string;
}

export function TextInput({ placeholder, className }: TextInputProps) {
  return (
    <Input
      className={`!bg-[rgba(255,255,255,.05)] !outline-0 !border-[rgba(255,255,255,.04)] ${className}`}
      placeholder={placeholder}
    />
  );
}
