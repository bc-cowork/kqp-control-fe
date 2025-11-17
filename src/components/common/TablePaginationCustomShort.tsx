'use client';

import type { SxProps } from '@mui/material';
import type { Theme } from 'src/theme/types';

import React from 'react';

import { Box, Stack, SvgIcon } from '@mui/material';

import { grey } from 'src/theme/core';

import { CustomIconButton } from './TablePaginationCustom';

// ----------------------------------------------------------------------

type Props = {
  onPageChange: (newPage: number) => void;
  page: number;
  count: number;
  rowsPerPage: number;
  onFirst: () => void;
  onLast: () => void;
  onPrev: () => void;
  onNext: () => void;
  firstDisabled?: boolean;
  lastDisabled?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  sx?: SxProps<Theme>;
};

const TablePaginationCustomShort = ({
  onPageChange,
  page,
  count,
  rowsPerPage,
  onFirst,
  onLast,
  onPrev,
  onNext,
  firstDisabled = false,
  lastDisabled = false,
  prevDisabled = false,
  nextDisabled = false,
  sx,
}: Props) => {
  // Calculate the last page index
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  // Handle page change
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
    direction: 'prev' | 'next'
  ) => {
    if (direction === 'prev' && onPrev) {
      onPrev();
    } else if (direction === 'next' && onNext) {
      onNext();
    } else {
      onPageChange(newPage);
    }
  };

  // Handle "First" button click
  const handleFirstPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onFirst();
  };

  // Handle "Last" button click
  const handleLastPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onLast();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        ...sx,
      }}
    >
      {/* Navigation buttons */}
      <Stack direction="row" alignItems="center">
        {/* First Page Button (optional) */}
        <CustomIconButton onClick={handleFirstPage} disabled={firstDisabled || page === 0}>
          <SvgIcon sx={{ height: 16, width: 16 }}>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.52258 13.1979C8.74151 13.3949 9.07873 13.3772 9.27578 13.1582C9.47283 12.9393 9.45508 12.6021 9.23615 12.405L4.34327 8.00131L9.23614 3.59773C9.45508 3.40069 9.47283 3.06346 9.27579 2.84453C9.07874 2.62559 8.74152 2.60784 8.52258 2.80488L3.18925 7.60488C3.07687 7.70602 3.0127 7.85011 3.0127 8.0013C3.01269 8.15249 3.07686 8.29658 3.18924 8.39773L8.52258 13.1979ZM13.5688 13.1979C13.7877 13.3949 14.125 13.3772 14.322 13.1582C14.5191 12.9393 14.5013 12.6021 14.2824 12.405L9.3895 8.00131L14.2824 3.59773C14.5013 3.40069 14.5191 3.06346 14.322 2.84453C14.125 2.62559 13.7877 2.60784 13.5688 2.80488L8.23547 7.60488C8.12309 7.70602 8.05892 7.85011 8.05892 8.0013C8.05892 8.15249 8.12309 8.29658 8.23547 8.39773L13.5688 13.1979Z"
                fill={firstDisabled || page === 0 ? grey[300] : '#F0F1F5'}
              />
            </svg>
          </SvgIcon>
        </CustomIconButton>

        {/* Previous Page Button */}
        <CustomIconButton
          onClick={(event) => handleChangePage(event, page - 1, 'prev')}
          disabled={prevDisabled || page === 0}
        >
          <SvgIcon sx={{ height: 16, width: 16 }}>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8963 13.1582C10.6992 13.3772 10.362 13.3949 10.1431 13.1979L4.80975 8.39773C4.69737 8.29658 4.6332 8.15249 4.6332 8.0013C4.6332 7.85011 4.69737 7.70602 4.80975 7.60488L10.1431 2.80488C10.362 2.60784 10.6992 2.62559 10.8963 2.84453C11.0933 3.06346 11.0756 3.40069 10.8566 3.59773L5.96378 8.00131L10.8567 12.405C11.0756 12.6021 11.0933 12.9393 10.8963 13.1582Z"
                fill={prevDisabled || page === 0 ? grey[300] : '#F0F1F5'}
              />
            </svg>
          </SvgIcon>
        </CustomIconButton>

        {/* Next Page Button */}
        <CustomIconButton
          onClick={(event) => handleChangePage(event, page + 1, 'next')}
          disabled={nextDisabled || page >= lastPage}
          sx={{ mr: 0 }}
        >
          <SvgIcon sx={{ height: 16, width: 16 }}>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.1037 13.1582C6.30074 13.3772 6.63797 13.3949 6.85691 13.1979L12.1902 8.39806C12.3026 8.29692 12.3668 8.15284 12.3668 8.00165C12.3668 7.85046 12.3026 7.70637 12.1903 7.60522L6.85693 2.8049C6.638 2.60784 6.30078 2.62558 6.10372 2.84451C5.90667 3.06344 5.92441 3.40067 6.14334 3.59772L11.0362 8.00161L6.14336 12.405C5.92442 12.602 5.90666 12.9393 6.1037 13.1582Z"
                fill={nextDisabled || page >= lastPage ? grey[300] : '#F0F1F5'}
              />
            </svg>
          </SvgIcon>
        </CustomIconButton>

        {/* Last Page Button (optional) */}
        <CustomIconButton
          onClick={handleLastPage}
          disabled={lastDisabled || page >= lastPage}
          sx={{ mr: 0 }}
        >
          <SvgIcon sx={{ height: 16, width: 16 }}>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.90281 13.1979C3.68386 13.3949 3.34664 13.3772 3.1496 13.1582C2.95256 12.9393 2.97032 12.602 3.18926 12.405L8.08212 8.00161L3.18924 3.59772C2.97031 3.40067 2.95257 3.06344 3.14962 2.84451C3.34667 2.62558 3.6839 2.60784 3.90283 2.8049L9.23616 7.60522C9.34854 7.70637 9.4127 7.85046 9.4127 8.00165C9.4127 8.15284 9.34852 8.29692 9.23614 8.39806L3.90281 13.1979ZM8.94903 13.1979C8.73009 13.3949 8.39287 13.3772 8.19583 13.1582C7.99879 12.9393 8.01654 12.602 8.23548 12.405L13.1283 8.00161L8.23546 3.59772C8.01653 3.40067 7.99879 3.06344 8.19585 2.84451C8.3929 2.62558 8.73012 2.60784 8.94905 2.8049L14.2824 7.60522C14.3948 7.70637 14.4589 7.85046 14.4589 8.00165C14.4589 8.15284 14.3947 8.29692 14.2824 8.39806L8.94903 13.1979Z"
                fill={lastDisabled || page >= lastPage ? grey[300] : '#F0F1F5'}
              />
            </svg>
          </SvgIcon>
        </CustomIconButton>
      </Stack>
    </Box>
  );
};

export default TablePaginationCustomShort;
