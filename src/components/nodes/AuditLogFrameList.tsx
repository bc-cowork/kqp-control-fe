'use client';

import type { ReactNode } from 'react';
import type { Column } from 'src/components/v5';
import type { AuditLogFrameItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { formatBytes } from 'src/utils/helper';
import { formatDateCustom } from 'src/utils/format-time';

import { T, ACCENT2 } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';
import { useAuditFrameList } from 'src/actions/nodes';

import { Iconify } from 'src/components/iconify';
import { Pager, Panel, DataTable, SectionLabel } from 'src/components/v5';

import AuditFrameListFilterBar from '../audit-log-page/AuditFrameListFilterBar';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

function InfoBox({
  label,
  value,
  badge,
  action,
}: {
  label: string;
  value: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Box sx={{ bgcolor: T.bgHover, borderRadius: '8px', p: '8px 12px', mb: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ color: T.textDim, fontSize: 14 }}>{label}</Typography>
          {badge}
        </Stack>
        {action}
      </Stack>
      <Typography sx={{ color: T.textPrim, fontSize: 17, fontWeight: 500 }}>{value}</Typography>
    </Box>
  );
}

export function AuditLogFrameList({ selectedNodeId, selectedFile }: Props) {
  const { t } = useTranslate('audit-frame-list');
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(40);
  const [offset, setOffset] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [frameSeq, setFrameSeq] = useState<number | null>(null);
  // The seq currently applied via Search — when set, only that frame is shown.
  const [searchedSeq, setSearchedSeq] = useState<number | null>(null);

  const {
    auditFrameList,
    auditFrameListPagination,
    auditFrameListError,
    auditFrameListLoading,
    auditFrameListEmpty,
  } = useAuditFrameList(
    selectedNodeId,
    selectedFile,
    page + 1,
    rowsPerPage,
    offset,
    'desc',
    refreshKey
  );

  const resetCache = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const onChangeRowsPerPage = useCallback((value: number) => {
    setPage(0);
    setOffset(0);
    setRowsPerPage(value);
  }, []);

  const onChangePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      if (newPage === 0) {
        setOffset(0);
      } else {
        setOffset(auditFrameList?.max_frame || 0);
      }
    },
    [auditFrameList?.max_frame]
  );

  const onMaxFrameRefresh = () => {
    resetCache();
    setOffset(0);
    setPage(0);
  };

  // Filter the list in-place: `last-offset` = the searched seq makes the list
  // start at that frame (shown at the top), instead of navigating to its detail.
  const handleFrameSearch = () => {
    if (frameSeq) {
      setSearchedSeq(frameSeq);
      setPage(0);
      setOffset(frameSeq);
      resetCache();
    }
  };

  const handleFrameReset = () => {
    setFrameSeq(null);
    setSearchedSeq(null);
    setPage(0);
    setOffset(0);
    resetCache();
  };

  // When a search is applied, show only the matching frame; otherwise the full page.
  const displayedFrames =
    searchedSeq != null
      ? (auditFrameList?.frame_list ?? []).filter((f) => f.seq === searchedSeq)
      : auditFrameList?.frame_list ?? [];

  const columns: Column<AuditLogFrameItem>[] = [
    { key: 'seq', label: t('table_header.frame_seq'), mono: true, width: 150 },
    { key: 'head', label: t('table_header.head'), mono: true, align: 'center' },
    { key: 'rid', label: t('table_header.rid'), mono: true, align: 'right', width: 90 },
    {
      key: 'size',
      label: t('table_header.size'),
      mono: true,
      align: 'right',
      width: 150,
      render: (r) => formatBytes(r.size),
    },
  ];

  const emptyLabel =
    searchedSeq != null
      ? t('table.no_frame_for_seq', { seq: searchedSeq })
      : t('table.empty');

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flex: 1, minHeight: 0 }}>
      {/* Left — Log Info */}
      <Panel sx={{ width: 300, flexShrink: 0, overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <SectionLabel>{t('right_side_audit_log_list.log_info')}</SectionLabel>

          <Typography
            sx={{ color: T.textPrim, fontSize: 22, fontWeight: 500, mt: 1.5, wordBreak: 'break-all' }}
          >
            {selectedFile}
          </Typography>

          <Box
            component="span"
            sx={{
              display: 'inline-block',
              mt: 1,
              mb: 2,
              bgcolor: T.bgHover,
              color: ACCENT2,
              border: `1px solid ${T.border}`,
              borderRadius: '5px',
              px: 1.25,
              py: '3px',
              fontSize: 14,
            }}
          >
            {t('right_side_audit_log_list.inbound_log')}
          </Box>

          <InfoBox
            label={t('right_side_audit_log_list.max_frame_seq')}
            value={auditFrameList?.max_frame ?? '—'}
            badge={
              <Box
                component="span"
                sx={{
                  bgcolor: T.bgRowSel,
                  color: T.primary,
                  borderRadius: '4px',
                  px: 0.75,
                  py: '1px',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                MAX
              </Box>
            }
            action={
              <Box
                onClick={onMaxFrameRefresh}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: T.textSec,
                  '&:hover': { bgcolor: T.bgCard, color: T.textPrim },
                }}
              >
                <Iconify icon="eva:refresh-fill" width={15} />
              </Box>
            }
          />

          <InfoBox
            label={t('right_side_audit_log_list.file_size')}
            value={formatBytes(auditFrameList?.file_size)}
          />
          <InfoBox
            label={t('right_side_audit_log_list.date')}
            value={formatDateCustom(auditFrameList?.date?.toString())}
          />
          <InfoBox
            label={t('right_side_audit_log_list.desc')}
            value={auditFrameList?.desc || '—'}
          />
        </Box>
      </Panel>

      {/* Right — Pager + filter bar + frame table */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {searchedSeq == null && (
          <Pager
            page={auditFrameListPagination?.current_page || 1}
            totalPages={auditFrameListPagination?.total_pages || 1}
            perPage={rowsPerPage}
            onPageChange={(p) => onChangePage(p - 1)}
            onPerPageChange={onChangeRowsPerPage}
          />
        )}

        <Box sx={{ border: `1px solid ${T.border}`, borderRadius: '8px', overflow: 'hidden' }}>
          <AuditFrameListFilterBar
            value={frameSeq}
            setValue={setFrameSeq}
            onSearch={handleFrameSearch}
            onReset={handleFrameReset}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            '& > *': { flex: 1, minHeight: 0 },
          }}
        >
          <DataTable<AuditLogFrameItem>
            columns={columns}
            headerVariant="light"
            rows={displayedFrames}
            loading={auditFrameListLoading}
            error={auditFrameListError}
            emptyLabel={auditFrameListEmpty ? t('table.empty') : emptyLabel}
            onRowClick={(row) =>
              router.push(
                `/dashboard/nodes/${selectedNodeId}/audit-log/${selectedFile}/${row.seq}:${row.head}`
              )
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
