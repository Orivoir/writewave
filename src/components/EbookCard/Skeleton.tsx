"use client";

import { Card, CardContent, Skeleton, Box } from "@mui/material";
import { TypographyProps } from "@mui/material";
import { useMemo } from "react";

type EbookCardSkeletonProps = {
  size?: "small" | "medium" | "large";
  isThumbnails?: boolean;
};

type SizeStylesType = {
  width: number;
  coverHeight: number;
  titleVariant: TypographyProps["variant"];
  descLines: number;
};

const sizeStyles: Record<"small" | "medium" | "large", SizeStylesType> = {
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

export default function EbookCardSkeleton({ size = "medium", isThumbnails = false }: EbookCardSkeletonProps) {
  const config = useMemo(() => sizeStyles[size], [size]);

  if (isThumbnails) {
    const squareSize = Math.max(config.width * 0.8, 120);

    return (
      <Skeleton
        variant="rectangular"
        width={squareSize}
        height={squareSize}
        animation="wave"
        sx={{ borderRadius: 2 }}
      />
    );
  }

  return (
    <Card sx={{ maxWidth: config.width, width: config.width }}>
      <Skeleton variant="rectangular" height={config.coverHeight} animation="wave" />

      <CardContent>
        <Skeleton variant="text" width="80%" height={24} animation="wave" />

        {[...Array(config.descLines)].map((_, i) => (
          <Skeleton key={i} variant="text" width={`${90 - i * 5}%`} height={18} animation="wave" />
        ))}

        <Box mt={1} display="flex" gap={1}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={40} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
}
