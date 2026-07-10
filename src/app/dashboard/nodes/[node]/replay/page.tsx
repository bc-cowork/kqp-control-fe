'use client';

import type { ReactNode } from 'react';
import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { fetcher, endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { Iconify } from 'src/components/iconify';
import { Panel, BtnGhost, PageShell, DataTable, StatusBadge } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = { params: { node: string } };

type ProcessRow = { pid: string | number; command: string };
type Option = { value: string; label: string };

// ----------------------------------------------------------------------
// Small styled field primitives (local, ACCENT2-accented — mirror FilterField)
// ----------------------------------------------------------------------

function FieldLabel({ children }: { children: ReactNode }) {
  return <Typography sx={{ fontSize: 14, color: T.textDim }}>{children}</Typography>;
}

function RSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
  width = '100%',
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: Option[];
  onChange: (v: string) => void;
  disabled?: boolean;
  width?: number | string;
}) {
  const { t } = useTranslate('replay');
  const ph = placeholder ?? t('audit_log.select');
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const open = !!anchor && !disabled;
  const selected = options.find((o) => o.value === value);
  const hasValue = !!value && value !== '0000-00-00';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box
        onClick={(e) => (disabled ? undefined : setAnchor(e.currentTarget))}
        sx={{
          height: 32,
          width,
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${open ? ACCENT2 : T.border}`,
          borderRadius: '5px',
          px: 1.25,
          fontSize: 15,
          fontFamily: FONT_MONO,
          color: hasValue ? T.textPrim : T.textFaint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label ?? (hasValue ? value : ph)}
        </Box>
        <Iconify
          icon="eva:chevron-down-fill"
          width={16}
          sx={{ color: T.textDim, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}
        />
      </Box>
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: anchor?.offsetWidth,
              maxHeight: 260,
              bgcolor: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
              p: 0.5,
            },
          },
        }}
      >
        {options.length === 0 ? (
          <Box sx={{ p: '8px 10px', fontSize: 14, color: T.textDim }}>{t('no_options')}</Box>
        ) : (
          options.map((o) => (
            <Box
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setAnchor(null);
              }}
              sx={{
                p: '7px 10px',
                borderRadius: '4px',
                fontSize: 15,
                fontFamily: FONT_MONO,
                color: o.value === value ? ACCENT2 : T.textPrim,
                bgcolor: o.value === value ? `${ACCENT2}1f` : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: o.value === value ? `${ACCENT2}1f` : T.bgHover },
              }}
            >
              {o.label}
            </Box>
          ))
        )}
      </Popover>
    </Box>
  );
}

function RTextInput({
  label,
  value,
  onChange,
  placeholder,
  width = '100%',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number | string;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box
        component="input"
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        sx={{
          height: 32,
          width,
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '5px',
          px: 1.25,
          fontSize: 15,
          fontFamily: FONT_MONO,
          color: T.textPrim,
          outline: 'none',
          '&:focus': { borderColor: ACCENT2 },
          '&::placeholder': { color: T.textFaint },
        }}
      />
    </Box>
  );
}

function RTimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box
        component="input"
        type="time"
        step={1}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value || '00:00:00')}
        sx={{
          height: 32,
          width: '100%',
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '5px',
          px: 1.25,
          fontSize: 15,
          fontFamily: FONT_MONO,
          color: T.textPrim,
          outline: 'none',
          colorScheme: 'dark',
          '&:focus': { borderColor: ACCENT2 },
        }}
      />
    </Box>
  );
}

function RSpeedInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslate('replay');
  const STEP = 0.25;
  const setNum = (n: number) => onChange(n.toFixed(2).replace(/\.00$/, ''));
  const inc = () => setNum((parseFloat(value) || 0) + STEP);
  const dec = () => setNum(Math.max(0.1, (parseFloat(value) || 0) - STEP));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) onChange(v);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <FieldLabel>{t('audit_log.speed')}</FieldLabel>
      <Box
        sx={{
          height: 32,
          width: '100%',
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '5px',
          px: 1.25,
          display: 'flex',
          alignItems: 'center',
          '&:focus-within': { borderColor: ACCENT2 },
        }}
      >
        <Box
          component="input"
          value={value}
          onChange={handleChange}
          sx={{
            flex: 1,
            width: '100%',
            bgcolor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 15,
            fontFamily: FONT_MONO,
            color: T.textPrim,
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0.5 }}>
          <Iconify icon="eva:chevron-up-fill" width={16} onClick={inc} sx={{ color: T.textDim, cursor: 'pointer', mb: '-4px', '&:hover': { color: ACCENT2 } }} />
          <Iconify icon="eva:chevron-down-fill" width={16} onClick={dec} sx={{ color: T.textDim, cursor: 'pointer', mt: '-4px', '&:hover': { color: ACCENT2 } }} />
        </Box>
      </Box>
    </Box>
  );
}

function SubPanel({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ bgcolor: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: '8px', p: '14px', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function Page({ params }: Props) {
  const { node } = params;
  const { t } = useTranslate('replay');
  const url = endpoints.replay.info(node);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const processData: ProcessRow[] = Array.isArray(data?.data?.replay_status?.process_list)
    ? data.data.replay_status.process_list
    : [];

  const logTypeList = data?.data?.replay_interface?.log_type_list || [];
  const fileTree = data?.data?.replay_interface?.file_tree;

  const [logType, setLogType] = React.useState('');
  const [file, setFile] = React.useState('');
  const [date, setDate] = React.useState('0000-00-00');
  const [startTime, setStartTime] = React.useState('00:00:00');
  const [endTime, setEndTime] = React.useState('00:00:00');
  const [head, setHead] = React.useState('All');
  const [channel, setChannel] = React.useState('All');
  const [outboundExpression, setOutboundExpression] = React.useState('');
  const [currentSpeed, setCurrentSpeed] = React.useState('1.0');

  const [toolPid, setToolPid] = React.useState('');
  const [killDialogOpen, setKillDialogOpen] = React.useState(false);
  const [replayDialogOpen, setReplayDialogOpen] = React.useState(false);
  const [replaying, setReplaying] = React.useState(false);

  useEffect(() => {
    if (!logType) {
      setDate('');
      setFile('');
    }
  }, [logType]);

  const logTypeOptions: Option[] = logTypeList.map((i: any) => ({ value: i.label, label: i.label }));
  const fileOptions: Option[] = getKeysFromSelectedValue(fileTree, logTypeList, logType);
  const dateOptions: Option[] = getDatesFromSelectedValue(fileTree, logTypeList, logType, file);

  const conditions = [
    !!(logType && logType !== ''),
    !!(file && file !== ''),
    !!(date && date !== '0000-00-00' && date !== ''),
    !!(startTime && startTime !== '00:00:00'),
    !!(endTime && endTime !== '00:00:00'),
    !!(head && head !== ''),
    !!(channel && channel !== ''),
    !!(outboundExpression && outboundExpression !== ''),
    !!(currentSpeed && currentSpeed !== ''),
  ];
  const filledCount = conditions.filter(Boolean).length;
  const canReplay = conditions.every(Boolean);

  const missing: string[] = [
    !conditions[0] && t('audit_log.log_type'),
    !conditions[1] && t('audit_log.file'),
    !conditions[2] && t('audit_log.date'),
    !conditions[3] && t('audit_log.start_time'),
    !conditions[4] && t('audit_log.end_time'),
    !conditions[5] && t('audit_log.head'),
    !conditions[6] && t('audit_log.channel_number'),
    !conditions[7] && t('audit_log.destination_to'),
    !conditions[8] && t('audit_log.speed'),
  ].filter(Boolean) as string[];

  const selectedProc = processData.find((p) => String(p.pid) === String(toolPid));
  const selectedIndex = processData.findIndex((p) => String(p.pid) === String(toolPid));

  // 설정값 → 실행 명령어 (buildReplayCmd 참조)
  const executeCommand = (() => {
    const p = ['kc play', `name:${file}`];
    if (date && date !== '0000-00-00') p.push(`date:${date.replaceAll('-', '')}`);
    if (startTime && endTime) p.push(`time:${startTime.replaceAll(':', '')}~${endTime.replaceAll(':', '')}`);
    if (head && head !== 'All') p.push(`head:${head}`);
    if (channel && channel !== 'All') p.push(`ch:${channel}`);
    if (outboundExpression) p.push(`throw_to:${outboundExpression}`);
    p.push(`speed:${currentSpeed}`);
    return p.join(' ');
  })();

  const resetForm = () => {
    setLogType('');
    setFile('');
    setDate('0000-00-00');
    setStartTime('00:00:00');
    setEndTime('00:00:00');
    setOutboundExpression('');
  };

  const handleConfirmReplay = async () => {
    setReplaying(true);
    const replayData = {
      name: file,
      date: date.replaceAll('-', ''),
      start_hhmmss: startTime.replaceAll(':', ''),
      end_hhmmss: endTime.replaceAll(':', ''),
      throw_to: outboundExpression,
      head,
      speed: currentSpeed,
    };
    const BASE_URL = `${CONFIG.serverUrl}/apik/${node}/replay`;
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(replayData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      setReplayDialogOpen(false);
    } catch (e) {
      console.error('Failed to initiate replay request:', e);
    } finally {
      mutate();
      resetForm();
      setReplaying(false);
    }
  };

  const columns: Column<ProcessRow>[] = [
    {
      key: 'status',
      label: t('top_table.status'),
      width: 120,
      render: () => <StatusBadge on labelOn="Play" labelOff="Stop" color={ACCENT2} />,
    },
    { key: 'pid', label: t('top_table.process_id'), mono: true, width: 150, color: T.textSec },
    { key: 'command', label: t('top_table.command'), mono: true, dim: true, grow: true },
  ];

  return (
    <PageShell node={node} crumbs={[{ label: t('top.title') }]} title={t('top.title')}>
      {/* Top row: process table + Tools panel */}
      <Box sx={{ display: 'flex', gap: '14px', alignItems: 'stretch', flexShrink: 0, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
        <Box sx={{ flex: 1, minWidth: 0, maxHeight: 210, display: 'flex', flexDirection: 'column' }}>
          <DataTable<ProcessRow>
            columns={columns}
            rows={processData}
            headerVariant="light"
            selectedIndex={selectedIndex < 0 ? null : selectedIndex}
            onRowClick={(row) => setToolPid(String(row.pid))}
            loading={isLoading}
            error={!!error}
            emptyLabel={t('no_processes')}
          />
        </Box>

        <Panel sx={{ width: { xs: '100%', lg: 340 }, flexShrink: 0, height: 210, boxSizing: 'border-box', bgcolor: T.bgCard, p: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:settings-2-outline" width={16} sx={{ color: T.textDim }} />
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: T.textSec }}>{t('tool_box.tools')}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                height: 30,
                px: 1.25,
                border: `1px solid ${T.border}`,
                borderRadius: '5px',
                bgcolor: T.bg,
              }}
            >
              <Typography sx={{ fontSize: 14, color: T.textDim, flexShrink: 0 }}>{t('tool_box.pid')}</Typography>
              <Box sx={{ width: '1px', height: 12, bgcolor: T.border, flexShrink: 0 }} />
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 14,
                  fontFamily: FONT_MONO,
                  color: toolPid ? T.textPrim : T.textDim,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {toolPid || t('tool_box.tab_the_list')}
              </Typography>
            </Box>
            <Box
              component="button"
              disabled={!toolPid}
              onClick={() => setKillDialogOpen(true)}
              sx={{
                height: 30,
                px: 1.75,
                borderRadius: '5px',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: toolPid ? 'pointer' : 'default',
                border: `1px solid ${toolPid ? T.border : '#373F4E'}`,
                ...(toolPid
                  ? { background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`, color: ACCENT2 }
                  : { bgcolor: '#373F4E', color: '#667085' }),
              }}
            >
              {t('tool_box.kill')}
            </Box>
          </Stack>
        </Panel>
      </Box>

      {/* Replay Interface */}
      <Panel sx={{ bgcolor: T.bgCard, p: '16px 18px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '14px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: T.textSec }}>{t('audit_log.replay_interface')}</Typography>
            <Box
              sx={{
                px: 1,
                py: '2px',
                borderRadius: '10px',
                fontFamily: FONT_MONO,
                fontSize: 13,
                bgcolor: `${ACCENT2}22`,
                color: ACCENT2,
              }}
            >
              {filledCount}/9
            </Box>
          </Box>
          <Box
            component="button"
            disabled={!canReplay}
            onClick={() => setReplayDialogOpen(true)}
            title={canReplay ? '' : `${t('missing_fields')}: ${missing.join(', ')}`}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              width: 71,
              height: 30,
              boxSizing: 'border-box',
              border: 'none',
              borderRadius: '6px',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              cursor: canReplay ? 'pointer' : 'default',
              ...(canReplay ? { bgcolor: T.primary, color: T.onFill } : { bgcolor: T.border, color: T.textDim }),
            }}
          >
            <Iconify icon="eva:arrow-ios-forward-fill" width={14} />
            {t('play')}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
            gap: '12px',
            alignItems: 'start',
          }}
        >
          <SubPanel>
            <RSelect label={t('audit_log.log_type')} value={logType} options={logTypeOptions} onChange={setLogType} />
            <RSelect label={t('audit_log.file')} value={file} options={fileOptions} onChange={setFile} disabled={!logType} />
          </SubPanel>

          <SubPanel>
            <RSelect label={t('audit_log.date')} value={date} placeholder="0000-00-00" options={dateOptions} onChange={setDate} disabled={!file} />
            <RTimeInput label={t('audit_log.start_time')} value={startTime} onChange={setStartTime} />
            <RTimeInput label={t('audit_log.end_time')} value={endTime} onChange={setEndTime} />
          </SubPanel>

          <SubPanel>
            <RTextInput label={t('audit_log.head')} value={head} onChange={setHead} placeholder="All" />
            <RTextInput label={t('audit_log.channel_number')} value={channel} onChange={setChannel} placeholder="All" />
          </SubPanel>

          <SubPanel>
            <RTextInput label={t('audit_log.destination_to')} value={outboundExpression} onChange={setOutboundExpression} placeholder="<app>.<inst>" />
            <RSpeedInput value={currentSpeed} onChange={setCurrentSpeed} />
          </SubPanel>
        </Box>

        {!canReplay && (
          <Box sx={{ mt: '12px', display: 'flex', alignItems: 'center', gap: 0.75, color: ACCENT2 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>⚠</Box>
            <Typography sx={{ fontSize: 13, color: ACCENT2 }}>
              {t('missing_fields')}: {missing.join(', ')}
            </Typography>
          </Box>
        )}
      </Panel>

      {/* Confirm modal */}
      <ConfirmModal
        open={replayDialogOpen}
        replaying={replaying}
        executeCommand={executeCommand}
        fields={[
          [t('audit_log.log_type'), logType],
          [t('audit_log.file'), file],
          [t('audit_log.date'), date],
          [t('audit_log.start_time'), startTime],
          [t('audit_log.end_time'), endTime],
          [t('audit_log.head'), head],
          [t('audit_log.channel_number'), channel],
          [t('audit_log.destination_to'), outboundExpression],
          [t('audit_log.speed'), currentSpeed],
        ]}
        onClose={() => setReplayDialogOpen(false)}
        onConfirm={handleConfirmReplay}
      />

      {/* Kill modal */}
      <KillModal
        open={killDialogOpen}
        pid={toolPid}
        command={selectedProc?.command || ''}
        nodeId={node}
        onClose={() => setKillDialogOpen(false)}
        onKilled={() => {
          setToolPid('');
          mutate();
        }}
      />
    </PageShell>
  );
}

// ----------------------------------------------------------------------
// Modal shell
// ----------------------------------------------------------------------

function ModalOverlay({
  open,
  onClose,
  width,
  scroll,
  children,
}: {
  open: boolean;
  onClose: () => void;
  width: number;
  scroll?: boolean;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        bgcolor: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2.5,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width,
          maxWidth: '100%',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '10px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
          color: T.textPrim,
          ...(scroll ? { maxHeight: '90vh', overflowY: 'auto' } : {}),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function ConfirmModal({
  open,
  replaying,
  executeCommand,
  fields,
  onClose,
  onConfirm,
}: {
  open: boolean;
  replaying: boolean;
  executeCommand: string;
  fields: [string, string][];
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslate('replay');
  return (
    <ModalOverlay open={open} onClose={onClose} width={460} scroll>
      <Box sx={{ p: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: T.textPrim }}>{t('confirm_dialog.title')}</Typography>
      </Box>

      <Box sx={{ p: '16px 20px' }}>
        <Typography sx={{ fontSize: 15, color: T.textDim, mb: 1.5 }}>{t('confirm_dialog.description')}</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {fields.map(([label, value]) => (
            <Box
              key={label}
              sx={{
                bgcolor: T.bgHover,
                border: `1px solid ${T.border}`,
                borderRadius: '6px',
                p: '8px 11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.25,
                minWidth: 0,
              }}
            >
              <Typography sx={{ fontSize: 13, color: ACCENT2, flexShrink: 0 }}>{label}</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 500, fontFamily: FONT_MONO, color: T.textPrim, textAlign: 'right', wordBreak: 'break-all', minWidth: 0 }}>
                {value || '-'}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 1.75, bgcolor: T.bg, border: `1px solid ${T.border}`, borderRadius: '6px', p: '10px 12px' }}>
          <Typography sx={{ fontSize: 14, color: T.textDim, mb: 0.5 }}>{t('execute_command')}</Typography>
          <Typography sx={{ fontSize: 15, fontFamily: FONT_MONO, color: T.accent, wordBreak: 'break-all' }}>{executeCommand}</Typography>
        </Box>
      </Box>

      <Box sx={{ p: '14px 20px', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.25 }}>
        <BtnGhost onClick={onClose} disabled={replaying}>
          {t('confirm_dialog.cancel')}
        </BtnGhost>
        <Box
          component="button"
          onClick={onConfirm}
          disabled={replaying}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            height: 32,
            px: 2,
            bgcolor: T.primary,
            border: 'none',
            borderRadius: '6px',
            color: T.onFill,
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: replaying ? 'default' : 'pointer',
            opacity: replaying ? 0.7 : 1,
          }}
        >
          <Iconify icon="eva:arrow-ios-forward-fill" width={14} />
          {replaying ? t('confirm_dialog.submitting') : t('confirm_dialog.start')}
        </Box>
      </Box>
    </ModalOverlay>
  );
}

function KillModal({
  open,
  pid,
  command,
  nodeId,
  onClose,
  onKilled,
}: {
  open: boolean;
  pid: string | number;
  command: string;
  nodeId: string | number;
  onClose: () => void;
  onKilled: () => void;
}) {
  const { t } = useTranslate('replay');
  const [terminating, setTerminating] = React.useState(false);

  const handleTerminate = async () => {
    setTerminating(true);
    const url = `${CONFIG.serverUrl}/apik/${nodeId}/replay/terminate`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No message available' }));
        console.error('Termination failed:', errorData);
        return;
      }
      onClose();
    } catch (e) {
      console.error('Network or unexpected error during termination:', e);
    } finally {
      onKilled();
      setTerminating(false);
    }
  };

  return (
    <ModalOverlay open={open} onClose={onClose} width={420}>
      <Box sx={{ p: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: T.off, boxShadow: `0 0 6px ${T.off}99`, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: T.textPrim }}>{t('kill_dialog.title')}</Typography>
      </Box>

      <Box sx={{ p: '16px 20px' }}>
        <Typography sx={{ fontSize: 15, color: T.textDim, mb: 1.5 }}>{t('kill_dialog.description')}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, p: '12px 14px', borderRadius: '8px', border: `1px solid ${T.border}` }}>
          <Typography sx={{ fontSize: 15, color: ACCENT2 }}>{t('kill_dialog.pid')}</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 400, fontFamily: FONT_MONO, color: T.textPrim, letterSpacing: '0.02em', lineHeight: 1 }}>{pid || '-'}</Typography>
        </Box>
        <Box sx={{ mt: 1.75, bgcolor: T.bg, border: `1px solid ${T.border}`, borderRadius: '6px', p: '10px 12px' }}>
          <Typography sx={{ fontSize: 14, color: T.textDim, mb: 0.5 }}>{t('execute_command')}</Typography>
          <Typography sx={{ fontSize: 15, fontFamily: FONT_MONO, color: T.textSec, wordBreak: 'break-all' }}>{command || '-'}</Typography>
        </Box>
      </Box>

      <Box sx={{ p: '14px 20px', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'flex-end', gap: 1.25 }}>
        <BtnGhost onClick={onClose} disabled={terminating}>
          {t('kill_dialog.cancel')}
        </BtnGhost>
        <Box
          component="button"
          onClick={handleTerminate}
          disabled={terminating}
          sx={{
            height: 30,
            px: 1.75,
            borderRadius: '5px',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: terminating ? 'default' : 'pointer',
            border: `1px solid ${T.border}`,
            background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`,
            color: ACCENT2,
            opacity: terminating ? 0.7 : 1,
          }}
        >
          {terminating ? t('kill_dialog.submitting') : t('kill_dialog.kill')}
        </Box>
      </Box>
    </ModalOverlay>
  );
}

// ----------------------------------------------------------------------
// Data helpers (preserved from original)
// ----------------------------------------------------------------------

function getKeysFromSelectedValue(fileTree: any, logTree: any, selectedKey: string): Option[] {
  const filteredValue = logTree.filter((item: any) => item.label === selectedKey);
  if (!fileTree || typeof fileTree !== 'object' || !fileTree[filteredValue[0]?.key]) {
    return [];
  }
  const selectedObject = fileTree[filteredValue[0]?.key];
  const keys = Object.keys(selectedObject);
  return keys.map((key) => ({ label: key, value: key }));
}

function getDatesFromSelectedValue(fileTree: any, logTree: any, selectedKey: any, selectedFile: any): Option[] {
  const filteredValue = logTree.filter((item: any) => item.label === selectedKey);
  const fileTreeKey = filteredValue[0]?.key;
  if (!fileTree || typeof fileTree !== 'object' || !fileTree[fileTreeKey] || !fileTree[fileTreeKey][selectedFile]) {
    return [];
  }
  const dateArray = fileTree[fileTreeKey][selectedFile];
  return (
    dateArray.map((dateString: any) => {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const dateObject = `${year}-${month}-${day}`;
      return { label: dateObject, value: dateObject };
    }) || []
  );
}
