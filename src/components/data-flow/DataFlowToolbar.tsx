'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

// ----------------------------------------------------------------------

type DataFlowToolbarProps = {
  fileName: string;
};

export function DataFlowToolbar({ fileName }: DataFlowToolbarProps) {
  const { t } = useTranslate('data-flow');

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        gap: '12px',
        px: '14px',
        py: '10px',
        backgroundColor: T.bgPanel,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {/* Title (left) — flex:1 spacer balances the right one so the center stays
          truly centered on the full toolbar width while the row keeps its height. */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.textSec }}>
          {t('toolbar.title')}
        </Typography>
      </Box>

      {/* Filename + preview-mode chip (centered, in-flow) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Typography sx={{ fontSize: 15, color: T.textDim, fontFamily: FONT_MONO }}>
          {fileName}
        </Typography>
        <Box
          sx={{
            fontSize: 14,
            fontWeight: 500,
            px: '10px',
            py: '3px',
            borderRadius: '6px',
            backgroundColor: T.bgHover,
            border: `1px solid ${T.border}`,
            color: T.textSec,
          }}
        >
          {t('toolbar.preview')}
        </Box>
      </Box>

      {/* Right spacer — equal width to the title box, keeps the center centered */}
      <Box sx={{ flex: 1, minWidth: 0 }} />
    </Stack>
  );
}
