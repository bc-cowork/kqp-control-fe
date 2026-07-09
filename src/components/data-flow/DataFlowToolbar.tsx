'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type DataFlowToolbarProps = {
  fileName: string;
  onTestEnvClick?: () => void;
};

export function DataFlowToolbar({ fileName, onTestEnvClick }: DataFlowToolbarProps) {
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
      {/* Title */}
      <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.textSec }}>
        {t('toolbar.title')}
      </Typography>

      {/* Filename + preview-mode chip (centered) */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <Typography sx={{ fontSize: 15, color: T.textDim, fontFamily: FONT_MONO }}>
          {fileName}
        </Typography>
        <Box
          sx={{
            fontSize: 14,
            fontWeight: 500,
            px: '10px',
            py: '3px',
            borderRadius: '5px',
            backgroundColor: `${T.primary}26`,
            color: T.accent,
          }}
        >
          {t('toolbar.preview')}
        </Box>
      </Box>

      {/* Test environment button */}
      <Button
        disableRipple
        onClick={onTestEnvClick}
        sx={{
          height: 32,
          px: '14px',
          minWidth: 0,
          background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          color: ACCENT2,
          fontSize: 15,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': { background: `linear-gradient(to top, ${ACCENT2}77, ${ACCENT2}22)` },
        }}
      >
        {t('toolbar.test_env')}
      </Button>
    </Stack>
  );
}
