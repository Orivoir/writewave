"use client";

import EbookCard, { EbookCardProps } from "@/components/EbookCard";
import EbookCardSkeleton from "@/components/EbookCard/Skeleton";
import { usePreviewTheme } from "@/hooks/usePreviewTheme";
import { Box, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import { Types } from "mongoose";

export default function EbookCardPreviewPage() {

  const {theme, Toggle} = usePreviewTheme("light")

  const FACTORIES: EbookCardProps[] = [
    {
      /* @ts-ignore typescript await a mongoose document wich extends of model */
      ebook: {
        _id: new Types.ObjectId(),
        author: new Types.ObjectId(),
        title: "Écrire en Markdown",
        description: "Apprends à écrire efficacement pour le web et le livre numérique.",
        coverImage: "https://placehold.co/400x600/png",
        coverImageKey: "", // optionnel
        slug: "ecrire-markdown",
        tags: ["markdown", "écriture", "guide"],
        visibility: "public",
        isForSale: false,
        theme: new Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      onEdit: () => alert("Edit"),
      onDelete: () => alert("Delete"),
    },
    {
      /* @ts-ignore typescript await a mongoose document wich extends of model */
      ebook: {
        _id: new Types.ObjectId(),
        author: new Types.ObjectId(),
        title: "Lorem ipsum dolor sit amet consectum amat victoria couram",
        description:
          "turpis ante, vitae dictum mi blandit nec. Suspendisse sagittis, dui a pretium egestas, turpis metus eleifend velit, in lacinia tellus metus.",
        coverImage: "https://picsum.photos/400/600",
        coverImageKey: "",
        slug: "ecrire-markdown-foobar",
        tags: ["Lorem", "Ipsum", "dolor sit", "amet consectum", "amat victoria", "couram", "dui a pretium"],
        visibility: "private",
        isForSale: false,
        theme: new Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      onEdit: () => alert("Edit"),
      onDelete: () => alert("Delete"),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            color: "text.primary",
            p: 4,
          }}
        >
        {Toggle}

        <Typography variant="h6" mt={4} mb={2}>
          Standard Ebook Card
        </Typography>
        <Stack rowGap={2}>
        {FACTORIES.map((props, index) => (
          <Stack direction="row" spacing={2} key={index}>
            {["small", "medium", "large"].map((size, subIndex) => (
              <Box
                key={`${index}-${subIndex}`}
                sx={{ flexShrink: 0 }} // ici on empêche le rapetissement
              >
                <EbookCard size={size as "small" | "medium" | "large"} {...props} />
              </Box>
            ))}
          </Stack>
        ))}
        </Stack>


        {/* Skeleton - Normal */}
        <Typography variant="h6" mt={4} mb={2}>
          Standard Skeletons Ebook Card
        </Typography>
        <Stack direction="row" spacing={2}>
          {["small", "medium", "large"].map((size) => (
            <Box key={`skeleton-${size}`} sx={{ flexShrink: 0 }}>
              <EbookCardSkeleton size={size as any} />
            </Box>
          ))}
        </Stack>

        {/* Thumbnails */}
        <Typography variant="h6" mt={4} mb={2}>
          Thumbnails Ebook Card
        </Typography>
        <Stack rowGap={2}>
        {FACTORIES.map((props, index) => (
          <Stack direction="row" spacing={2} key={`thumb-${index}`}>
            {["small", "medium", "large"].map((size) => (
              <Box key={`thumb-${index}-${size}`} sx={{ flexShrink: 0 }}>
                <EbookCard size={size as any} isThumbnails {...props} />
              </Box>
            ))}
          </Stack>
        ))}
        </Stack>

        {/* Skeleton - Thumbnails */}
        <Typography variant="h6" mt={4} mb={2}>
          Thumbnails Skeleton Ebook Card
        </Typography>
        <Stack direction="row" spacing={2}>
          {["small", "medium", "large"].map((size) => (
            <Box key={`skeleton-thumb-${size}`} sx={{ flexShrink: 0 }}>
              <EbookCardSkeleton size={size as any} isThumbnails />
            </Box>
          ))}
        </Stack>


        </Box>
      </ThemeProvider>
    </div>
  );
}
