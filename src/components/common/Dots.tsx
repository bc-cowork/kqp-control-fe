import type { Theme } from '@emotion/react';
import type { SxProps } from '@mui/material';
import type { ColorType } from 'src/theme/core';
import type { MotionProps } from 'framer-motion';

import { m } from 'framer-motion';

import { Box } from '@mui/material';

import { stylesMode } from 'src/theme/styles';

type DotProps = {
  color?: ColorType;
  sx?: SxProps<Theme>;
  animate: MotionProps['animate'];
  transition?: MotionProps['transition'];
};

export function Dot({ color = 'primary', animate, transition, sx, ...other }: DotProps) {
  return (
    <Box
      component={m.div}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.64, ease: [0.43, 0.13, 0.23, 0.96] } },
      }}
      sx={{
        width: 12,
        height: 12,
        top: '50%',
        left: '50%',
        position: 'absolute',
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        animate={animate}
        transition={
          transition ?? {
            duration: 6,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }
        }
        sx={{
          width: 1,
          height: 1,
          borderRadius: '50%',
          boxShadow: (theme) => `0px -2px 4px 0px ${theme.vars.palette[color].main} inset`,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.vars.palette[color].lighter}, ${theme.vars.palette[color].light})`,
          [stylesMode.dark]: {
            boxShadow: (theme) => `0px -2px 4px 0px ${theme.vars.palette[color].dark} inset`,
          },
          ...sx,
        }}
      />
    </Box>
  );
}

export function Dots() {
  return (
    <>
      <Dot
        color="error"
        animate={{ x: 24 }}
        sx={{ width: 14, height: 14, transform: 'translate(calc(50% - 457px), calc(50% - 259px))' }}
      />

      <Dot
        color="warning"
        animate={{ y: 24 }}
        sx={{ transform: 'translate(calc(50% - 356px), calc(50% + 37px))' }}
      />

      <Dot
        color="info"
        animate={{ x: 24 }}
        sx={{ transform: 'translate(calc(50% + 332px), calc(50% + 135px))' }}
      />

      <Dot
        color="secondary"
        animate={{ x: 24 }}
        sx={{ transform: 'translate(calc(50% + 430px), calc(50% - 160px))' }}
      />

      <Dot
        color="success"
        animate={{ y: 24 }}
        sx={{ transform: 'translate(calc(50% + 136px), calc(50% + 332px))' }}
      />
    </>
  );
}
