import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export type TableErrorRowsProps = {
  text?: string;
};

export function TableErrorRows({ text = 'Error fetching list' }: TableErrorRowsProps) {
  return (
    <TableRow>
      <TableCell colSpan={9}>{text}</TableCell>
    </TableRow>
  );
}
