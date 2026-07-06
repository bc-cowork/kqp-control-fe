'use client';

import type { ReactNode } from 'react';
import type { Column } from 'src/components/v5';
import type { AuditLogFrameItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';

import { formatBytes } from 'src/utils/helper';
import { formatDateCustom } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAuditFrameList } from 'src/actions/nodes';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { Iconify } from 'src/components/iconify';
import { Pager, DataTable } from 'src/components/v5';

import AuditFrameListFilterBar from '../audit-log-page/AuditFrameListFilterBar';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

function InfoField({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Box
        sx={{
          fontSize: 14,
          color: T.textDim,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {label}
      </Box>
      <Box sx={{ fontSize: 17, color: T.textPrim, fontFamily: FONT_MONO }}>{children}</Box>
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
    <Box sx={{ display: 'flex', gap: '14px', flex: 1, minHeight: 0 }}>
      {/* Left — Log Info panel */}
      <Box
        sx={{
          width: 300,
          flexShrink: 0,
          alignSelf: 'stretch',
          maxHeight: '100%',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: '12px 16px',
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: 16,
            color: T.textSec,
            fontWeight: 500,
          }}
        >
          <Iconify icon="eva:file-add-outline" width={18} sx={{ color: T.textDim }} />
          <span>{t('right_side_audit_log_list.log_info')}</span>
        </Box>

        {/* Body */}
        <Box
          sx={{ flex: 1, minHeight: 0, p: '18px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Box
              sx={{ flex: 1, minWidth: 0, fontSize: 22, fontWeight: 400, wordBreak: 'break-word' }}
            >
              {selectedFile}
            </Box>
            <Box
              component="span"
              sx={{
                flexShrink: 0,
                fontSize: 14,
                fontWeight: 500,
                p: '3px 10px',
                borderRadius: '5px',
                bgcolor: T.bgHover,
                color: ACCENT2,
                border: `1px solid ${T.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {t('right_side_audit_log_list.inbound_log')}
            </Box>
          </Box>

          <InfoField
            label={
              <>
                {t('right_side_audit_log_list.max_frame_seq')}
                <Box
                  component="span"
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    p: '1px 6px',
                    borderRadius: '3px',
                    bgcolor: `${T.primary}26`,
                    color: T.accent,
                    letterSpacing: '0.04em',
                  }}
                >
                  MAX
                </Box>
              </>
            }
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: '6px',
                p: '8px 12px',
              }}
            >
              <Box component="span" sx={{ fontSize: 16, fontFamily: FONT_MONO }}>
                {auditFrameList?.max_frame ?? '—'}
              </Box>
              <Box
                onClick={onMaxFrameRefresh}
                sx={{ display: 'flex', cursor: 'pointer', color: T.textDim, '&:hover': { color: T.textPrim } }}
              >
                <Iconify icon="eva:refresh-fill" width={16} />
              </Box>
            </Box>
          </InfoField>

          <InfoField label={t('right_side_audit_log_list.file_size')}>
            {formatBytes(auditFrameList?.file_size)}
          </InfoField>
          <InfoField label={t('right_side_audit_log_list.date')}>
            {formatDateCustom(auditFrameList?.date?.toString())}
          </InfoField>
          <InfoField label={t('right_side_audit_log_list.desc')}>
            <Box component="span" sx={{ color: T.textSec }}>
              {auditFrameList?.desc || '—'}
            </Box>
          </InfoField>
        </Box>
      </Box>

      {/* Right — Pager + filter bar + frame table */}
      <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {searchedSeq == null && (
          <Pager
            page={auditFrameListPagination?.current_page || 1}
            totalPages={auditFrameListPagination?.total_pages || 1}
            perPage={rowsPerPage}
            onPageChange={(p) => onChangePage(p - 1)}
            onPerPageChange={onChangeRowsPerPage}
          />
        )}

        <AuditFrameListFilterBar
          value={frameSeq}
          setValue={setFrameSeq}
          onSearch={handleFrameSearch}
          onReset={handleFrameReset}
        />

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
