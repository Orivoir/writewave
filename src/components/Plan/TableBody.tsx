import { TableBody as MUITableBody, TableCell, TableRow } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { plansData, featureList } from "@/app/[locale]/dashboard/plan/page";

export default function TableBody() {

  return (
    <MUITableBody>
      {featureList.map((feature) => (
        <TableRow key={feature}>
          <TableCell>{feature}</TableCell>
          <TableCell align="center">
            {plansData.free.features[feature].checked ? (
              <CheckIcon color="success" />
            ) : (
              <CloseIcon color="disabled" />
            )}
          </TableCell>
          <TableCell align="center">
            {plansData.premium.features[feature].checked ? (
              <CheckIcon color="success" />

            ) : (
              <CloseIcon color="disabled" />
            )}
          </TableCell>
        </TableRow>
      ))}
    </MUITableBody>
  )
}