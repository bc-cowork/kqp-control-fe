'use client';

import type { ReactNode } from 'react';

import React, { useEffect } from 'react';
import useSWR from 'swr';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { endpoints, fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';
import { Panel, PageShell, DataTable, StatusBadge } from 'src/components/v5';

import type { Column } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = { params: { node: string } };

type ProcessRow = { pid: string | number; command: string };
type Option = { value: string; label: string };

// ----------------------------------------------------------------------
// Small styled field primitives (local, ACCENT2-accented v5 look)
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box
        onClick={(e) => (disabled ? undefined : setAnchor(e.currentTarget))}
        sx={{
          height: 34,
          width,
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${open ? ACCENT2 : T.border}`,
          borderRadius: '6px',
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
          sx={{ color: T.textSec, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}
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
              boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box
        component="input"
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        sx={{
          height: 34,
          width,
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <FieldLabel>{label}</FieldLabel>
      <Box
        component="input"
        type="time"
        step={1}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value || '00:00:00')}
        sx={{
          height: 34,
          width: '100%',
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <FieldLabel>{t('audit_log.speed')}</FieldLabel>
      <Box
        sx={{
          height: 34,
          width: 110,
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
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
          <Iconify icon="eva:chevron-up-fill" width={16} onClick={inc} sx={{ color: T.textSec, cursor: 'pointer', mb: '-4px', '&:hover': { color: ACCENT2 } }} />
          <Iconify icon="eva:chevron-down-fill" width={16} onClick={dec} sx={{ color: T.textSec, cursor: 'pointer', mt: '-4px', '&:hover': { color: ACCENT2 } }} />
        </Box>
      </Box>
    </Box>
  );
}

function SubPanel({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ bgcolor: T.bgPanel, borderRadius: '8px', p: '14px', display: 'flex', flexDirection: 'column', gap: 1.75, minHeight: 150 }}>
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
  ].filter(Boolean) as string[];

  const selectedProc = processData.find((p) => String(p.pid) === String(toolPid));
  const selectedIndex = processData.findIndex((p) => String(p.pid) === String(toolPid));

  const executeCommand = `replay ${file || '<file>'} ${(date || '').replaceAll('-', '') || '<date>'} ${startTime.replaceAll(':', '')} ${endTime.replaceAll(':', '')} --to ${outboundExpression || '<dest>'} --head ${head} --channel ${channel} --speed ${currentSpeed}`;

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
      render: () => <StatusBadge on labelOn={t('play')} color={ACCENT2} />,
    },
    { key: 'pid', label: t('top_table.process_id'), mono: true, width: 150 },
    { key: 'command', label: t('top_table.command'), mono: true, dim: true, grow: true },
  ];

  return (
    <PageShell node={node} crumbs={[{ label: t('top.title') }]} title={t('top.title')}>
      {/* Top row: process table + Tools panel */}
      <Box sx={{ display: 'flex', gap: '14px', alignItems: 'stretch', flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
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

        <Panel sx={{ width: { xs: '100%', lg: 340 }, flexShrink: 0, p: '16px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:settings-2-outline" width={18} sx={{ color: T.textSec }} />
            <Typography sx={{ fontSize: 15, color: T.textPrim }}>{t('tool_box.tools')}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                flex: 1,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: '6px',
                px: 1.25,
                fontSize: 15,
              }}
            >
              <Typography sx={{ fontSize: 14, color: T.textDim, whiteSpace: 'nowrap' }}>
                {t('tool_box.pid')} |
              </Typography>
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: FONT_MONO,
                  color: toolPid ? T.textPrim : T.textFaint,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {toolPid || t('tool_box.tap_from_list')}
              </Typography>
              {toolPid && (
                <Iconify
                  icon="eva:close-fill"
                  width={16}
                  onClick={() => setToolPid('')}
                  sx={{ color: T.textSec, cursor: 'pointer', '&:hover': { color: T.textPrim } }}
                />
              )}
            </Box>
            <Box
              component="button"
              disabled={!toolPid}
              onClick={() => setKillDialogOpen(true)}
              sx={{
                height: 34,
                px: 2,
                borderRadius: '6px',
                border: 'none',
                fontSize: 15,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: toolPid ? 'pointer' : 'default',
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
      <Panel sx={{ p: '18px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: T.textPrim }}>{t('audit_log.replay_interface')}</Typography>
            <Box
              sx={{
                px: 1.25,
                py: '2px',
                borderRadius: '10px',
                fontFamily: FONT_MONO,
                fontSize: 14,
                bgcolor: `${ACCENT2}22`,
                color: ACCENT2,
              }}
            >
              {filledCount}/9
            </Box>
          </Stack>
          <Box
            component="button"
            disabled={!canReplay}
            onClick={() => setReplayDialogOpen(true)}
            sx={{
              height: 34,
              px: 2.25,
              borderRadius: '6px',
              border: 'none',
              fontSize: 15,
              fontWeight: 500,
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              cursor: canReplay ? 'pointer' : 'default',
              ...(canReplay ? { bgcolor: T.primary, color: T.onFill } : { bgcolor: T.border, color: T.textDim }),
            }}
          >
            <Iconify icon="eva:play-circle-outline" width={17} />
            {t('play')}
          </Box>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
            gap: '14px',
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
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: ACCENT2 }}>
            <Iconify icon="eva:alert-circle-outline" width={16} />
            <Typography sx={{ fontSize: 14, color: ACCENT2 }}>
              {t('missing_fields')}: {missing.join(', ')}
            </Typography>
          </Stack>
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

function ModalOverlay({ open, onClose, width, children }: { open: boolean; onClose: () => void; width: number; children: ReactNode }) {
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
        p: 2,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width,
          maxWidth: '100%',
          bgcolor: T.bgPanel,
          border: `1px solid ${T.border}`,
          borderRadius: '10px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          color: T.textPrim,
          p: 2.5,
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
    <ModalOverlay open={open} onClose={onClose} width={460}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Iconify icon="eva:play-circle-outline" width={20} sx={{ color: ACCENT2 }} />
        <Typography sx={{ fontSize: 17, fontWeight: 500, color: T.textPrim }}>{t('confirm_dialog.title')}</Typography>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        {fields.map(([label, value]) => (
          <Box key={label} sx={{ bgcolor: T.bgHover, borderRadius: '6px', p: '8px 10px' }}>
            <Typography sx={{ fontSize: 12, color: ACCENT2, mb: 0.25 }}>{label}</Typography>
            <Typography sx={{ fontSize: 14, fontFamily: FONT_MONO, color: T.textPrim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value || '-'}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 13, color: T.textDim, mb: 0.75 }}>{t('execute_command')}</Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            p: '12px 14px',
            fontFamily: FONT_MONO,
            fontSize: 14,
            lineHeight: 1.6,
            color: T.primary,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {executeCommand}
        </Box>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ mt: 2.5 }}>
        <Box
          component="button"
          onClick={onClose}
          disabled={replaying}
          sx={{
            height: 34,
            px: 2,
            borderRadius: '6px',
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
            color: T.textSec,
            fontSize: 15,
            fontFamily: 'inherit',
            cursor: 'pointer',
            '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
          }}
        >
          {t('confirm_dialog.cancel')}
        </Box>
        <Box
          component="button"
          onClick={onConfirm}
          disabled={replaying}
          sx={{
            height: 34,
            px: 2.25,
            borderRadius: '6px',
            border: 'none',
            bgcolor: T.primary,
            color: '#fff',
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: replaying ? 'default' : 'pointer',
            opacity: replaying ? 0.7 : 1,
            '&:hover': { bgcolor: T.primaryHov },
          }}
        >
          {replaying ? t('confirm_dialog.submitting') : t('confirm_dialog.start')}
        </Box>
      </Stack>
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
      <Stack alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            bgcolor: T.off,
            boxShadow: `0 0 12px ${T.off}, 0 0 4px ${T.off}`,
            mt: 1,
          }}
        />
        <Typography sx={{ fontSize: 15, color: T.textSec }}>{t('kill_dialog.question')}</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontSize: 14, color: T.textDim }}>{t('kill_dialog.pid')}</Typography>
          <Typography sx={{ fontSize: 24, fontFamily: FONT_MONO, color: T.textPrim }}>{pid}</Typography>
        </Stack>
        <Box
          sx={{
            width: '100%',
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            p: '10px 12px',
            fontFamily: FONT_MONO,
            fontSize: 13,
            color: T.textSec,
            wordBreak: 'break-all',
          }}
        >
          {command || '-'}
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ mt: 2.5 }}>
        <Box
          component="button"
          onClick={onClose}
          disabled={terminating}
          sx={{
            height: 34,
            px: 2,
            borderRadius: '6px',
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
            color: T.textSec,
            fontSize: 15,
            fontFamily: 'inherit',
            cursor: 'pointer',
            '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
          }}
        >
          {t('kill_dialog.cancel')}
        </Box>
        <Box
          component="button"
          onClick={handleTerminate}
          disabled={terminating}
          sx={{
            height: 34,
            px: 2.25,
            borderRadius: '6px',
            border: 'none',
            background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`,
            color: ACCENT2,
            fontSize: 15,
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: terminating ? 'default' : 'pointer',
            opacity: terminating ? 0.7 : 1,
          }}
        >
          {terminating ? t('kill_dialog.submitting') : t('kill_dialog.kill')}
        </Box>
      </Stack>
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
