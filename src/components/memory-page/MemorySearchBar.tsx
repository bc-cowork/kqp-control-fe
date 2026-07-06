'use client';

import { useState } from 'react';

import { Box, Popover, InputBase, Typography } from '@mui/material';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

export function MemorySearchBar({ value, onChange, onReset }: Props) {
  const { t } = useTranslate('memory');

  // The API currently only supports searching by issue code (q param), so the
  // search-column dropdown is a single fixed option.
  const columnOptions = [{ value: 'code', label: t('search_ui.search_column_code') }];
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = !!anchor;
  const selected = columnOptions[0];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        bgcolor: '#4A3BFF0D',
        border: '1px solid #4A3BFF55',
        borderRadius: '8px',
        p: '12px 14px',
        flexShrink: 0,
      }}
    >
      {/* Search column — inline dropdown */}
      <Box sx={{ position: 'relative', width: 210, flexShrink: 0 }}>
        <Box
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{
            height: 38,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            bgcolor: T.bg,
            border: `1px solid ${open ? T.primary : T.border}`,
            borderRadius: '6px',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: 15, color: T.textDim, whiteSpace: 'nowrap' }}>
            {t('search_ui.search_column')}
          </Typography>
          <Box sx={{ color: T.border }}>|</Box>
          <Typography sx={{ flex: 1, fontSize: 15, color: T.textPrim }}>
            {selected.label}
          </Typography>
          <Iconify
            icon="eva:chevron-down-fill"
            width={16}
            sx={{ color: T.textDim, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}
          />
        </Box>
        <Popover
          open={open}
          anchorEl={anchor}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                width: 210,
                bgcolor: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: '6px',
                boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
                p: 0.5,
              },
            },
          }}
        >
          {columnOptions.map((o) => (
            <Box
              key={o.value}
              onClick={() => setAnchor(null)}
              sx={{
                p: '7px 10px',
                borderRadius: '4px',
                fontSize: 15,
                color: o.value === selected.value ? T.accent : T.textPrim,
                bgcolor: o.value === selected.value ? `${T.primary}1f` : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: o.value === selected.value ? `${T.primary}1f` : T.bgHover },
              }}
            >
              {o.label}
            </Box>
          ))}
        </Popover>
      </Box>

      {/* Search term — inline input, search icon trailing */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          bgcolor: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
        }}
      >
        <Typography sx={{ fontSize: 15, color: T.textDim, whiteSpace: 'nowrap' }}>
          {t('search_ui.search_term')}
        </Typography>
        <Box sx={{ color: T.border }}>|</Box>
        <InputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('search_ui.search_placeholder')}
          sx={{
            flex: 1,
            minWidth: 0,
            color: T.textPrim,
            fontSize: 15,
            '& input::placeholder': { color: T.textFaint, opacity: 1 },
          }}
        />
        <Iconify icon="eva:search-fill" width={16} sx={{ color: T.textDim, flexShrink: 0 }} />
      </Box>

      {/* Reset — clears the search term */}
      <Box
        component="button"
        type="button"
        onClick={onReset}
        sx={{
          height: 38,
          px: 2,
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.875,
          bgcolor: T.bgPanel,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          color: T.textSec,
          fontSize: 15,
          fontWeight: 500,
          fontFamily: 'inherit',
          cursor: 'pointer',
          '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
        }}
      >
        <Iconify icon="eva:close-circle-outline" width={14} />
        {t('search_ui.reset')}
      </Box>
    </Box>
  );
}
