"use client";

import { Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { signOut } from "next-auth/react";
import { UserRole } from "@/models/User";

export type UserMenuItemType = {
  key: string;
  Icon: React.ElementType;
  text: string;
  redirect: string | null;
  action: (() => void) | null;
  onlyPremium: boolean;
  separator: boolean;
  side: ((userRole: UserRole) => React.ReactNode) | null;
};


export const menuItems: UserMenuItemType[] = [
  {
    key: "plan",
    Icon: AutoAwesomeIcon,
    text: "plan",
    redirect: "/dashboard/plan",
    action: null,
    onlyPremium: false,
    separator: false,
    side: (userRole: UserRole) => (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {userRole}
      </Typography>
    ),
  },
  {
    key: "payments",
    Icon: PaymentsIcon,
    text: "payments",
    redirect: "/dashboard/payments",
    action: null,
    onlyPremium: true,
    separator: true,
    side: null,
  },
  {
    key: "settings",
    Icon: SettingsIcon,
    text: "settings",
    redirect: "/dashboard/settings",
    action: null,
    onlyPremium: false,
    separator: false,
    side: null,
  },
  {
    key: "logout",
    Icon: LogoutIcon,
    text: "logout",
    redirect: null,
    action: () => signOut({ callbackUrl: "/login" }),
    onlyPremium: false,
    separator: false,
    side: null,
  },
];