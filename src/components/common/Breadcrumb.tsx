'use client';

import { Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  node: string;
  page: string;
  levels?: number;
  itemPage?: string;
};

export function Breadcrumb({ node, page, levels = 3, itemPage }: Props) {
  const fourLevels = levels === 4;
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
      <Typography variant="h3" display="inline" sx={{ color: (theme) => theme.palette.grey[400] }}>
        {` > `}
      </Typography>
      <Typography
        variant={fourLevels ? 'h3' : 'h2'}
        display="inline"
        sx={{
          color: (theme) => (fourLevels ? theme.palette.grey[400] : theme.palette.common.black),
        }}
      >
        {page}
      </Typography>
      {fourLevels && itemPage && (
        <>
          <Typography
            variant="h3"
            display="inline"
            sx={{ color: (theme) => theme.palette.grey[400] }}
          >
            {` > `}
          </Typography>
          <Typography variant="h2" display="inline">
            {itemPage}
          </Typography>
        </>
      )}
    </Box>
  );
}
