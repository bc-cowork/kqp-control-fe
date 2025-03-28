'use client';

import type { IAuditLogItem } from 'src/types/node';

import { useState } from 'react';

import {
  Box,
  Table,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { grey } from 'src/theme/core/palette';
import { useAuditLogList } from 'src/actions/nodes';

import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';

// ----------------------------------------------------------------------

const AUDIT_LOG_TYPES = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'other', label: 'Other' },
  { value: 'all', label: 'All' },
];

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function AuditLogList({ selectedNodeId }: Props) {
  const router = useRouter();
  const [type, setType] = useState<string>(AUDIT_LOG_TYPES[0].value);

  const { auditLogs, auditLogsEmpty, auditLogsLoading, auditLogsError } = useAuditLogList(
    selectedNodeId,
    type
  );

  const handleTypeChange = (event: { target: { value: string } }) => {
    setType(event.target.value);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Select
          value={type}
          label="Type"
          onChange={handleTypeChange}
          inputProps={{ sx: { color: grey[400] } }}
        >
          {AUDIT_LOG_TYPES.map((logType) => (
            <MenuItem key={logType.value} value={logType.value}>
              {logType.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">No</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Size</TableCell>
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
                <TableCell align="right">{auditLog.size}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
