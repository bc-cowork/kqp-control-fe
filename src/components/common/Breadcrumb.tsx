'use client';

import { Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  node: string;
  pages: string[];
};

export function Breadcrumb({ node, pages }: Props) {
  return (
    <Box>
      <Typography variant="h3" display="inline" sx={{ color: (theme) => theme.palette.grey[400] }}>
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
          color: (theme) => theme.palette.grey[400],
        }}
      >
        {node}
      </Typography>

      {pages.map((page, index) => (
        <Box component="span" key={index}>
          <Typography
            variant="h3"
            display="inline"
            sx={{ color: (theme) => theme.palette.grey[400] }}
          >
            {` > `}
          </Typography>
          <Typography
            variant={index === pages.length - 1 ? 'h2' : 'h3'}
            display="inline"
            sx={{
              color: (theme) =>
                index === pages.length - 1 ? theme.palette.common.black : theme.palette.grey[400],
            }}
          >
            {page}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
