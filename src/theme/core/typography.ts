import type { TypographyOptions } from '@mui/material/styles/createTypography';

import { pxToRem, responsiveFontSizes } from '../styles/utils';

// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
  interface TypographyVariantsOptions {
    fontSecondaryFamily?: React.CSSProperties['fontFamily'];
    fontWeightSemiBold?: React.CSSProperties['fontWeight'];
  }
  interface ThemeVars {
    typography: Theme['typography'];
  }
}

// ----------------------------------------------------------------------

export const defaultFont = 'Roboto';

export const primaryFont = defaultFont;

export const secondaryFont = defaultFont;

// ----------------------------------------------------------------------

export const typography: TypographyOptions = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  h1: {
    fontWeight: 600,
    lineHeight: 80 / 64,
    fontSize: pxToRem(26),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 52, md: 26, lg: 26 }),
  },
  h2: {
    fontWeight: 500,
    lineHeight: 64 / 48,
    fontSize: pxToRem(22),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 40, md: 22, lg: 22 }),
  },
  h3: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 26, md: 20, lg: 20 }),
  },
  h4: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 20, md: 18, lg: 18 }),
  },
  h5: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 19, md: 16, lg: 16 }),
  },
  h6: {
    fontWeight: 400,
    lineHeight: 28 / 18,
    fontSize: pxToRem(15),
    ...responsiveFontSizes({ sm: 18, md: 15, lg: 15 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'unset',
  },
};
