import { Typography } from "@mui/material";

export default function Description({content, maxLines}: {content: string, maxLines: number}) {

  return (
    <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: maxLines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {content}
    </Typography>
  )
}