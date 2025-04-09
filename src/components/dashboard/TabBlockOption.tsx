import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import ButtonBase from '@mui/material/ButtonBase';

import { varAlpha, stylesMode } from 'src/theme/styles';

// ----------------------------------------------------------------------

type BlockOptionProps = ButtonBaseProps & {
  selected?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
};

export function TabBlockOption({ icon, label, selected, sx, ...other }: BlockOptionProps) {
  return (
    <ButtonBase
      disableRipple
      sx={{
        '--border-color': (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        '--active-color': (theme) =>
          `linear-gradient(135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.main})`,
        width: 1,
        borderRadius: 1.5,
        lineHeight: '18px',
        color: (theme) => theme.palette.grey[400],
        bgcolor: (theme) => theme.palette.grey[200],
        border: `solid 1px transparent`,
        fontWeight: 'fontWeightSemiBold',
        fontSize: (theme) => theme.typography.pxToRem(13),
        ...(selected && {
          color: (theme) => theme.palette.grey[400],
          bgcolor: (theme) => theme.palette.common.white,
          borderColor: 'var(--border-color)',
          boxShadow: (theme) =>
            `-8px 8px 20px -4px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
          [stylesMode.dark]: {
            boxShadow: (theme) =>
              `-8px 8px 20px -4px ${varAlpha(theme.vars.palette.common.blackChannel, 0.12)}`,
          },
          //   [`& .${svgColorClasses.root}`]: {
          //     background: 'var(--active-color)',
          //   },
        }),
        ...sx,
      }}
      {...other}
    >
      {icon && icon}
      {label && label}
    </ButtonBase>
  );
}
