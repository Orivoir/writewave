import { TableRow, TableHead as MUITableHead, TableCell, Typography } from "@mui/material";
import { useState } from "react";


export default function TableHead({
  premium,
  free,
  plan,
  onChangePlan
}: {
  free: {title: string; price: string;},
  premium: {title: string; price: string;},
  plan: "premium" | "free",
  onChangePlan: (newPlan: "premium" | "free") => void;
}) {

  return (
    <MUITableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}>Fonctionnalités</TableCell>
        <TableCell
          align="center"
          sx={{
            fontWeight: "bold",
            backgroundColor:
              plan === "free" ? "primary.light" : "transparent",
            cursor: "pointer",
          }}
          onClick={() => plan !== 'free' && onChangePlan("free")}
        >
          {free.title}
          <Typography variant="subtitle1" color="text.secondary">{free.price}</Typography>
        </TableCell>
        <TableCell
          align="center"
          sx={{
            fontWeight: "bold",
            backgroundColor:
              plan === "premium" ? "primary.light" : "transparent",
            cursor: "pointer",
          }}
          onClick={() => plan != "premium" && onChangePlan("premium")}
        >
          {premium.title}
          <Typography variant="subtitle1" color="text.secondary">{premium.price}</Typography>
        </TableCell>
      </TableRow>
    </MUITableHead>
  )
}