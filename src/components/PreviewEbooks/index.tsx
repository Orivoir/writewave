import { Box, Button, Grid, Typography } from "@mui/material";
import EbookCard from "../EbookCard";
import EbookCardSkeleton from "../EbookCard/Skeleton";
import { IEbook } from "@/models/Ebook";

export default function PreviewEbooks({
  ebooks,
  isLoading
}: {ebooks: IEbook[], isLoading: boolean}) {

  if(isLoading) {
    return (
      <Box>
        <Grid container spacing={2}>
          <EbookCardSkeleton size="small" />
          <EbookCardSkeleton size="small" />
          <EbookCardSkeleton size="small" />
        </Grid>
      </Box>
    )
  }

  return (
    <Box>
    {ebooks.length > 0 ? (
      <Grid container>
        {ebooks.slice(0,3).map((ebook, index) => (
          <Box key={index} sx={{ width: { xs: '100%', sm: '33.33%', md: '25%' }, p: 1 }}>
            <EbookCard ebook={ebook} size="small" />
          </Box>
        ))}
      </Grid>
    ) : (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" gutterBottom>
          Commencer à
        </Typography>
        <Button variant="contained" color="primary">
          Créer un ebook
        </Button>
      </Box>
    )}
  </Box>
  )
}