'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';
import { useGetProcesses } from 'src/actions/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function DashboardView({ title = 'Main' }: Props) {
  const processList = useGetProcesses('prod1');
  console.log(processList);
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Grid container>
          <Grid md={6}>Node List</Grid>
          <Grid md={6}>Status</Grid>
          <Grid md={12}>Process Lists</Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
