import { Typography } from "@mui/material";

export default function Title() {

  return (
  <Typography
    variant="h6"
    noWrap
    component="a"
    href="/dashboard"
    sx={{
      fontWeight: 400,
      letterSpacing: 1,
      cursor: "pointer",
      userSelect: "none",
      color: "inherit",
      textDecoration: "none",
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    Writewave
  </Typography>
  )
}