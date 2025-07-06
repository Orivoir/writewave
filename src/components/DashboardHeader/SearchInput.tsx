"use client";

import {
  InputBase,
  useMediaQuery,
  useTheme,
  styled,
  alpha
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import SearchMobile from "./SearchMobile";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.text.primary, 0.06),
  "&:hover": {
    backgroundColor: alpha(theme.palette.text.primary, 0.1),
  },
  width: "100%",
  maxWidth: 300,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  padding: theme.spacing(0, 2),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "12ch",
    "&:focus": {
      width: "20ch",
    },
  },
}));

export default function ResponsiveSearchInput() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm")); // sm+ = true

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "") {
      console.log("Search for:", query);
      // router.push or onSearch?
    }
  };

  if (!isSmUp) {
    return (<SearchMobile />);
  }

  return (
    <SearchContainer>
      <SearchIconWrapper>
        <SearchIcon fontSize="small" />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        inputProps={{ "aria-label": "search" }}
      />
    </SearchContainer>
  );
}
