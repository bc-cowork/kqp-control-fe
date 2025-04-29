'use client';

import { Box, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type LabelValueRowProps = {
  label: string;
  value: string | number | undefined;
};

const LabelValueRow = ({ label, value }: LabelValueRowProps) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
    <Typography sx={{ color: (theme) => theme.palette.grey[300], fontSize: 15, width: '150px' }}>
      {label}
    </Typography>
    <Typography sx={{ color: (theme) => theme.palette.grey[50], fontSize: 17, fontWeight: 500 }}>
      {value}
    </Typography>
  </Stack>
);

// ----------------------------------------------------------------------

type Props = {
  issueInfo: any;
};

export function MemoryItemInfo({ issueInfo }: Props) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #202838 80%, #373F4E 100%)',
        borderRadius: '8px',
        px: 3,
        pt: 3,
        pb: 2,
      }}
    >
      <LabelValueRow label="Seq" value={issueInfo?.seq} />
      <LabelValueRow label="Code" value={issueInfo.code} />
      <LabelValueRow label="Name" value={issueInfo.name} />
      <LabelValueRow
        label="G1.SSN-ID"
        value={
          Array.isArray(issueInfo.g1_ssn_id)
            ? `[${issueInfo.g1_ssn_id.join(' / ')}]`
            : issueInfo.g1_ssn_id
        }
      />
      <LabelValueRow label="Compet" value={issueInfo.compet} />
    </Box>
  );
}
