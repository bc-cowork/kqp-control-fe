import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

export type TableLoadingRowsProps = {
  loadingRows?: number;
  height?: number;
  columns?: number;
};

export function TableLoadingRows({
  height = 49,
  columns = 12,
  loadingRows = 40,
}: TableLoadingRowsProps) {
  return (
    <TableRow
      sx={{
        ...(height && { height: height * loadingRows }),
      }}
    >
      <TableCell colSpan={columns} sx={{ border: 'none' }}>
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      </TableCell>
    </TableRow>
  );
}
