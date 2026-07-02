'use client';

import { Box, InputBase, Typography, useTheme } from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

// Neutral colors that read on both themes.
const LABEL_COLOR = '#6A6878';
const PLACEHOLDER_COLOR = '#757575';
const RESET_COLOR = '#A8AABA';

export function MemorySearchBar({ value, onChange, onReset }: Props) {
  const { t } = useTranslate('memory');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Field/accent colors — dark spec with light-mode equivalents.
  const containerBg = isDark ? '#212447' : '#EFF6FF';
  const containerBorder = isDark ? '#1D2654' : '#DFEAFF';
  const fieldBg = isDark ? '#202838' : '#FFFFFF';
  const fieldOutline = isDark ? '#33343F' : '#E0E4EB';
  const dividerColor = isDark ? '#33343F' : '#E0E4EB';
  const valueColor = isDark ? '#E9E6EF' : '#373F4E';

  const fieldSx = {
    height: 38,
    px: '12px',
    gap: '8px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '6px',
    backgroundColor: fieldBg,
    outline: `1px solid ${fieldOutline}`,
    outlineOffset: '-1px',
  };

  const labelSx = { color: LABEL_COLOR, fontSize: 15, whiteSpace: 'nowrap' };
  const dividerSx = { color: dividerColor, fontSize: 15 };

  return (
    <Box
      sx={{
        width: '100%',
        px: '14px',
        py: '12px',
        gap: '10px',
        display: 'flex',
        alignItems: 'center',
        // Accent strip inside the shared table container (keeps its own bg + border).
        backgroundColor: containerBg,
        borderBottom: `1px solid ${containerBorder}`,
      }}
    >
      {/* Search column — currently the API only supports searching by issue code (q) */}
      <Box sx={{ ...fieldSx, width: 240, flexShrink: 0 }}>
        <Typography sx={labelSx}>{t('search_ui.search_column')}</Typography>
        <Typography sx={dividerSx}>|</Typography>
        <Typography sx={{ color: valueColor, fontSize: 15, flex: 1, whiteSpace: 'nowrap' }}>
          {t('search_ui.search_column_code')}
        </Typography>
      </Box>

      {/* Search term input — bound to the `code` query that drives the search API */}
      <Box sx={{ ...fieldSx, flex: 1 }}>
        <Typography sx={labelSx}>{t('search_ui.search_term')}</Typography>
        <Typography sx={dividerSx}>|</Typography>
        <InputBase
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('search_ui.search_placeholder')}
          sx={{
            flex: 1,
            color: valueColor,
            fontSize: 15,
            '& input::placeholder': { color: PLACEHOLDER_COLOR, opacity: 1 },
          }}
        />
        <Iconify icon="eva:search-fill" width={14} sx={{ color: LABEL_COLOR, flexShrink: 0 }} />
      </Box>

      {/* Reset — clears the search term */}
      <Box
        component="button"
        type="button"
        onClick={onReset}
        sx={{
          ...fieldSx,
          px: '16px',
          gap: '7px',
          flexShrink: 0,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Iconify icon="eva:close-circle-outline" width={14} sx={{ color: RESET_COLOR }} />
        <Typography sx={{ color: RESET_COLOR, fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap' }}>
          {t('search_ui.reset')}
        </Typography>
      </Box>
    </Box>
  );
}
