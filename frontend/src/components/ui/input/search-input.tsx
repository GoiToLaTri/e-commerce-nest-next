import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import "@/styles/search-input.style.css";

const { Search } = Input;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchInputProps extends SearchProps {}

export function SearchInput({
  onSearch,
  placeholder,
  ...props
}: SearchInputProps) {
  return (
    <Search
      {...props}
      placeholder={placeholder}
      allowClear
      onSearch={onSearch}
      size="large"
      className={`search-input ${props.className}`}
    />
  );
}
