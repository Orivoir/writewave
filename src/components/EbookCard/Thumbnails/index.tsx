import { Card } from "@mui/material";
import EbookCardMedia from "./../CardMedia";
import Title from "./Title";
import { EbookVisibility } from "@/models/Ebook";
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function Thumbnails({
  size,
  title,
  slug,
  coverImage,
}: {
  size: number;
  slug: string;
  coverImage: string;
  title: string;
}) {
  return (
    <Card sx={{ width: size, height: size, position: "relative", overflow: "hidden" }}>
      <EbookCardMedia
        coverImage={coverImage || ""}
        title={title}
        height={size}
        slug={slug}
      />

      <MenuBookIcon
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          color: "rgba(255,255,255,0.85)",
          fontSize: 24,
          textShadow: "0 0 6px rgba(0,0,0,0.6)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <Title text={title} />
    </Card>
  );
}
