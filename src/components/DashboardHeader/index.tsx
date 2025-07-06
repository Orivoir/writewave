"use client";

import { Box, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UserMenu from "./UserMenu";
import SearchInput from "./SearchInput";
import type { IamResponse } from "@/hooks/useIam";
import Title from "./Title";

export default function DashboardHeader({ user, onMenuToggle }: { user: IamResponse["user"], onMenuToggle: () => void }) {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 64,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, minWidth: 0, flex: 1 }}>
          <IconButton onClick={onMenuToggle} edge="start" color="inherit">
            <MenuIcon />
          </IconButton>

          <Title />

          <Box sx={{ flexShrink: 0 }}>
            <SearchInput />
          </Box>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <UserMenu user={user} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
