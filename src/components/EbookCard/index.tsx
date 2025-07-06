"use client";

import Link from "next/link";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { IEbook } from "@/models/Ebook";

import EbookCardMedia from "./CardMedia";
import Tags from "./Tags";
import Description from "./Description";
import Title from "./Title";
import Actions from "./Actions";
import Thumbnails from "./Thumbnails/index";
import { useMemo } from "react";

export type EbookCardProps = {
  ebook: IEbook;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: "small"  | "medium" | "large"
  isThumbnails?: boolean;
};

type SizeStylesType = {
  width: number;
  coverHeight: number;
  titleVariant: "subtitle1" | "h6" | "h5";
  descLines: number;
}

const sizeStyles: Record<string, SizeStylesType> = {
  small: {
    width: 220,
    coverHeight: 280,
    titleVariant: "subtitle1",
    descLines: 2,
  },
  medium: {
    width: 300,
    coverHeight: 400,
    titleVariant: "h6",
    descLines: 3,
  },
  large: {
    width: 380,
    coverHeight: 500,
    titleVariant: "h5",
    descLines: 4,
  },
};

export default function EbookCard({ ebook, onEdit, onDelete, size="medium", isThumbnails=false }: EbookCardProps) {
  
  const {
    title,
    description,
    coverImage,
    visibility,
    tags = [],
    slug
  } = ebook;

  const theme = useTheme();

  const config = useMemo(() => {
    return sizeStyles[size] || sizeStyles.medium;
  }, [size]);

  if (isThumbnails) {
    const squareSize = Math.max(config.width * 0.8, 120); 
    return (
      <Link href={`/dashboard/${slug}`} passHref style={{ textDecoration: "none" }}>
        <Thumbnails
          slug={slug}
          size={squareSize}
          coverImage={coverImage || ""}
          title={title}
        />
      </Link>
    );
  }

  return (
    <Link href={`/dashboard/${slug}`} passHref style={{ textDecoration: "none" }}>
      <Card
        sx={{
          maxWidth: config.width,
          cursor: "pointer",
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: theme.shadows[6],
          },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        aria-label={`Ebook card for ${title}`}
      >
        <Box sx={{ position: "relative" }}>
          <EbookCardMedia
            coverImage={coverImage || ""}
            title={title}
            height={config.coverHeight}
            slug={slug}
          />
          <MenuBookIcon
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "rgba(255,255,255,0.85)",
              fontSize: 36,
              textShadow: "0 0 6px rgba(0,0,0,0.6)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Title
            text={title}
            visibility={visibility}
            variant={config.titleVariant}
          />
          {description && (
            <Description content={description} maxLines={config.descLines} />
          )}
          <Tags list={tags} />
        </CardContent>

        {(onEdit || onDelete) && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Actions onEdit={onEdit} onDelete={onDelete} />
          </Box>
        )}
      </Card>
    </Link>
  );
}
