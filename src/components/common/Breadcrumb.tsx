'use client';

import { Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  node: string;
  page: string;
};

export function Breadcrumb({ node, page }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h3" display="inline">
        {`Nodes > `}
      </Typography>
      <Typography
        variant="h3"
        display="inline"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[200],
          px: 1,
          py: 0.5,
          border: 1,
          borderRadius: 1,
          borderColor: (theme) => theme.palette.grey[300],
        }}
      >
        {node}
      </Typography>
      <Typography variant="h3" display="inline">
        {` > `}
      </Typography>
      <Typography variant="h2" display="inline">
        {page}
      </Typography>
    </Box>
  );
}
