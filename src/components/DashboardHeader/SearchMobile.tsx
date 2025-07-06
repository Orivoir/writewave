import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  DialogContent,
  Typography,
  useTheme,
  alpha,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchMobile() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleSearch = () => {
    if (query.trim() === "") return;
    console.log("Search for:", query);
    setOpen(false);
  };

  return (
    <>
      <IconButton
        sx={{
          backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.08),
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.15),
          },
          borderRadius: 2,
          p: 1,
        }}
        color="inherit"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir la recherche"
      >
        <SearchIcon />
      </IconButton>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="fermer la recherche">
              <CloseIcon />
            </IconButton>

            <InputBase
              inputRef={inputRef}
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              autoFocus
              sx={{
                flexGrow: 1,
                fontSize: "1.1rem",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.text.primary, 0.06),
              }}
              inputProps={{ "aria-label": "Recherche" }}
            />

            <IconButton
              onClick={handleSearch}
              disabled={query.trim() === ""}
              aria-label="Valider la recherche"
            >
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {/* Historique, suggestions, résultats... */}
              Pas encore d'historique ou résultats.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
