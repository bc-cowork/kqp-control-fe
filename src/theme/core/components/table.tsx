import type { Theme, Components } from '@mui/material/styles';

import { tableRowClasses } from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';

import { varAlpha } from '../../styles';

// ----------------------------------------------------------------------

const MuiTableContainer: Components<Theme>['MuiTableContainer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      scrollbarWidth: 'thin',
      scrollbarColor: `${varAlpha(theme.vars.palette.text.disabledChannel, 0.4)} ${varAlpha(theme.vars.palette.text.disabledChannel, 0.08)}`,
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
      backgroundColor: theme.palette.common.white,
      border: 'none',
      '&:nth-child(odd)': {
        backgroundColor: theme.palette.common.white,
      },
      '&:nth-child(even)': {
        backgroundColor: '#F9FAFB',
      },
      '&:hover': { backgroundColor: `${varAlpha(theme.vars.palette.primary.lighter, 0.2)}` },
      [`&.${tableRowClasses.selected}`]: {
        backgroundColor: theme.palette.grey[200],
        border: `2px solid ${theme.palette.primary.main}`,
        '&:hover': { backgroundColor: '#C7DBFF' },
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
      color: theme.palette.grey[50],
      fontWeight: 400,
      backgroundColor: theme.palette.primary.darker,
      '&:first-of-type': { borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' },
      '&:last-of-type': { borderTopRightRadius: '8px', borderBottomRightRadius: '8px' },
      // Ensure sticky header cells keep these styles
      position: 'sticky',
      top: 0,
      zIndex: 1,
    }),
    body: ({ theme }) => ({
      fontSize: 15,
      color: theme.palette.grey[400],
      backgroundColor: 'inherit',
      'tr:first-child &': {
        '&:first-of-type': { borderTopLeftRadius: '8px' },
        '&:last-of-type': { borderTopRightRadius: '8px' },
      },
      'tr:last-child &': {
        '&:first-of-type': { borderBottomLeftRadius: '8px' },
        '&:last-of-type': { borderBottomRightRadius: '8px' },
      },
      [`tr.${tableRowClasses.selected} &`]: {
        fontWeight: 500,
        color: theme.palette.grey[600],
      },
    }),
    // Remove or override the default stickyHeader styles
    stickyHeader: ({ theme }) => ({
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
