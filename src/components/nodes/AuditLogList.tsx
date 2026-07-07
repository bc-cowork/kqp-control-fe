'use client';

import type { Column } from 'src/components/v5';
import type { IAuditLogItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';

import { formatBytes } from 'src/utils/helper';
import { formatDateCustom } from 'src/utils/format-time';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';
import { useAuditLogList } from 'src/actions/nodes';

import { Pager, DataTable, FilterField } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function AuditLogList({ selectedNodeId }: Props) {
  const { t } = useTranslate('audit-list');
  const router = useRouter();

  const AUDIT_LOG_TYPES = [
    { value: 'inbound', label: t('table_option.inbound') },
    { value: 'outbound', label: t('table_option.outbound') },
    { value: 'other', label: t('table_option.other') },
    { value: 'all', label: t('table_option.all') },
  ];

  const [type, setType] = useState<string>(AUDIT_LOG_TYPES[0].value);
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

  const columns: Column<IAuditLogItem>[] = [
    { key: 'id', label: t('table_header.no'), mono: true, align: 'right', width: 56 },
    {
      key: 'date',
      label: t('table_header.date'),
      mono: true,
      width: 120,
      render: (r) => formatDateCustom(r.date?.toString()),
    },
    { key: 'kind', label: t('table_header.type'), color: T.primary },
    {
      key: 'desc',
      label: t('table_header.desc'),
      color: T.textSec,
      grow: true,
      render: (r) => r?.desc || '-',
    },
    {
      key: 'size',
      label: t('table_header.size'),
      mono: true,
      align: 'right',
      render: (r) => formatBytes(r.size),
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.25, flexShrink: 0 }}>
        <FilterField
          label={t('table_header.type_filter')}
          value={type}
          options={AUDIT_LOG_TYPES}
          onChange={setType}
          width={160}
        />
        <Box sx={{ flex: 1 }} />
      </Box>

      <Pager
        page={auditLogPagination?.current_page || 1}
        totalPages={auditLogPagination?.total_pages || 1}
        perPage={rowsPerPage}
        onPageChange={(p) => onChangePage(p - 1)}
        onPerPageChange={onChangeRowsPerPage}
      />

      <DataTable<IAuditLogItem>
        columns={columns}
        rows={auditLogsEmpty ? [] : auditLogs}
        loading={auditLogsLoading}
        error={auditLogsError}
        emptyLabel={t('table.empty')}
        onRowClick={(row) =>
          router.push(`/dashboard/nodes/${selectedNodeId}/audit-log/${row.fname}`)
        }
      />
    </>
  );
}
