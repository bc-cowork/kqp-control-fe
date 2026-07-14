'use client';

import React from 'react';

import { Box, InputBase, IconButton, Typography } from '@mui/material';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';

import type { Filter } from '../common/AddFilter';

// ----------------------------------------------------------------------

type Props = {
  filters: Filter | null;
  setFilters: React.Dispatch<React.SetStateAction<Filter | null>>;
  onApply: (filters: Filter) => void;
  onResetClick?: () => void;
};

/**
 * Inline filter bar for the nested Audit Log frame detail screen.
 * Replaces the popover-based AddFilter on this screen per the updated design:
 * a single always-visible row of Cond / Count / Scan inputs plus Search and Reset.
 */
const AuditFrameFilterBar: React.FC<Props> = ({ filters, setFilters, onApply, onResetClick }) => {
  const { t } = useTranslate('audit-frame-detail');

  const side = (filters?.side as string) || 'next';

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onApply(filters ?? {});
  };

  const handleReset = () => {
    setFilters(null);
    onResetClick?.();
  };

  const onEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  // Indigo-tint filter bar (v5 mauve-dark palette).
  const fieldBg = T.bg;
  const fieldBorder = T.border;
  const labelColor = T.textDim;
  const dividerColor = T.border;
  const placeholderColor = T.textFaint;
  const valueColor = T.textPrim;
  const buttonText = T.textSec;
  const arrowSelectedBg = T.bgHover;
  const arrowIcon = T.textPrim;
  const arrowIconMuted = T.textDim;

  const fieldSx = {
    height: 38,
    px: 1.5,
    bgcolor: fieldBg,
    borderRadius: '6px',
    border: `1px solid ${fieldBorder}`,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  } as const;

  const labelSx = { fontSize: 15, color: labelColor, whiteSpace: 'nowrap' } as const;

  const buttonSx = {
    height: 38,
    px: 2,
    flexShrink: 0,
    bgcolor: T.bgPanel,
    border: `1px solid ${T.border}`,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: 0.875,
    cursor: 'pointer',
    color: buttonText,
    '&:hover': { bgcolor: T.bgHover, color: buttonText },
  } as const;

  // Explicit CSS sizing so the icon never grows as a flex child.
  const iconSx = { width: 16, height: 16, flexShrink: 0 } as const;

  const buttonTextSx = {
    fontSize: 15,
    fontWeight: 500,
    color: buttonText,
    whiteSpace: 'nowrap',
  } as const;

  const divider = (
    <Box sx={{ width: '1px', height: 14, flexShrink: 0, bgcolor: dividerColor }} />
  );

  return (
    <Box
      sx={{
        width: '100%',
        p: '12px 14px',
        bgcolor: '#4A3BFF0D',
        border: '1px solid #4A3BFF55',
        borderRadius: '8px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
      }}
    >
      {/* Cond */}
      <Box sx={{ ...fieldSx, flex: 1, minWidth: 0 }}>
        <Typography sx={labelSx}>{t('filter_bar.cond')}</Typography>
        {divider}
        <InputBase
          value={(filters?.cond as string) || ''}
          onChange={(e) => handleChange('cond', e.target.value)}
          onKeyDown={onEnter}
          placeholder={t('search_ui.input')}
          sx={{
            flex: 1,
            fontSize: 15,
            color: valueColor,
            '& input::placeholder': { color: placeholderColor, opacity: 1 },
          }}
        />
      </Box>

      {/* Count */}
      <Box sx={{ ...fieldSx, flex: 1, minWidth: 0 }}>
        <Typography sx={labelSx}>{t('filter_bar.count')}</Typography>
        {divider}
        <InputBase
          type="number"
          value={(filters?.count as string) || ''}
          onChange={(e) => handleChange('count', e.target.value)}
          onKeyDown={onEnter}
          placeholder={t('search_ui.input')}
          sx={{
            flex: 1,
            fontSize: 15,
            color: valueColor,
            '& input::placeholder': { color: placeholderColor, opacity: 1 },
          }}
        />
      </Box>

      {/* Scan */}
      <Box sx={{ ...fieldSx, width: 152, flexShrink: 0, gap: 1 }}>
        <Typography sx={labelSx}>{t('filter_bar.scan')}</Typography>
        {divider}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
          <IconButton
            onClick={() => handleChange('side', 'prev')}
            sx={{
              width: 32,
              height: 32,
              p: 0.5,
              borderRadius: '4px',
              bgcolor: side === 'prev' ? arrowSelectedBg : 'transparent',
            }}
          >
            <Box
              component="svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.4715 2.86177C10.7318 3.12212 10.7318 3.54423 10.4715 3.80458L6.27606 8L10.4715 12.1954C10.7318 12.4558 10.7318 12.8779 10.4715 13.1382C10.2111 13.3986 9.78903 13.3986 9.52868 13.1382L4.86201 8.47157C4.60166 8.21122 4.60166 7.78911 4.86201 7.52876L9.52868 2.86209C9.78903 2.60174 10.2111 2.60142 10.4715 2.86177Z"
                fill={side === 'prev' ? arrowIcon : arrowIconMuted}
              />
            </Box>
          </IconButton>
          <IconButton
            onClick={() => handleChange('side', 'next')}
            sx={{
              width: 32,
              height: 32,
              p: 0.5,
              borderRadius: '4px',
              bgcolor: side === 'next' ? arrowSelectedBg : 'transparent',
            }}
          >
            <Box
              component="svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.52851 2.86177C5.26816 3.12212 5.26816 3.54423 5.52851 3.80458L9.72393 8L5.52851 12.1954C5.26816 12.4558 5.26816 12.8779 5.52851 13.1382C5.78886 13.3986 6.21097 13.3986 6.47132 13.1382L11.138 8.47157C11.3983 8.21122 11.3983 7.78911 11.138 7.52876L6.47132 2.86209C6.21097 2.60174 5.78886 2.60142 5.52851 2.86177Z"
                fill={side === 'next' ? arrowIcon : arrowIconMuted}
              />
            </Box>
          </IconButton>
        </Box>
      </Box>

      {/* Search */}
      <Box component="button" type="button" onClick={handleSearch} sx={buttonSx}>
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
      <Box component="button" type="button" onClick={handleReset} sx={buttonSx}>
        <Box
          component="svg"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          sx={iconSx}
        >
          <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.33" />
          <path
            d="M6 6l4 4M10 6l-4 4"
            stroke="currentColor"
            strokeWidth="1.33"
            strokeLinecap="round"
          />
        </Box>
        <Typography sx={buttonTextSx}>{t('search_ui.reset')}</Typography>
      </Box>
    </Box>
  );
};

export default AuditFrameFilterBar;
