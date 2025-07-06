"use client";

import { Box, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState, useRef } from "react";

type Props = {
  onChange: (file: File) => void;
};

export default function CoverImageFields({ onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="body2" sx={{ mb: 1 }}>Ajouter une image de couverture</Typography>
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
        sx={{
          width: 120,
          height: 160,
          backgroundColor: "background.paper",
          border: "2px dashed gray",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt="Cover Preview"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "text.secondary" }} />
        )}
      </Box>
    </Box>
  );
}
