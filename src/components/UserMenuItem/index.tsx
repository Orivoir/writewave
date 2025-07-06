import { Box, Divider, ListItemIcon, ListItemText, MenuItem, SvgIconTypeMap } from "@mui/material";
import { useRouter } from "next/navigation";
import { UserMenuItemType } from "@/config/user-menu-items";
import { UserRole } from "@/models/User";


export interface UserMenuItemProps {
  item: UserMenuItemType;
  role: UserRole;
  onClick: (item: UserMenuItemType) => void;
}

export default function UserMenuItem({item, role, onClick}: UserMenuItemProps) {

  const router = useRouter()

  if (item.onlyPremium && role !== "premium") {
    return null;
  }

  return (
    <Box>
      <MenuItem
        onClick={() => {
          item.redirect ? router.push(item.redirect) : item.action?.();
          onClick(item)
        }}
      >
        <ListItemIcon>
          <item.Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{item.text}</ListItemText>
        
        {item.side?.(role || "free")}
      
      </MenuItem>
      {item.separator && <Divider />}
    </Box>
  );
}