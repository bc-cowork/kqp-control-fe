'use client';

// core (MUI)
import { koKR as krKrCore } from '@mui/material/locale';
// date pickers (MUI)
import { enUS as enUSDate, koKR as koKRRDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { enUS as enUSDataGrid, koKR as koKRDataGrid } from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'ko',
    label: 'Korean',
    countryCode: 'KR',
    adapterLocale: 'kr',
    numberFormat: { code: 'ko-KR', currency: '₩' },
    systemValue: {
      components: { ...krKrCore.components, ...koKRRDate.components, ...koKRDataGrid.components },
    },
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
