import { Box, Typography, useTheme } from "@mui/material";

export default function Title({ text }: { text: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",       // <== important pour superposer sur l'image
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(255, 255, 255, 0.9)",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        px: 2,
        py: 1,
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        userSelect: "none",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
        {text}
      </Typography>
    </Box>
  );
}
