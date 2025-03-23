import type { Theme, Components } from '@mui/material/styles';

import { grey } from 'src/theme/core/palette';

// ----------------------------------------------------------------------

const MuiTypography: Components<Theme>['MuiTypography'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paragraph: ({ theme }) => ({ marginBottom: theme.spacing(2) }),
    gutterBottom: ({ theme }) => ({ marginBottom: theme.spacing(1) }),
  },
  variants: [
    {
      props: { variant: 'h1' },
      style: {
        fontSize: 28,
        fontWeight: 500,
        color: grey[600],
      },
    },
    {
      props: { variant: 'h3' },
      style: {
        fontSize: 20,
        fontWeight: 400,
        color: grey[600],
      },
    },
    {
      props: { variant: 'subtitle2' },
      style: {
        fontSize: 15,
        fontWeight: 500,
        color: grey[500],
      },
    },
    {
      props: { variant: 'body2' },
      style: {
        fontSize: 15,
        fontWeight: 300,
        color: grey[400],
      },
    },
  ],
};

// ----------------------------------------------------------------------

export const typography = { MuiTypography };
