'use client';

import type { IAuditLogItem } from 'src/types/node';

import { useState } from 'react';

import {
  Box,
  Table,
  Select,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';
import { useAuditLogList } from 'src/actions/nodes';

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
        <Select value={type} label="Type" onChange={handleTypeChange}>
          {AUDIT_LOG_TYPES.map((logType) => (
            <MenuItem key={logType.value} value={logType.value}>
              {logType.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Table
        size="small"
        sx={{
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditLogsLoading ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : auditLogsEmpty ? (
            <TableRow>
              <TableCell colSpan={6}>No Audit Logs Found</TableCell>
            </TableRow>
          ) : auditLogsError ? (
            <TableRow>
              <TableCell colSpan={6}>Error Fetching Audit Logs List</TableCell>
            </TableRow>
          ) : (
            auditLogs.map((auditLog: IAuditLogItem, index: number) => (
              <TableRow key={index}>
                <TableCell>{auditLog.id}</TableCell>
                <TableCell>{auditLog.date}</TableCell>
                <TableCell>{auditLog.kind}</TableCell>
                <TableCell>{auditLog.size}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      router.push(
                        `/dashboard/nodes/${selectedNodeId}/audit-log/${auditLog.fname}/list`
                      );
                    }}
                    sx={{
                      backgroundColor: '#F4F6F8',
                      '&:hover': { backgroundColor: '#637381', color: '#F4F6F8' },
                    }}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
