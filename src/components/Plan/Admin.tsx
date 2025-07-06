import { Box, Typography } from "@mui/material";

export default function Admin() {

  return (
    <Box maxWidth={700} mx="auto" p={3} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Hey Admin ! 🚀
      </Typography>
      <Typography variant="body1">
        T’as accès à tous les secrets, mais ici rien à voir avec ton trône, juste un tableau plan…
        Va plutôt profiter du dashboard royal !
      </Typography>
      </Box>
  )
}