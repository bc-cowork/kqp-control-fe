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
    { key: 'seq', label: t('table_header.frame_seq'), width: 150, color: T.textSec },
    { key: 'head', label: t('table_header.head'), align: 'center', color: T.textSec },
    { key: 'rid', label: t('table_header.rid'), align: 'right', width: 90, color: T.textSec },
    {
      key: 'size',
      label: t('table_header.size'),
      align: 'right',
      width: 150,
      color: T.textSec,
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
          <Box
            component="svg"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            sx={{ color: T.textSec, flexShrink: 0, display: 'block' }}
          >
            <path
              d="M8.60767 3.32129C8.78817 3.32095 8.96134 3.39402 9.08716 3.52344L10.2795 4.75H16.8323C17.6607 4.75001 18.3323 5.42158 18.3323 6.25V15.167C18.3321 15.9952 17.6606 16.667 16.8323 16.667H3.16431C2.33609 16.6669 1.66453 15.9952 1.66431 15.167L1.66333 4.83203C1.66324 4.00468 2.33306 3.33267 3.1604 3.33106L8.60767 3.32129ZM3.16333 4.66504C3.07156 4.66521 2.99658 4.73934 2.99634 4.83106L2.99731 15.167C2.99753 15.2588 3.07246 15.3329 3.16431 15.333H16.8323C16.9242 15.333 16.999 15.2589 16.9993 15.167V6.25C16.9993 6.15796 16.9243 6.08301 16.8323 6.08301H9.99829C9.81823 6.08301 9.64529 6.00997 9.51978 5.88086L8.32739 4.65527L3.16333 4.66504ZM12.5002 8.08301C12.8684 8.08301 13.1672 8.38181 13.1672 8.75V10.167H14.5823C14.9504 10.167 15.2491 10.4649 15.2493 10.833C15.2493 11.2012 14.9505 11.5 14.5823 11.5H13.1672V12.917C13.167 13.285 12.8683 13.583 12.5002 13.583C12.1323 13.5828 11.8344 13.2849 11.8342 12.917V11.5H10.4163C10.0481 11.5 9.74927 11.2012 9.74927 10.833C9.7494 10.4649 10.0482 10.167 10.4163 10.167H11.8342V8.75C11.8342 8.38192 12.1322 8.08318 12.5002 8.08301Z"
              fill="currentColor"
            />
          </Box>
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
            bodyWeight={300}
            headerWeight={400}
            headerSize={17}
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
