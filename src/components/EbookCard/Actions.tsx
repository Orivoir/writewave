import { CardActions, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


export default function Actions({onDelete, onEdit}: {onDelete?: () => void; onEdit?: () => void;}) {


  return (
    <CardActions disableSpacing>
      <Tooltip title="Modifier">
        <IconButton onClick={onEdit} disabled={!onEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Supprimer">
        <IconButton onClick={onDelete} disabled={!onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  )
}