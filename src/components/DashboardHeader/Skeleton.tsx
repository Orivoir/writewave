import { Box, AppBar, Toolbar, Skeleton } from "@mui/material";

export default function DashboardHeaderSkeleton() {
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
          {/* Skeleton pour IconButton Menu */}
          <Skeleton variant="rectangular" width={30} height={30} />

          {/* Skeleton pour le titre */}
          <Skeleton variant="text" width={120} height={32} />

          {/* Skeleton pour la barre de recherche */}
          <Skeleton variant="rectangular" width={200} height={36} />
        </Box>

        {/* Skeleton pour UserMenu */}
        <Skeleton variant="circular" width={40} height={40} />
      </Toolbar>
    </AppBar>
  );
}
