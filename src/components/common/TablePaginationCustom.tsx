'use client';

import type { SxProps } from '@mui/material';
import type { Theme } from 'src/theme/types';

import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Select,
  Button,
  SvgIcon,
  MenuItem,
  useTheme,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';

import { grey } from 'src/theme/core';

// Styled components (unchanged)
const CustomSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: 4,
  fontSize: 15,
  '& .MuiSelect-select': {
    padding: '3px !important',
    paddingLeft: '8px !important',
    paddingRight: '30px !important',
    fontSize: 15,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-icon': {
    color: theme.palette.grey[400],
  },
  '& .MuiPaper-root': {
    borderRadius: 4,
    marginTop: 4,
  },
}));

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
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
}));

export const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: 4,
  padding: '8px',
  margin: '0 4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
  '&:active': {
    backgroundColor: theme.palette.grey[300],
  },
  '& .MuiSvgIcon-root': {
    strokeWidth: 0.5,
  },
  '&:not(.Mui-disabled)': {
    border: `1px solid ${theme.palette.grey[50]}`,
    color: theme.palette.grey[400],
  },
  '&.Mui-disabled': {
    border: 'none',
    color: theme.palette.grey[300],
  },
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  fontSize: 15,
  color: theme.palette.grey[400],
  margin: '0 8px',
}));

const PageButton = styled(Button)(({ theme }) => ({
  minWidth: '24px',
  height: '24px',
  margin: '0 4px',
  borderRadius: '24px',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.grey[400],
  fontWeight: 400,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[600],
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

const GoToPageTextField = styled(TextField)(({ theme }) => ({
  width: '120px',
  marginLeft: '8px',
  '& .MuiInputBase-root': {
    borderRadius: '100px',
    fontSize: 15,
    height: '32px',
  },
  '& .MuiInputBase-input': {
    padding: '0 8px',
    textAlign: 'center',
  },
  '& .MuiInputBase-root.MuiOutlinedInput-root ::placeholder': {
    fontSize: 15,
    color: '#AFB7C8',
  },
}));

type Props = {
  onPageChange: (newPage: number) => void;
  currentPage: number; // Renamed from page to match API
  totalPages: number; // New prop from API
  hasNextPage: boolean; // New prop from API
  hasPreviousPage: boolean; // New prop from API
  rowsPerPage: number;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  sx?: SxProps<Theme>;
};

const TablePaginationCustom = ({
  onPageChange,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  rowsPerPage,
  onRowsPerPageChange,
  sx,
}: Props) => {
  const theme = useTheme();
  const [goToPage, setGoToPage] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  // Use API-provided values (zero-based index adjustment)
  const page = currentPage - 1; // Convert to zero-based index for internal logic
  const lastPage = totalPages - 1; // Zero-based last page

  // Handle page change
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
    direction: 'prev' | 'next' | 'specific'
  ) => {
    onPageChange(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: { target: { value: any } }) => {
    onRowsPerPageChange(Number(event.target.value));
    onPageChange(0); // Reset to first page when rows per page changes
  };

  // Handle "First" button click
  const handleFirstPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(0);
  };

  // Handle "Last" button click
  const handleLastPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(lastPage);
  };

  // Handle "Go to page" input change
  const handleGoToPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoToPage(event.target.value);
    setIsInvalid(false); // Reset invalid state when editing
  };

  // Handle "Go to page" submission
  const handleGoToPageSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const pageNum = parseInt(goToPage, 10) - 1; // Convert to zero-based index

      if (pageNum >= 0 && pageNum <= lastPage) {
        onPageChange(pageNum);
        setGoToPage(''); // Clear input after successful navigation
      } else {
        setIsInvalid(true); // Mark as invalid if out of range
      }
    }
  };

  // Generate page numbers to display
  const pageNumbers: (number | string)[] = [];
  const maxPagesToShow = 5;
  const ellipsis = '...';

  let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

  // Adjust startPage if we don't have enough pages to show maxPagesToShow
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(0, endPage - maxPagesToShow + 1);
  }

  // If total pages are less than maxPagesToShow, show all pages
  if (totalPages <= maxPagesToShow) {
    startPage = 0;
    endPage = lastPage;
  }

  if (startPage > 0) {
    pageNumbers.push(0);
    if (startPage > 1) {
      pageNumbers.push(ellipsis);
    }
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pageNumbers.push(i);
  }

  if (endPage < lastPage) {
    if (endPage < lastPage - 1) {
      pageNumbers.push(ellipsis);
    }
    pageNumbers.push(lastPage);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: `100%`,
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: `100%` }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <CustomTypography sx={{ ml: 0 }}>Rows per page:</CustomTypography>
          <CustomSelect
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            displayEmpty
            inputProps={{ sx: { color: theme.palette.grey[400] } }}
          >
            {[10, 20, 40, 60].map((option) => (
              <CustomMenuItem key={option} value={option}>
                {option}
              </CustomMenuItem>
            ))}
          </CustomSelect>
        </Box>

        {/* Navigation buttons */}
        <Stack direction="row" alignItems="center">
          {/* First Page Button */}
          <CustomIconButton onClick={handleFirstPage} disabled={page === 0}>
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
                  fill={page === 0 ? grey[300] : grey[400]}
                />
              </svg>
            </SvgIcon>
          </CustomIconButton>

          {/* Previous Page Button */}
          <CustomIconButton
            onClick={(event) => handleChangePage(event, page - 1, 'prev')}
            disabled={!hasPreviousPage}
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
                  fill={!hasPreviousPage ? grey[300] : grey[400]}
                />
              </svg>
            </SvgIcon>
          </CustomIconButton>

          {/* Page number buttons */}
          {pageNumbers.map((pageNum, index) =>
            typeof pageNum === 'string' ? (
              <CustomTypography key={index}>{pageNum}</CustomTypography>
            ) : (
              <PageButton
                key={pageNum}
                onClick={(event) => handleChangePage(event, pageNum, 'specific')}
                className={pageNum === page ? 'Mui-selected' : ''}
              >
                {pageNum + 1}
              </PageButton>
            )
          )}

          {/* Next Page Button */}
          <CustomIconButton
            onClick={(event) => handleChangePage(event, page + 1, 'next')}
            disabled={!hasNextPage}
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
                  fill={!hasNextPage ? grey[300] : grey[400]}
                />
              </svg>
            </SvgIcon>
          </CustomIconButton>

          {/* Last Page Button */}
          <CustomIconButton onClick={handleLastPage} disabled={page >= lastPage}>
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
                  fill={page >= lastPage ? grey[300] : grey[400]}
                />
              </svg>
            </SvgIcon>
          </CustomIconButton>
        </Stack>

        {/* Go to page text field */}
        <GoToPageTextField
          value={goToPage}
          onChange={handleGoToPageChange}
          onKeyDown={handleGoToPageSubmit}
          placeholder="go to page"
          variant="outlined"
          error={isInvalid}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderColor: isInvalid ? theme.palette.error.main : theme.palette.grey[200],
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isInvalid ? theme.palette.error.main : theme.palette.grey[400],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isInvalid ? theme.palette.error.main : theme.palette.primary.main,
              },
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default TablePaginationCustom;
