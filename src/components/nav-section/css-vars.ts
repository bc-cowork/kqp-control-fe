import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const bulletColor = {
  dark: '#282F37',
  light: '#EDEFF2',
};

function colorVars(theme: Theme, variant?: 'vertical' | 'mini' | 'horizontal') {
  const {
    vars: { palette },
  } = theme;

  // The sidebar is always dark (#202838) in both themes, so these colors are pinned to
  // the dark-sidebar design values instead of theme.palette.* (which flip in light mode).
  return {
    '--nav-item-color': '#F0F1F5',
    '--nav-item-hover-bg': '#373F4E',
    '--nav-item-pressed-bg': palette.grey[600],
    '--nav-item-caption-color': '#AFB7C8',
    // root
    '--nav-item-root-active-color': palette.primary.main,
    '--nav-item-root-active-color-on-dark': palette.primary.light,
    '--nav-item-root-active-bg': palette.primary.light,
    '--nav-item-root-active-hover-bg': palette.primary.main,
    '--nav-item-root-open-color': '#FFFFFF',
    '--nav-item-root-open-bg': '#373F4E',
    // sub
    '--nav-item-sub-active-color': '#FFFFFF',
    '--nav-item-sub-active-bg': palette.primary.main,
    '--nav-item-sub-open-color': '#FFFFFF',
    '--nav-item-sub-open-bg': '#373F4E',
    ...(variant === 'vertical' && {
      '--nav-item-sub-active-bg': palette.primary.main,
      '--nav-subheader-color': '#AFB7C8',
      '--nav-subheader-hover-color': '#FFFFFF',
    }),
  };
}

// ----------------------------------------------------------------------

function verticalVars(theme: Theme) {
  const { shape, spacing } = theme;

  return {
    ...colorVars(theme, 'vertical'),
    '--nav-item-gap': '4px',
    '--nav-item-gap-sub': '4px',
    '--nav-item-radius': `${shape.borderRadius}px`,
    '--nav-item-pt': spacing(0.5),
    '--nav-item-pr': spacing(1),
    '--nav-item-pb': spacing(0.5),
    '--nav-item-pl': spacing(1.5),
    // root
    '--nav-item-root-height': '44px',
    // sub
    '--nav-item-sub-height': '40px',
    // icon
    '--nav-icon-size': '24px',
    '--nav-icon-margin': spacing(0, 1.5, 0, 0),
    // bullet
    '--nav-bullet-size': '12px',
    '--nav-bullet-light-color': bulletColor.light,
    '--nav-bullet-dark-color': bulletColor.dark,
  };
}

// ----------------------------------------------------------------------

function miniVars(theme: Theme) {
  const { shape, spacing } = theme;

  return {
    ...colorVars(theme, 'mini'),
    '--nav-item-gap': '8px',
    '--nav-item-radius': `${shape.borderRadius}px`,
    // root
    '--nav-item-root-height': '44px',
    '--nav-item-root-padding': spacing(1, 0.5, 0.75, 0.5),
    // sub
    '--nav-item-sub-height': '40px',
    '--nav-item-sub-padding': spacing(0, 1),
    // icon
    '--nav-icon-size': '22px',
    '--nav-icon-root-margin': spacing(0, 0, 0.75, 0),
    '--nav-icon-sub-margin': spacing(0, 1, 0, 0),
  };
}

// ----------------------------------------------------------------------

function horizontalVars(theme: Theme) {
  const { shape, spacing } = theme;

  return {
    ...colorVars(theme, 'horizontal'),
    '--nav-item-gap': spacing(0.75),
    '--nav-height': '56px',
    '--nav-item-radius': `${shape.borderRadius * 0.75}px`,
    // root
    '--nav-item-root-height': '32px',
    '--nav-item-root-padding': spacing(0, 0.75),
    // sub
    '--nav-item-sub-height': '34px',
    '--nav-item-sub-padding': spacing(0, 1),
    // icon
    '--nav-icon-size': '22px',
    '--nav-icon-sub-margin': spacing(0, 1, 0, 0),
    '--nav-icon-root-margin': spacing(0, 1, 0, 0),
  };
}

// ----------------------------------------------------------------------

export const navSectionCssVars = {
  mini: miniVars,
  vertical: verticalVars,
  horizontal: horizontalVars,
};
