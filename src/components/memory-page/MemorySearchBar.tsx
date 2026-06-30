'use client';

import { Box, InputBase, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

// Field colors come straight from the design spec (dark theme).
const FIELD_BG = '#202838';
const FIELD_OUTLINE = '#33343F';
const LABEL_COLOR = '#6A6878';
const DIVIDER_COLOR = '#33343F';
const VALUE_COLOR = '#E9E6EF';
const PLACEHOLDER_COLOR = '#757575';
const RESET_COLOR = '#A8AABA';

const fieldSx = {
  height: 38,
  px: '12px',
  gap: '8px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '6px',
  backgroundColor: FIELD_BG,
  outline: `1px solid ${FIELD_OUTLINE}`,
  outlineOffset: '-1px',
};

const labelSx = { color: LABEL_COLOR, fontSize: 15, whiteSpace: 'nowrap' };
const dividerSx = { color: DIVIDER_COLOR, fontSize: 15 };

export function MemorySearchBar({ value, onChange, onReset }: Props) {
  const { t } = useTranslate('memory');

  return (
    <Box
      sx={{
        width: '100%',
        px: '14px',
        py: '12px',
        gap: '10px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#212447',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        outline: '1px solid #1D2654',
        outlineOffset: '-1px',
      }}
    >
      {/* Search column — currently the API only supports searching by issue code (q) */}
      <Box sx={{ ...fieldSx, width: 240, flexShrink: 0 }}>
        <Typography sx={labelSx}>{t('search_ui.search_column')}</Typography>
        <Typography sx={dividerSx}>|</Typography>
        <Typography sx={{ color: VALUE_COLOR, fontSize: 15, flex: 1, whiteSpace: 'nowrap' }}>
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
            color: VALUE_COLOR,
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
