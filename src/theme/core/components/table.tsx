import type { Theme, Components } from '@mui/material/styles';

import { tableRowClasses } from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';


// ----------------------------------------------------------------------

const MuiTableContainer: Components<Theme>['MuiTableContainer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      scrollbarWidth: 'thin',
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTable: Components<Theme>['MuiTable'] = {
  styleOverrides: {
    root: ({ theme }) => ({ '--palette-TableCell-border': theme.vars.palette.divider }),
  },
};

// ----------------------------------------------------------------------

const MuiTableRow: Components<Theme>['MuiTableRow'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.palette.primary.darker,
      border: 'none',
      '&:nth-child(odd)': {
        backgroundColor: '#202838',
      },
      '&:nth-child(even)': {
        backgroundColor: '#141C2A',
      },
      '&:hover': { backgroundColor: theme.palette.primary.main, color: 'red' },
      '&:active': { backgroundColor: theme.palette.primary.main, color: 'red' },
      [`&.${tableRowClasses.selected}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 500,
        border: `2px solid ${theme.palette.primary.main}`,
        '&:hover': { backgroundColor: theme.palette.primary.main, },
      },
      '&:last-of-type': { [`& .${tableCellClasses.root}`]: { borderColor: 'transparent' } },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    root: {
      border: 'none',
    },
    head: ({ theme }) => ({
      fontSize: 17,
      color: theme.palette.primary.contrastText,
      fontWeight: 400,
      backgroundColor: theme.palette.primary.darker,
      '&:first-of-type': { borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' },
      '&:last-of-type': { borderTopRightRadius: '0px', borderBottomRightRadius: '0px' },
      // Ensure sticky header cells keep these styles
      position: 'sticky',
      top: 0,
      zIndex: 1,
    }),
    body: ({ theme }) => ({
      fontSize: 15,
      color: theme.palette.primary.contrastText,
      'tr:first-child &': {
        '&:first-of-type': { borderTopLeftRadius: '0px' },
        '&:last-of-type': { borderTopRightRadius: '0px' },
      },
      'tr:last-child &': {
        '&:first-of-type': { borderBottomLeftRadius: '8px' },
        '&:last-of-type': { borderBottomRightRadius: '8px' },
      },
      [`tr.${tableRowClasses.selected} &`]: {
        fontWeight: 500,
        color: theme.palette.primary.contrastText,
      },
      '&:active': { color: theme.palette.grey[600], fontWeight: 500 },
    }),
    // Remove or override the default stickyHeader styles
    stickyHeader: ({ theme }) => ({
      border: 'none !important',
      backgroundColor: theme.palette.primary.darker,
      color: theme.palette.grey[50],
      fontSize: 17,
      fontWeight: 400,
    }),
    paddingCheckbox: ({ theme }) => ({ paddingLeft: theme.spacing(1) }),
  },
};

// ----------------------------------------------------------------------

const MuiTablePagination: Components<Theme>['MuiTablePagination'] = {
  defaultProps: {
    backIconButtonProps: { size: 'small' },
    nextIconButtonProps: { size: 'small' },
    slotProps: { select: { name: 'table-pagination-select' } },
  },
  styleOverrides: {
    root: { width: '100%' },
    toolbar: { height: 64 },
    actions: { marginRight: 8 },
    select: ({ theme }) => ({
      paddingLeft: 8,
      display: 'flex',
      alignItems: 'center',
      '&:focus': { borderRadius: theme.shape.borderRadius },
    }),
    selectIcon: {
      right: 4,
      width: 16,
      height: 16,
      top: 'calc(50% - 8px)',
    },
  },
};

// ----------------------------------------------------------------------

export const table = {
  MuiTable,
  MuiTableRow,
  MuiTableCell,
  MuiTableContainer,
  MuiTablePagination,
};
