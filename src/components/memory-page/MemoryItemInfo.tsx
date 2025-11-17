'use client';

import { Box, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

import { useTranslate } from 'src/locales';

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
  const { t } = useTranslate('memory');
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #202838 80%, #373F4E 100%)',
        borderRadius: '8px',
        px: 2,
        pt: 2,
        pb: 2,
        border: `1px solid ${grey[700]}`
      }}
    >
      <LabelValueRow label={t('item.left.seq')} value={issueInfo?.seq} />
      <LabelValueRow label={t('item.left.code')} value={issueInfo.code} />
      <LabelValueRow label={t('item.left.name')} value={issueInfo.name} />
      <LabelValueRow
        label={t('item.left.g1_ssn_id')}
        value={
          Array.isArray(issueInfo.g1_ssn_id)
            ? `[${issueInfo.g1_ssn_id.join(' / ')}]`
            : issueInfo.g1_ssn_id
        }
      />
      <LabelValueRow label={t('item.left.compet')} value={issueInfo.compet} />
    </Box>
  );
}
