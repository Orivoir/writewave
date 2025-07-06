import { Box, Chip } from "@mui/material";

export default function Tags({ list }: { list: string[] }) {
  return (
    <Box
      mt={1}
      sx={{
        display: "flex",
        gap: 0.5,
        overflowX: "auto",
        maxWidth: "100%",  // ou fixe si tu veux, ex: 300px
        paddingBottom: 1,  // pour que le scroll soit plus visible (optionnel)
        // Optionnel : cacher la scrollbar sur Firefox/Chrome/macOS
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,0,0,0.2) transparent",
        "&::-webkit-scrollbar": {
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 3,
        },
      }}
    >
      {list.map((tag) => (
        <Chip key={tag} label={tag} size="small" />
      ))}
    </Box>
  );
}
