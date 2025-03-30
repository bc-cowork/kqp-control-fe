import React from 'react';

import { Box, SvgIcon, IconButton } from '@mui/material';

import { grey } from 'src/theme/core';

type ArrowSelectorProps = {
  label: string;
  value: 'next' | 'prev' | undefined;
  setValue: (value: 'next' | 'prev' | undefined) => void;
};

const ArrowSelector = ({ label, value, setValue }: ArrowSelectorProps) => {
  // Colors for different states
  const colors = {
    default: grey[500], // Default color for arrows
    hover: grey[700], // Color on hover
    pressed: grey[900], // Color when pressed (clicked)
    selected: '#1976d2', // Color when selected (MUI primary color)
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
        border: '1px solid #E0E0E0', // Light gray border
        borderRadius: '8px', // Rounded corners
        backgroundColor: '#fff', // White background
        height: '40px', // Match the height in the image
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
          height: '24px',
          backgroundColor: '#E0E0E0', // Divider color
          marginRight: '8px',
        }}
      />

      {/* Left Arrow (Prev) */}
      <IconButton
        onClick={handlePrevClick}
        sx={{
          padding: '4px',
          color: value === 'prev' ? colors.selected : colors.default,
          '&:hover': {
            color: value === 'prev' ? colors.selected : colors.hover,
          },
          '&:active': {
            color: colors.pressed,
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
              d="M12.5 5L7.5 10L12.5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SvgIcon>
      </IconButton>

      {/* Right Arrow (Next) */}
      <IconButton
        onClick={handleNextClick}
        sx={{
          padding: '4px',
          color: value === 'next' ? colors.selected : colors.default,
          '&:hover': {
            color: value === 'next' ? colors.selected : colors.hover,
          },
          '&:active': {
            color: colors.pressed,
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
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SvgIcon>
      </IconButton>
    </Box>
  );
};

export default ArrowSelector;
