'use client';

import { Box, Stack, InputBase, Typography } from '@mui/material';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';

import { BtnGhost, FilterField } from 'src/components/v5';

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

  return (
    <Box
      sx={{
        bgcolor: '#4A3BFF0D',
        border: '1px solid #4A3BFF55',
        borderRadius: '8px',
        p: '12px 14px',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-end">
        {/* Search column — fixed to Issue Code */}
        <FilterField
          label={t('search_ui.search_column')}
          value="code"
          options={columnOptions}
          onChange={() => {}}
          width={200}
        />

        {/* Search term — bound to the `code` query that drives the search API */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, color: T.textDim }}>
            {t('search_ui.search_term')}
          </Typography>
          <Box
            sx={{
              height: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              bgcolor: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: '5px',
            }}
          >
            <Iconify icon="eva:search-fill" width={16} sx={{ color: T.textDim, flexShrink: 0 }} />
            <InputBase
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('search_ui.search_placeholder')}
              sx={{
                flex: 1,
                color: T.textPrim,
                fontSize: 15,
                '& input::placeholder': { color: T.textFaint, opacity: 1 },
              }}
            />
          </Box>
        </Box>

        {/* Reset — clears the search term */}
        <BtnGhost icon="eva:close-circle-outline" onClick={onReset}>
          {t('search_ui.reset')}
        </BtnGhost>
      </Stack>
    </Box>
  );
}
