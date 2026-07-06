'use client';

import { Box, Stack, Typography } from '@mui/material';

import { formatNumber } from 'src/utils/helper';
import { formatDateCustom } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

// ----------------------------------------------------------------------

type LabelValueRowProps = {
  label: string;
  value: string | number | undefined;
};

const LabelValueRow = ({ label, value }: LabelValueRowProps) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Typography sx={{ color: T.textSec, fontSize: 14, width: 96, flexShrink: 0 }}>
      {label}
    </Typography>
    <Typography sx={{ color: T.textSec, fontSize: 16, fontFamily: FONT_MONO }}>{value}</Typography>
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
        background: `linear-gradient(180deg, ${T.bgCard} 0%, ${T.bgPanel} 100%)`,
        borderRadius: '8px',
        border: `1px solid ${T.border}`,
        p: 2,
      }}
    >
      <Stack spacing={1.25}>
        <LabelValueRow label={t('item.left.seq')} value={formatNumber(issueInfo?.seq)} />
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
        <LabelValueRow
          label={t('item.left.compet')}
          value={issueInfo.compet ? formatDateCustom(issueInfo.compet.toString()) : '-'}
        />
      </Stack>
    </Box>
  );
}
