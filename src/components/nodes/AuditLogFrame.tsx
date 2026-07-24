'use client';

import type { ReactNode } from 'react';
import type { Column } from 'src/components/v5';
import type { AuditLogFrameFragItem } from 'src/types/node';

import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Stack,
  Dialog,
  SvgIcon,
  Collapse,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { formatBytes } from 'src/utils/helper';
import { formatDateCustom } from 'src/utils/format-time';

import { error } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';
import { useGetAuditLogFrame } from 'src/actions/nodes';

import { SpecChip, DataTable, CodeBlock } from 'src/components/v5';

import { Iconify } from '../iconify';
import { FrameTimeline } from './FrameTimeline';
import AuditFrameFilterBar from '../audit-log-page/AuditFrameFilterBar';
import { AuditFrameLayoutFlow } from '../audit-log-page/AuditFrameLayoutFlow';

import type { Filter } from '../common/AddFilter';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
  selectedSeq: string;
  head: string;
};

// Plain label/value field (no background box) — matches the redesigned panel
// (InfoField in Figma: label 14 / value 17, 6px gap, no fill).
function InfoField({
  label,
  value,
  mono,
  valueDim,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  valueDim?: boolean;
}) {
  return (
    <Box>
      <Typography sx={{ color: T.textDim, fontSize: 14, mb: '6px' }}>{label}</Typography>
      <Typography
        sx={{
          color: valueDim ? T.textSec : T.textPrim,
          fontSize: 17,
          fontWeight: 400,
          fontFamily: mono ? FONT_MONO : 'inherit',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

const FOLDER_ICON_PATH =
  'M8.60767 3.32129C8.78817 3.32095 8.96134 3.39402 9.08716 3.52344L10.2795 4.75H16.8323C17.6607 4.75001 18.3323 5.42158 18.3323 6.25V15.167C18.3321 15.9952 17.6606 16.667 16.8323 16.667H3.16431C2.33609 16.6669 1.66453 15.9952 1.66431 15.167L1.66333 4.83203C1.66324 4.00468 2.33306 3.33267 3.1604 3.33106L8.60767 3.32129ZM3.16333 4.66504C3.07156 4.66521 2.99658 4.73934 2.99634 4.83106L2.99731 15.167C2.99753 15.2588 3.07246 15.3329 3.16431 15.333H16.8323C16.9242 15.333 16.999 15.2589 16.9993 15.167V6.25C16.9993 6.15796 16.9243 6.08301 16.8323 6.08301H9.99829C9.81823 6.08301 9.64529 6.00997 9.51978 5.88086L8.32739 4.65527L3.16333 4.66504ZM12.5002 8.08301C12.8684 8.08301 13.1672 8.38181 13.1672 8.75V10.167H14.5823C14.9504 10.167 15.2491 10.4649 15.2493 10.833C15.2493 11.2012 14.9505 11.5 14.5823 11.5H13.1672V12.917C13.167 13.285 12.8683 13.583 12.5002 13.583C12.1323 13.5828 11.8344 13.2849 11.8342 12.917V11.5H10.4163C10.0481 11.5 9.74927 11.2012 9.74927 10.833C9.7494 10.4649 10.0482 10.167 10.4163 10.167H11.8342V8.75C11.8342 8.38192 12.1322 8.08318 12.5002 8.08301Z';

// Panel section header — folder icon + title + collapse toggle (accordion).
function SectionHead({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        p: '12px 16px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexShrink: 0,
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': { bgcolor: T.bgHover },
      }}
    >
      <Box
        component="svg"
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        sx={{ color: T.textSec, flexShrink: 0, display: 'block' }}
      >
        <path d={FOLDER_ICON_PATH} fill="currentColor" />
      </Box>
      <Box component="span" sx={{ flex: 1, fontSize: 16, fontWeight: 500, color: T.textSec }}>
        {title}
      </Box>
      <Box
        sx={{
          display: 'flex',
          color: T.textDim,
          transition: 'transform .2s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}
      >
        <Iconify icon="eva:arrow-ios-downward-fill" width={18} />
      </Box>
    </Box>
  );
}

export function AuditLogFrame({ selectedNodeId, selectedFile, selectedSeq, head }: Props) {
  const { t } = useTranslate('audit-frame-detail');
  const [seq, setSeq] = useState<number>(Number(selectedSeq));
  const [apiSeq, setApiSeq] = useState<number>(Number(selectedSeq));
  const [count, setCount] = useState<number | undefined>(undefined);
  const [side, setSide] = useState<'prev' | 'next' | undefined>(undefined);
  const [cond, setCond] = useState<string | undefined>(undefined);
  const [condText, setCondText] = useState<string | undefined>(undefined);
  const [countNum, setCountNum] = useState<number | undefined>(10000);
  const [sideText, setSideText] = useState<'prev' | 'next' | undefined>('next');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');
  // Frame-detail page → open only "프레임 정보" on first load; "로그 정보" starts collapsed.
  const [logOpen, setLogOpen] = useState<boolean>(false);
  const [frameOpen, setFrameOpen] = useState<boolean>(true);

  const { auditFrame, auditFrameLayoutFlow, auditFrameError, auditFrameLoading, auditFrameFragsEmpty } =
    useGetAuditLogFrame(selectedNodeId, selectedFile, apiSeq, side, count, cond, refreshKey);

  const [filters, setFilters] = useState<Filter | null>(null);

  useEffect(() => {
    if (auditFrame?.seq !== undefined && auditFrame.seq !== seq) {
      setSeq(auditFrame.seq);
    }
  }, [auditFrame, seq]);

  const resetCache = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const resetSearch = () => {
    setSide(undefined);
    setCond(undefined);
    setCount(undefined);
  };

  const onMaxFrameRefresh = () => {
    setSeq(0);
    setApiSeq(0);
    resetSearch();
    resetCache();
  };

  const onChangeRowsPerPage = useCallback((value: number) => {
    setPage(0);
  }, []);

  // Seek to an arbitrary frame (timeline drag / click). One API call per seek.
  const onSeek = (target: number) => {
    resetSearch();
    setSeq(target);
    setApiSeq(target);
  };

  const onApply = () => {
    // Validation logic
    let errorMessage = '';

    if (countNum === undefined || countNum <= 0) {
      errorMessage = t('validation.count_required');
    } else if (!sideText) {
      errorMessage = t('validation.side_required');
    }

    if (errorMessage) {
      setDialogMessage(errorMessage);
      setDialogOpen(true);
      return;
    }

    setCond(condText);
    setCount(countNum);
    setSide(sideText);
    setApiSeq(seq);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage('');
  };

  const onFilterApply = () => {
    if (filters) {
      const filterCount = Array.isArray(filters)
        ? filters.find((filter: { count: any }) => filter.count)?.count
        : null;

      const filterSide = Array.isArray(filters)
        ? filters.find((filter: { side: any }) => filter.side)?.side
        : null;

      const filterCond = Array.isArray(filters)
        ? filters.find((filter: { cond: any }) => filter.cond)?.cond
        : null;

      if (auditFrame?.seq !== undefined && auditFrame?.seq !== apiSeq) {
        setSeq(auditFrame.seq);
        setApiSeq(auditFrame.seq);
      }

      if (!filterCount) {
        setCount(10000);
      }

      if (!filterSide) {
        setSide('next');
      }

      if (!filterCond) {
        setCond(undefined);
      }
    } else {
      setCount(undefined);
      setSide(undefined);
      setCond(undefined);
    }
    resetCache();
  };

  const handleSearch = (filter: any) => {
    onFilterApply();

    if (filter?.count !== undefined) setCount(Number(filter.count));
    if (filter?.side !== undefined) setSide(filter.side);
    if (filter?.cond !== undefined) setCond(filter.cond);

    // Explicitly fetch:
    setRefreshKey((k) => k + 1);
  };

  // NEW: called by Reset button click (from AddFilter)
  const handleResetClick = () => {
    onFilterApply();
    // Clear filter params but DO NOT touch pagination
    setCount(undefined);
    setSide(undefined);
    setCond(undefined);
    setRefreshKey((k) => k + 1); // fetch
  };

  const hasFrags = !!(auditFrame?.frags && auditFrame.frags.length > 0);

  const columns: Column<AuditLogFrameFragItem>[] = [
    {
      key: 'id',
      label: t('frag_header.id'),
      width: 90,
      render: (r) => <SpecChip tone="green">{r.id}</SpecChip>,
    },
    {
      key: 'len',
      label: t('frag_header.len'),
      width: 110,
      align: 'right',
      render: (r) => <SpecChip tone="blue">{r.len?.toLocaleString()}</SpecChip>,
    },
    {
      key: 'data',
      label: t('frag_header.data'),
      render: (r) => <SpecChip tone="amber">{r.data}</SpecChip>,
    },
    { key: 'desc', label: t('top.description'), color: T.textSec, grow: true },
  ];

  return (
    <>
      {/* Info panel + table fill the full leftover viewport height and scroll
          internally; the layout-flow graph (when the frame has layout_flow) sits
          below at its fixed height and is reached by scrolling this container. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          gap: '14px',
        }}
      >
        <Box sx={{ display: 'flex', gap: '14px', flexShrink: 0, height: '100%' }}>
        {/* Left column — info panel + data-flow square below it */}
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            minHeight: 0,
          }}
        >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {/* ── Log Info ── */}
          <SectionHead title="로그 정보" open={logOpen} onToggle={() => setLogOpen((v) => !v)} />
          <Collapse in={logOpen} sx={{ flexShrink: 0 }}>
          <Box sx={{ p: '18px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  color: T.textPrim,
                  fontSize: 22,
                  fontWeight: 400,
                  wordBreak: 'break-all',
                }}
              >
                {selectedFile}
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  px: '10px',
                  py: '3px',
                  bgcolor: T.bgHover,
                  border: `1px solid ${T.border}`,
                  borderRadius: '5px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: T.link,
                  whiteSpace: 'nowrap',
                }}
              >
                수신 로그
              </Box>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing="6px" sx={{ mb: '6px' }}>
                <Typography sx={{ fontSize: 14, color: T.textDim }}>프레임 수 실시간</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: T.primary }}>MAX</Typography>
              </Stack>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: '8px 12px',
                  bgcolor: T.bg,
                  border: `1px solid ${T.border}`,
                  borderRadius: '6px',
                }}
              >
                <Box sx={{ flex: 1, fontSize: 16, color: T.textPrim, fontFamily: FONT_MONO }}>
                  {auditFrame?.max_frame ?? '—'}
                </Box>
                <Box
                  onClick={onMaxFrameRefresh}
                  sx={{ display: 'flex', cursor: 'pointer', color: T.textDim, '&:hover': { color: T.textPrim } }}
                >
                  <Iconify icon="eva:refresh-fill" width={16} />
                </Box>
              </Box>
            </Box>

            <InfoField label="크기" mono value={formatBytes(auditFrame?.file_size)} />
            <InfoField label="날짜" mono value={formatDateCustom(auditFrame?.date?.toString())} />
            <InfoField label="설명" valueDim value={auditFrame?.desc || '—'} />
          </Box>
          </Collapse>

          {/* ── Frame Info ── */}
          <SectionHead title="프레임 정보" open={frameOpen} onToggle={() => setFrameOpen((v) => !v)} />
          <Collapse in={frameOpen} sx={{ flexShrink: 0 }}>
          <Box sx={{ p: '18px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  color: T.textPrim,
                  fontSize: 22,
                  fontWeight: 400,
                  fontFamily: FONT_MONO,
                }}
              >
                {auditFrame?.seq ?? '—'}
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  px: '10px',
                  py: '3px',
                  bgcolor: T.bgHover,
                  border: `1px solid ${T.border}`,
                  borderRadius: '5px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: T.textSec,
                  whiteSpace: 'nowrap',
                }}
              >
                수신 로그
              </Box>
            </Box>

            <InfoField
              label="시간"
              mono
              value={
                <Box component="span">
                  {auditFrame?.time} {auditFrame?.time_ms}
                  <Box component="span" sx={{ fontSize: 12, color: T.textDim }}>
                    {' '}
                    ms{' '}
                  </Box>
                  {auditFrame?.time_us}
                  <Box component="span" sx={{ fontSize: 12, color: T.textDim }}>
                    {' '}
                    us
                  </Box>
                </Box>
              }
            />
            <InfoField label="크기" mono value={formatBytes(auditFrame?.size)} />
            <InfoField label="전문 유형" mono value={auditFrame?.head ?? '—'} />
            <InfoField label="채널" mono value={auditFrame?.rid ?? '—'} />
          </Box>
          </Collapse>
        </Box>

        {/* Data-flow square below the panel — click to enlarge */}
        {!auditFrameLoading && <AuditFrameLayoutFlow layoutFlow={auditFrameLayoutFlow} square />}
        </Box>

        {/* Right — filter bar + frame nav + fragment table */}
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <AuditFrameFilterBar
            filters={filters}
            setFilters={setFilters}
            onApply={handleSearch}
            onResetClick={handleResetClick}
          />

          <FrameTimeline
            label={t('audit_log_frame_detail.frame_nav')}
            current={seq === 0 ? auditFrame?.max_frame || 1 : seq}
            total={auditFrame?.max_frame || 1}
            onSeek={onSeek}
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
            {auditFrameLoading || hasFrags ? (
              <DataTable<AuditLogFrameFragItem>
                columns={columns}
                headerVariant="light"
                rows={auditFrame?.frags || []}
                loading={auditFrameLoading}
                error={auditFrameError}
                emptyLabel={t('frag_header.empty')}
              />
            ) : (
              <CodeBlock>{auditFrame?.data || ''}</CodeBlock>
            )}
          </Box>
        </Box>
      </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        sx={{
          '& .MuiPaper-root': {
            background: '#FFF2F4',
            py: 3,
            px: 1.5,
            border: `1px solid #FFD8D8`,
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Stack direction="row" alignItems="center">
              <SvgIcon height="20" width="20" sx={{ mr: 0.5 }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.30865 2.07922C9.61592 1.53088 10.3841 1.53088 10.6913 2.07922L18.6419 16.2675C18.9491 16.8159 18.565 17.5013 17.9505 17.5013H2.04949C1.43496 17.5013 1.05088 16.8159 1.35814 16.2675L9.30865 2.07922Z"
                    fill="#FF3D4A"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.66699 6.66797C9.39085 6.66797 9.16699 6.89183 9.16699 7.16797V12.0013C9.16699 12.2774 9.39085 12.5013 9.66699 12.5013H10.3337C10.6098 12.5013 10.8337 12.2774 10.8337 12.0013V7.16797C10.8337 6.89183 10.6098 6.66797 10.3337 6.66797H9.66699ZM9.66699 13.3346C9.39085 13.3346 9.16699 13.5585 9.16699 13.8346V14.5013C9.16699 14.7774 9.39085 15.0013 9.66699 15.0013H10.3337C10.6098 15.0013 10.8337 14.7774 10.8337 14.5013V13.8346C10.8337 13.5585 10.6098 13.3346 10.3337 13.3346H9.66699Z"
                    fill="white"
                  />
                </svg>
              </SvgIcon>
              <Typography sx={{ color: error.dark, fontSize: 15, fontWeight: 500 }}>
                {t('validation.title')}
              </Typography>
            </Stack>

            <IconButton onClick={handleDialogClose}>
              <Iconify color="#FFBABA" icon="mingcute:close-line" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Typography sx={{ color: error.dark, fontSize: 19, mt: 1 }}>{dialogMessage}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
