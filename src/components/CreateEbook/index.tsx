"use client";
import { Box, Button, TextField, Stack } from "@mui/material";
import { useRef, useState } from "react";
import TagsFields from "./TagsFields";
import CoverImageFields from "./CoverImageFields";

export interface DataCreateEbook {
  title: string;
  description?: string;
  tags?: string[];
  coverImageFile?: File
}

export interface CreateEbookProps {
  onSubmit: (data: DataCreateEbook) => void; 
}

export default function CreateEbook({ onSubmit }: CreateEbookProps) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const tagsRef = useRef<string[]>([])
  const fileRef = useRef<File | null>(null)

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onSubmit({
      title,
      description,
      tags: tagsRef.current,
      coverImageFile: fileRef.current || undefined
    });
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="Titre"
          required
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TagsFields onChange={(tags) => tagsRef.current = tags} /> 

        <CoverImageFields onChange={(file) => fileRef.current = file} />

        <Button variant="contained" onClick={handleSubmit} disabled={!title.trim()}>
          Créer le chapitre
        </Button>
      </Stack>
    </Box>
  );
}
