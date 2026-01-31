import { LucideIcon } from "lucide-react";
import { Select, SelectTrigger } from "./ui/select";

type Option = {
  icon: LucideIcon;
  label: string;
};

type CustomSelectProps = {
  icon: LucideIcon;
  text: string;
  options: Option[];
};

export const CustomSelect = ({ icon: Icon, text, options }: CustomSelectProps) => {
  return (
    <Select>
      <SelectTrigger>
        <div className="flex items-center gap-2">
          <Icon />
          <span>{text}</span>
        </div>
      </SelectTrigger>
    </Select>
  );
};
