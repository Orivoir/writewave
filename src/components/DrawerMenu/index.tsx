import React from "react";
import { Drawer, SwipeableDrawer, useMediaQuery, Box, List, ListItem, ListItemText, ListItemButton, Divider, ListItemIcon } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { grey } from '@mui/material/colors';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExploreIcon from '@mui/icons-material/Explore';
import BookIcon from '@mui/icons-material/Book';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FaceIcon from '@mui/icons-material/Face';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import SettingsIcon from '@mui/icons-material/Settings';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ open, onClose, onOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const content = (
    <Box role="presentation" sx={{ width: isMobile ? 'auto' : 250 }}>
      <List>
        <ListItemButton>
          <ListItemIcon>
              <MenuBookIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mes ebooks" />
        </ListItemButton>

        <ListItemButton>
          {/* Dashboard seller stripe */}
          <ListItemIcon>
            <BookIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mon Compte créateur" />
        </ListItemButton>

        <ListItemButton>
          {/* Analitics ebooks publics, download/views, ect... */}
          <ListItemIcon>
            <ShowChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mes publications" />
        </ListItemButton>

        <ListItemButton>
          {/* Public and sharable screen author (/dashboard/author) */}
          <ListItemIcon>
            <FaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mon profil d'autheur" />
        </ListItemButton>

        <ListItemButton>
          {/* 3th party /explore */}
          <ListItemIcon>
            <ExploreIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Market place" />
        </ListItemButton>

        <ListItemButton>
          {/* /faq */}
          <ListItemIcon>
              <LiveHelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="FAQ" />
        </ListItemButton>

        <Divider />

        <ListItemButton>
          {/* /dashboard/settings */}
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

      </List>
    </Box>
  );

  if (isMobile) {

    return (
      <SwipeableDrawer
        anchor="bottom"
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: theme.shape.borderRadius,
              borderTopRightRadius: theme.shape.borderRadius
            }
          }
        }}
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        keepMounted
        swipeAreaWidth={30}
      >
        {content}
      </SwipeableDrawer>
    );
  }

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      {content}
    </Drawer>
  );
};

export default DrawerMenu;
