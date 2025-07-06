import { Box, Tooltip, Typography, TypographyProps } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { EbookVisibility } from "@/models/Ebook";

export interface TitleProps {
  text: string;
  visibility: EbookVisibility;
  variant: TypographyProps["variant"];
}

export default function Title({ text, visibility, variant }: TitleProps) {
  let IconComponent;
  let tooltipText;
  let iconColor: string;

  console.log(visibility)

  switch (visibility) {
    case "public":
      IconComponent = PublicIcon;
      tooltipText = "Public";
      iconColor = "success.main";
      break;
    case "restricted":
      IconComponent = VpnKeyIcon;
      tooltipText = "Restreint";
      iconColor = "warning.main";
      break;
    case "private":
      IconComponent = LockIcon;
      tooltipText = "Privé";
      iconColor = "text.secondary";
      break;
    case "draft":
      IconComponent = LockIcon;
      tooltipText = "Brouillon";
      iconColor = "text.disabled";
      break;
    case "archived":
      IconComponent = LockIcon;
      tooltipText = "Archivé";
      iconColor = "text.disabled";
      break;
    default:
      IconComponent = LockIcon;
      tooltipText = "Inconnu";
      iconColor = "text.secondary";
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <Typography variant={variant} noWrap title={text}>
        {text}
      </Typography>
      <Tooltip title={tooltipText}>
        <IconComponent fontSize="small" sx={{ color: iconColor }} />
      </Tooltip>
    </Box>
  );
}