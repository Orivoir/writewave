import type { UserRole } from "@/models/User";
import { Typography } from "@mui/material";

export default function CurrentPlan({role}: {role: UserRole}) {

  return (
  <Typography
    variant="subtitle1"
    color="text.secondary"
    textAlign="center"
    mb={3}
  >
    Votre plan actuel : <strong>{role} plan</strong>
  </Typography>
  )
}