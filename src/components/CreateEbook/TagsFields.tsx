"use client";

import { Box, Chip, TextField } from "@mui/material";
import { useState } from "react";

export interface TagFieldsProps {
  onChange: (tags: string[]) => void;
}

export default function TagsFields({onChange}: TagFieldsProps) {

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(current => {

        const newTags = [...current, trimmed]
        onChange(newTags)
        return newTags
      });
    }
    setTagInput("");

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "," || e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(current => {
      const newTags = current.filter((t) => t !== tagToDelete)
      onChange(newTags)
      return newTags
    });
  };

  return (
    <>
      <TextField
        label="Ajouter un tag"
        fullWidth
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
          />
        ))}
      </Box>
    </>
  )
}