"use client";

import { CardMedia } from "@mui/material";

export default function EbookCardMedia({
  coverImage,
  title,
  height
}: {
  coverImage: string;
  title: string;
  height: number;
  slug: string;
}) {
  return (
    <CardMedia
      component="img"
      height={height}
      image={coverImage}
      alt={`Cover of ${title}`}
      sx={{ objectFit: "cover", cursor: "pointer" }}
    />
  );
}
