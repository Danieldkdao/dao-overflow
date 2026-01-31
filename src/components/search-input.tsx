import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

type SearchInputProps = {
  placeholder: string;
};

export const SearchInput = ({ placeholder }: SearchInputProps) => {
  return (
    <div className="hidden md:flex px-2 py-1 bg-input rounded-lg items-center flex-1 max-w-[550px]">
      <SearchIcon />
      <Input placeholder={placeholder} className="text-lg shadow-none border-none focus-visible:border-none focus-visible:ring-0" />
    </div>
  )
};
