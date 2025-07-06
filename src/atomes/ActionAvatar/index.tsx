import { Avatar, IconButton } from "@mui/material";

export interface ActionAvatarProps {
  image: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  alt?: string;
  size?: number;  
}

export default function ActionAvatar({
  image,
  onClick,
  alt = "avatar",
  size = 48
}: ActionAvatarProps) {

  return (
    <IconButton onClick={onClick} size="large" sx={{ p: 0 }}>
      <Avatar
        src={image}
        alt={alt}
        sx={{ width: size, height: size }}
      />
    </IconButton>
  )
}