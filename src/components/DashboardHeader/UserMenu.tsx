"use client";

import { useState } from "react";
import { Menu, Divider  } from "@mui/material";
import type { IamResponse } from "@/hooks/useIam";
import UserIdentityText from "@/atomes/UserIdentityText";
import UserMenuItem from "../UserMenuItem";
import {menuItems} from "@/config/user-menu-items"
import ActionAvatar from "@/atomes/ActionAvatar";


export default function UserMenu({ user }: {user: IamResponse["user"]}) {
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ActionAvatar
        onClick={handleOpen}
        image={user.image}
        alt={`avatar ${user.name}`}
        size={48}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <UserIdentityText name={user.name} email={user.email} />

        <Divider />

        {menuItems.map((item) => (
          <UserMenuItem
            key={item.key}
            item={item}
            role={user.role || "free"}
            onClick={() => handleClose()}
          />
        ))}

      </Menu>
    </>
  );
}
