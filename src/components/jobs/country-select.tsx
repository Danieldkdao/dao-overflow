import { MapPinIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const CountrySelect = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Select defaultValue={value} onValueChange={(e) => onChange(e)}>
      <SelectTrigger className="flex items-center gap-2 w-full">
        <MapPinIcon />
        <SelectValue placeholder="Select location"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter by country</SelectLabel>
          {options.map((option) => (
            <SelectItem value={option} key={option}>
              <span className="text-medium">{option}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
