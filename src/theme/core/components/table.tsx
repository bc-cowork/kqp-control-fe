import type { Theme, Components } from '@mui/material/styles';

import { tableRowClasses } from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';

import { varAlpha } from '../../styles';

// ----------------------------------------------------------------------

const MuiTableContainer: Components<Theme>['MuiTableContainer'] = {
  /** **************************************
   * STYLE
   *************************************** */
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
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({ '--palette-TableCell-border': theme.vars.palette.divider }),
  },
};

// ----------------------------------------------------------------------

const MuiTableRow: Components<Theme>['MuiTableRow'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.palette.common.white,
      '&:hover': { backgroundColor: '#EFF6FF' },
      [`&.${tableRowClasses.selected}`]: {
        backgroundColor: '#C7DBFF',
        border: `2px solid ${theme.palette.primary.main}`,
        '&:hover': { backgroundColor: '#99BDFF' },
      },
      '&:last-of-type': { [`& .${tableCellClasses.root}`]: { borderColor: 'transparent' } },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { borderBottomStyle: 'solid' },
    head: ({ theme }) => ({
      fontSize: 17,
      color: theme.palette.grey[50],
      fontWeight: 400,
      backgroundColor: theme.palette.primary.darker,
      '&:first-of-type': { borderTopLeftRadius: 8 },
      '&:last-of-type': { borderTopRightRadius: 8 },
    }),
    body: ({ theme }) => ({
      fontSize: 15,
      color: theme.palette.grey[400],
      backgroundColor: 'inherit',
      'tr:last-child &': {
        '&:first-of-type': { borderBottomLeftRadius: 4 },
        '&:last-of-type': { borderBottomRightRadius: 4 },
      },
    }),
    stickyHeader: ({ theme }) => ({
      backgroundColor: theme.vars.palette.background.paper,
      backgroundImage: `linear-gradient(to bottom, ${theme.vars.palette.background.neutral}, ${theme.vars.palette.background.neutral})`,
    }),
    paddingCheckbox: ({ theme }) => ({ paddingLeft: theme.spacing(1) }),
  },
};

// ----------------------------------------------------------------------

const MuiTablePagination: Components<Theme>['MuiTablePagination'] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    backIconButtonProps: { size: 'small' },
    nextIconButtonProps: { size: 'small' },
    slotProps: { select: { name: 'table-pagination-select' } },
  },

  /** **************************************
   * STYLE
   *************************************** */
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
