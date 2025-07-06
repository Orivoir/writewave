import { ReplicationRuleStatus } from "@aws-sdk/client-s3";
import { Box, Typography } from "@mui/material";

export default function UserIdentityText({name = "You", email}: {name: string; email: string}) {

  return (
    <Box sx={{ px: 2, py: 1, minWidth: 220 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {name}
      </Typography>
      
      {email && (
        <Typography variant="body2">
          {email}
        </Typography>
      )}
    </Box>
  )
}