'use client';

import React from 'react';

import { Box, InputBase, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

// ----------------------------------------------------------------------

type Props = {
  value: number | null;
  setValue: (value: number | null) => void;
  onSearch: () => void;
  onReset: () => void;
};

/**
 * Top filter bar for the Audit Log frame-list screen: a single Frame Seq input
 * plus Search and Reset. Search jumps to the entered frame; Reset clears the input.
 */
const AuditFrameListFilterBar: React.FC<Props> = ({ value, setValue, onSearch, onReset }) => {
  const { t } = useTranslate('audit-frame-list');

  const onEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch();
    }
  };

  const fieldSx = {
    flex: 1,
    minWidth: 0,
    height: 38,
    px: 1.5,
    bgcolor: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  } as const;

  const buttonSx = {
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
  } as const;

  const iconSx = { width: 16, height: 16, flexShrink: 0 } as const;

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
      {/* Frame Seq field */}
      <Box sx={fieldSx}>
        <Typography sx={{ fontSize: 15, color: T.textDim, whiteSpace: 'nowrap' }}>
          {t('audit_log_frame_detail.frame_seq')}
        </Typography>
        <Box sx={{ color: T.border }}>|</Box>
        <InputBase
          type="number"
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value ? Number(e.target.value) : null)}
          onKeyDown={onEnter}
          sx={{ flex: 1, minWidth: 0, fontSize: 15, color: T.textPrim, fontFamily: FONT_MONO }}
        />
      </Box>

      {/* Search */}
      <Box component="button" type="button" onClick={onSearch} sx={buttonSx}>
        <Box component="svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" sx={iconSx}>
          <circle cx="7.333" cy="7.333" r="5.333" stroke="currentColor" strokeWidth="1.33" />
          <path d="M11.5 11.5L14 14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" />
        </Box>
        {t('search_ui.search')}
      </Box>

      {/* Reset */}
      <Box component="button" type="button" onClick={onReset} sx={buttonSx}>
        <Box component="svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" sx={{ width: 13, height: 13, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="m15 9-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" />
        </Box>
        {t('search_ui.reset')}
      </Box>
    </Box>
  );
};

export default AuditFrameListFilterBar;
