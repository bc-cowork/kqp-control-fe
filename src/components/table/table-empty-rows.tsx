import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export type TableEmptyRowsProps = {
  text?: string;
};

export function TableEmptyRows({ text = 'No data to show' }: TableEmptyRowsProps) {
  return (
    <TableRow>
      <TableCell colSpan={9}>{text}</TableCell>
    </TableRow>
  );
}
