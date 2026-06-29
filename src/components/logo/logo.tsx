'use client';

import type { BoxProps } from '@mui/material/Box';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  isWhite?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      width,
      href = '/',
      height,
      isSingle = true,
      isWhite = false,
      disableLink = false,
      className,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/${isWhite ? 'PMR-logo' : 'PMR-logo'}.svg`}
        sx={{
          width: 39,
          minWidth: 39,
          maxWidth: 39,
          height: 28,
          flexShrink: 0,
          objectFit: 'contain',
          marginLeft: theme.spacing(-1),
        }}
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/${isWhite ? 'PMR-logo-white' : 'PMR-logo-light'}.svg`}
        width="123px"
        height="28px"
        marginLeft={theme.spacing(-1)}
      />
    );

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);

export const LogoAnimated = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      width,
      href = '/',
      height,
      isSingle = true,
      isWhite = false,
      disableLink = false,
      className,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/animated-logo-PMR.svg`}
        sx={{
          width: 70,
          height: 40,
          flexShrink: 0,
          objectFit: 'contain',
          marginLeft: theme.spacing(-1),
        }}
      />
    );

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {singleLogo}
      </Box>
    );
  }
);
