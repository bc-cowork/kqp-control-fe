'use client';

import React from 'react';

import { Box, useTheme, InputBase, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const containerBg = isDark ? '#212447' : '#EFF6FF';
  const containerBorder = isDark ? '#1D2654' : '#DFEAFF';
  const fieldBg = isDark ? '#202838' : '#FFFFFF';
  const fieldBorder = isDark ? '#4E576A' : '#E0E4EB';
  const labelColor = '#667085';
  const dividerColor = isDark ? '#4E576A' : '#E0E4EB';
  const valueColor = isDark ? '#F0F1F5' : '#373F4E';
  const buttonBg = isDark ? '#202838' : '#FFFFFF';
  const buttonBorder = isDark ? '#33343F' : '#E0E4EB';
  const buttonText = '#A8AABA';

  const onEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch();
    }
  };

  const buttonSx = {
    height: 38,
    px: 2,
    flexShrink: 0,
    bgcolor: buttonBg,
    border: `1px solid ${buttonBorder}`,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: 0.875,
    cursor: 'pointer',
    color: buttonText,
  } as const;

  const iconSx = { width: 16, height: 16, flexShrink: 0 } as const;
  const buttonTextSx = {
    fontSize: 15,
    fontWeight: 500,
    color: buttonText,
    whiteSpace: 'nowrap',
  } as const;

  return (
    <Box
      sx={{
        width: '100%',
        px: 1.5,
        py: 2,
        bgcolor: containerBg,
        border: `1px solid ${containerBorder}`,
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      {/* Frame Seq field */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: 42,
          px: 1.5,
          bgcolor: fieldBg,
          borderRadius: '8px',
          border: `1px solid ${fieldBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: 15, color: labelColor, whiteSpace: 'nowrap' }}>
          {t('audit_log_frame_detail.frame_seq')}
        </Typography>
        <Box sx={{ width: '1px', height: 12, flexShrink: 0, bgcolor: dividerColor }} />
        <InputBase
          type="number"
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value ? Number(e.target.value) : null)}
          onKeyDown={onEnter}
          sx={{ flex: 1, fontSize: 15, color: valueColor }}
        />
      </Box>

      {/* Search */}
      <Box component="button" type="button" onClick={onSearch} sx={buttonSx}>
        <Box
          component="svg"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          sx={iconSx}
        >
          <circle cx="7.333" cy="7.333" r="5.333" stroke="currentColor" strokeWidth="1.33" />
          <path d="M11.5 11.5L14 14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" />
        </Box>
        <Typography sx={buttonTextSx}>{t('search_ui.search')}</Typography>
      </Box>

      {/* Reset */}
      <Box component="button" type="button" onClick={onReset} sx={buttonSx}>
        <Box
          component="svg"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          sx={iconSx}
        >
          <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.33" />
          <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" />
        </Box>
        <Typography sx={buttonTextSx}>{t('search_ui.reset')}</Typography>
      </Box>
    </Box>
  );
};

export default AuditFrameListFilterBar;
