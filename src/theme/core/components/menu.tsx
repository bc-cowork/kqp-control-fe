import type { Theme, Components } from '@mui/material/styles';

import { menuItem } from '../../styles';

// ----------------------------------------------------------------------

const MuiMenuItem: Components<Theme>['MuiMenuItem'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      ...menuItem(theme),
      backgroundColor: theme.palette.common.white,
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },
      '&:active': {
        backgroundColor: theme.palette.grey[300],
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const menu = { MuiMenuItem };
