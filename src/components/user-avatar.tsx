import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  name: string;
  image: string | undefined | null;
  className?: string;
  textSize?: string;
};

export const UserAvatar = ({ name, image, className, textSize }: UserAvatarProps) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={image ?? ""} alt={`${name} profile image`} />
      <AvatarFallback className={textSize}>
        {name
          .split(" ")
          .map((part) => part[0].toUpperCase())
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};
