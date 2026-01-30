import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  name: string;
  image: string | undefined | null;
  className?: string;
};

export const UserAvatar = ({ name, image, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={image ?? ""} alt={`${name} profile image`} />
      <AvatarFallback>
        {name
          .split(" ")
          .map((part) => part[0].toUpperCase())
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};
