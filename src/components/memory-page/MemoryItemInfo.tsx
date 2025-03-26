'use client';

import { Box, Grid, Typography } from '@mui/material'; // Import Next.js Link for routing

// ----------------------------------------------------------------------

type Props = {
  issueInfo: any;
};

export function MemoryItemInfo({ issueInfo }: Props) {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.common.white,
        borderRadius: '8px',
        px: 3,
        py: 3.5,
        height: '100%',
      }}
    >
      <Grid container>
        <Grid md={4}>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[400], mb: 2, fontSize: 15 }}
          >
            Seq
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[400], mb: 2, fontSize: 15 }}
          >
            Code
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[400], mb: 2, fontSize: 15 }}
          >
            Name
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[400], mb: 2, fontSize: 15 }}
          >
            G1.SSN-ID
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[400], fontSize: 15 }}
          >
            Compet
          </Typography>
        </Grid>
        <Grid md={8}>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[600], mb: 2, fontSize: 15 }}
          >
            {issueInfo?.seq}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[600], mb: 2, fontSize: 15 }}
          >
            {issueInfo.code}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[600], mb: 2, fontSize: 15 }}
          >
            {issueInfo.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[600], mb: 2, fontSize: 15 }}
          >
            {Array.isArray(issueInfo.g1_ssn_id)
              ? `[${issueInfo.g1_ssn_id.join(' / ')}]`
              : issueInfo.g1_ssn_id}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.grey[600], fontSize: 15 }}
          >
            {issueInfo.compet}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
