'use client';

import React from 'react';

import { styled } from '@mui/material/styles';
import { Box, Stack, Select, MenuItem, useTheme, IconButton, Typography } from '@mui/material';

import { Iconify } from '../iconify';

// Styled components for custom styling
const CustomSelect = styled(Select)(({ theme }) => ({
  height: 32,
  backgroundColor: '#f5f7fa',
  borderRadius: 4,
  '& .MuiSelect-select': {
    padding: '4px 24px 4px 8px',
    fontSize: '0.875rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-icon': {
    color: theme.palette.grey[400],
  },
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: 4,
  padding: 4,
  margin: '0 4px',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  fontSize: 15,
  color: theme.palette.grey[400],
  margin: '0 8px',
}));

type Props = {
  onPageChange: (newPage: number) => void;
  page: number;
  count: number;
  rowsPerPage: number;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
};

const TablePaginationCustom = ({
  onPageChange,
  page,
  count,
  rowsPerPage,
  onRowsPerPageChange,
}: Props) => {
  const theme = useTheme();

  // Calculate the range (e.g., "1-10")
  const start = page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, count);

  // Handle page change
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: { target: { value: any } }) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Rows per page label and dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
        <CustomTypography>Rows per page:</CustomTypography>
        <CustomSelect
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          displayEmpty
          inputProps={{ sx: { color: theme.palette.grey[400] } }}
        >
          {[10, 20, 40, 60].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </CustomSelect>
      </Box>

      {/* Navigation buttons */}
      <Stack direction="row" alignItems="center">
        <CustomIconButton
          onClick={(event) => handleChangePage(event, page - 1)}
          disabled={page === 0}
        >
          <Iconify icon="eva:arrow-ios-back-fill" />
        </CustomIconButton>

        {/* Range label (e.g., "1-10 of 9356951") */}
        <CustomTypography>
          <Box component="span" sx={{ fontWeight: 500, color: theme.palette.common.black }}>
            {start}-{end}
          </Box>{' '}
          of {count.toLocaleString()}
        </CustomTypography>
        <CustomIconButton
          onClick={(event) => handleChangePage(event, page + 1)}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </CustomIconButton>
      </Stack>
    </Box>
  );
};

export default TablePaginationCustom;
