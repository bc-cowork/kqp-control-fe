'use client';

import type { TFunction } from 'i18next';
import type { IAuditLogItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import {
  Box,
  Table,
  Stack,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useAuditLogList } from 'src/actions/nodes';
import { grey, common } from 'src/theme/core/palette';

import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import TablePaginationCustom from '../common/TablePaginationCustom';

// ----------------------------------------------------------------------

const getAuditLogTypes = (t: TFunction) => [
  { value: 'inbound', label: t('table_option.inbound') },
  { value: 'outbound', label: t('table_option.outbound') },
  { value: 'other', label: t('table_option.other') },
  { value: 'all', label: t('table_option.all') },
];

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function AuditLogList({ selectedNodeId }: Props) {
  const { t } = useTranslate('audit-list');
  const router = useRouter();
  const [type, setType] = useState<string>(getAuditLogTypes(t)[0].value);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(40);

  const { auditLogs, auditLogPagination, auditLogsEmpty, auditLogsLoading, auditLogsError } =
    useAuditLogList(selectedNodeId, type, page + 1, rowsPerPage);

  const onChangeRowsPerPage = useCallback((value: number) => {
    setPage(0);
    setRowsPerPage(value);
  }, []);

  const onChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleTypeChange = (event: { target: { value: string } }) => {
    setType(event.target.value);
  };

  return (
    <Box sx={{ backgroundColor: '#202838', borderRadius: 1.5, p: 1.5 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <Select
          value={type}
          label="Type"
          onChange={handleTypeChange}
          inputProps={{ sx: { color: grey[400] } }}
          sx={{
            height: "32px",
            borderRadius: "4px",
            backgroundColor: '#202838', // black background for the select itself
            color: grey[400],
            "& .MuiSelect-select": {
              backgroundColor: "transparent !important", // ensures inner select area is black
              color: grey[300],
              padding: "4px 8px",
            },
            "& fieldset": {
              borderColor: grey[700], // optional: dark border
            },
            "&:hover fieldset": {
              borderColor: grey[500],
            },
            "&.Mui-focused fieldset": {
              borderColor: grey[300],
            },
          }}
        >
          {getAuditLogTypes(t).map((logType) => (
            <MenuItem key={logType.value}
              sx={{
                backgroundColor: '#202838',
                ":hover": {
                  backgroundColor: grey[400],
                },
              }}
              value={logType.value}>
              {logType.label}
            </MenuItem>
          ))}
        </Select>

        <TablePaginationCustom
          rowsPerPage={rowsPerPage}
          currentPage={auditLogPagination?.current_page || 1}
          totalPages={auditLogPagination?.total_pages || 1}
          hasNextPage={auditLogPagination?.has_next_page || false}
          hasPreviousPage={auditLogPagination?.has_previous_page || false}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          sx={{ pl: 2, pr: 0.5 }}
        />
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">{t('table_header.no')}</TableCell>
            <TableCell align="right">{t('table_header.date')}</TableCell>
            <TableCell>{t('table_header.type')}</TableCell>
            <TableCell align="right">{t('table_header.desc')}</TableCell>
            <TableCell align="right">{t('table_header.size')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditLogsLoading ? (
            <TableLoadingRows height={20} loadingRows={10} />
          ) : auditLogsEmpty ? (
            <TableEmptyRows />
          ) : auditLogsError ? (
            <TableErrorRows />
          ) : (
            auditLogs.map((auditLog: IAuditLogItem, index: number) => (
              <TableRow
                key={index}
                onClick={() => {
                  router.push(`/dashboard/nodes/${selectedNodeId}/audit-log/${auditLog.fname}`);
                }}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell align="right">{auditLog.id}</TableCell>
                <TableCell align="right">{auditLog.date}</TableCell>
                <TableCell>{auditLog.kind}</TableCell>
                <TableCell align='right'>{auditLog?.desc || '-'}</TableCell>
                <TableCell align="right">{auditLog.size}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
