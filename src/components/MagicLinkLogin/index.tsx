"use client";

import { Box, TextField, Typography } from "@mui/material";
import MagicLinkAuthButton from "@/atomes/MagicLinkAuthButton";
import { useMagicLinkLogin } from "@/hooks/useMagicLinkLogin";

export default function MagicLinkLogin({ isLoading }: { isLoading: boolean }) {
  const {
      email,
      setEmail,
      message,
      loading: isLoadingSendMail,
      handleSubmit
  } = useMagicLinkLogin();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        disabled={isLoading || isLoadingSendMail}
      />

      <MagicLinkAuthButton isLoading={isLoading || isLoadingSendMail} />

      {message && (
        <Typography variant="body2" color={message.includes("Erreur") ? "error" : "success.main"}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
