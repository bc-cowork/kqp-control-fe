import React from 'react';

import { Box, SvgIcon, IconButton } from '@mui/material';

import { grey, common } from 'src/theme/core';

type ArrowSelectorProps = {
  label: string;
  value: 'next' | 'prev' | undefined;
  setValue: (value: 'next' | 'prev' | undefined) => void;
};

const ArrowSelector = ({ label, value, setValue }: ArrowSelectorProps) => {
  // Colors for different states
  const bgColors = {
    default: common.white,
    hover: grey[50],
    pressed: grey[300],
    selected: grey[400],
  };

  const colors = {
    default: grey[400],
    hover: grey[400],
    pressed: grey[400],
    selected: common.white,
  };

  const handlePrevClick = () => {
    setValue('prev');
  };

  const handleNextClick = () => {
    setValue('next');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        backgroundColor: common.white,
        height: '40px',
        padding: '0 8px',
      }}
    >
      {/* Label and Divider */}
      <Box
        component="span"
        sx={{
          fontSize: '15px',
          color: grey[400],
          marginRight: '8px',
        }}
      >
        {label}
      </Box>
      <Box
        component="div"
        sx={{
          width: '1px',
          height: '12px',
          backgroundColor: grey[200],
          marginRight: '8px',
        }}
      />

      {/* Left Arrow (Prev) */}
      <IconButton
        onClick={handlePrevClick}
        sx={{
          padding: '4px',
          width: 32,
          height: 32,
          borderRadius: '4px',
          mr: 0.5,
          color: value === 'prev' ? colors.selected : colors.default,
          backgroundColor: value === 'prev' ? bgColors.selected : bgColors.default,
          '&:hover': {
            color: value === 'prev' ? colors.selected : colors.hover,
            backgroundColor: value === 'prev' ? bgColors.selected : bgColors.hover,
          },
          '&:active': {
            color: colors.pressed,
            backgroundColor: bgColors.pressed,
          },
        }}
      >
        <SvgIcon width={20} height={20}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.66699 10.0013C1.66699 10.1826 1.74087 10.3562 1.87159 10.4819L6.20492 14.6485C6.47032 14.9037 6.89235 14.8954 7.14755 14.63C7.40274 14.3646 7.39447 13.9426 7.12907 13.6874L3.98884 10.668L17.6663 10.668C18.0345 10.668 18.333 10.3695 18.333 10.0013C18.333 9.63311 18.0345 9.33464 17.6663 9.33464L3.98884 9.33464L7.12907 6.31519C7.39447 6.06 7.40274 5.63797 7.14755 5.37256C6.89235 5.10716 6.47032 5.09889 6.20492 5.35408L1.87159 9.52075C1.74087 9.64644 1.66699 9.81996 1.66699 10.0013Z"
              fill={value === 'prev' ? colors.selected : colors.default}
            />
          </svg>
        </SvgIcon>
      </IconButton>

      {/* Right Arrow (Next) */}
      <IconButton
        onClick={handleNextClick}
        sx={{
          padding: '4px',
          width: 32,
          height: 32,
          borderRadius: '4px',
          color: value === 'next' ? colors.selected : colors.default,
          backgroundColor: value === 'next' ? bgColors.selected : bgColors.default,
          '&:hover': {
            color: value === 'next' ? colors.selected : colors.hover,
            backgroundColor: value === 'next' ? bgColors.selected : bgColors.hover,
          },
          '&:active': {
            color: colors.pressed,
            backgroundColor: bgColors.pressed,
          },
        }}
      >
        <SvgIcon width={20} height={20}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.333 10.0013C18.333 10.1826 18.2591 10.3562 18.1284 10.4819L13.7951 14.6485C13.5297 14.9037 13.1076 14.8954 12.8525 14.63C12.5973 14.3646 12.6055 13.9426 12.8709 13.6874L16.0112 10.668L2.33366 10.668C1.96547 10.668 1.66699 10.3695 1.66699 10.0013C1.66699 9.63311 1.96547 9.33464 2.33366 9.33464L16.0112 9.33464L12.8709 6.31519C12.6055 6.06 12.5973 5.63797 12.8525 5.37256C13.1076 5.10716 13.5297 5.09889 13.7951 5.35408L18.1284 9.52075C18.2591 9.64644 18.333 9.81996 18.333 10.0013Z"
              fill={value === 'next' ? colors.selected : colors.default}
            />
          </svg>
        </SvgIcon>
      </IconButton>
    </Box>
  );
};

export default ArrowSelector;
