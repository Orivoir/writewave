"use client";

import { Box, Typography, Button } from "@mui/material";

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "common.white",
        textAlign: "center",
        backgroundImage: `url("https://picsum.photos/id/1018/1920/1080")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 1,
        },
        px: 2,
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          Welcome to Writewave
        </Typography>
        <Typography variant="h6" component="p" mb={4}>
          Create, publish, and discover ebooks online with our powerful platform.
          Customize metadata, navigate dynamically, and boost your reading experience.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => alert("Get Started clicked")}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
