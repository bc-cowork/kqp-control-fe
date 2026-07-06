'use client';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { BtnGhost, PageShell, BtnPrimary, CodeBlock } from 'src/components/v5';

// ----------------------------------------------------------------------

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ----------------------------------------------------------------------

type FormValues = {
  name: string;
  desc: string;
  interval: number;
  scriptFileName: string;
  scriptCode: string;
};

type Props = {
  nodeId: string;
  alertId?: string;
};

// Day indices: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
// Crontab uses: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
const DAY_CRON_VALUES = [1, 2, 3, 4, 5, 6, 0];

/** Ensure time string is in HH:mm format required by input[type="time"] */
function normalizeTime(val: string): string {
  const parts = val.replace(/\s+/g, '').split(':');
  if (parts.length < 2) return '00:00';
  const h = parts[0].padStart(2, '0');
  const m = parts[1].padStart(2, '0').slice(0, 2);
  return `${h}:${m}`;
}

function buildCronDays(selected: boolean[]): string {
  const values = selected
    .map((s, i) => (s ? DAY_CRON_VALUES[i] : null))
    .filter((v): v is number => v !== null)
    .sort((a, b) => a - b);
  if (values.length === 0) return '';
  if (values.length === 7) return '*';

  // Try to collapse consecutive ranges
  const parts: string[] = [];
  let start = values[0];
  let prev = values[0];
  for (let i = 1; i <= values.length; i += 1) {
    const cur = values[i];
    if (cur === prev + 1) {
      prev = cur;
    } else {
      parts.push(start === prev ? String(start) : `${start}-${prev}`);
      start = cur;
      prev = cur;
    }
  }
  return parts.join(',');
}

/** Parse crontab day string (e.g. "1-5", "1,3,5", "*") back to boolean[7] */
function parseCronDays(cron: string): boolean[] {
  if (!cron || cron === '*') return [true, true, true, true, true, true, true];

  const values: number[] = cron
    .split(',')
    .map((s) => s.trim())
    .flatMap((seg) => {
      if (seg.includes('-')) {
        const [a, b] = seg.split('-').map((x) => Number(x.trim()));
        return Array.from({ length: b - a + 1 }, (_, i) => a + i);
      }
      return [Number(seg)];
    });

  return DAY_CRON_VALUES.map((cronVal) => values.includes(cronVal));
}

// ----------------------------------------------------------------------

// Shared field label
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Typography sx={{ color: T.textSec, fontSize: 15, fontWeight: 500 }}>
      {children}
      {required && (
        <Box component="span" sx={{ color: T.off, ml: 0.5 }}>
          *
        </Box>
      )}
    </Typography>
  );
}

// Sub-box wrapper (schedule / time / script frames)
const boxSx = {
  mt: 1.5,
  borderRadius: '8px',
  bgcolor: T.bgCard,
  border: `1px solid ${T.border}`,
} as const;

// Native input base style (dark)
const nativeInputSx = {
  width: '100%',
  height: 40,
  boxSizing: 'border-box' as const,
  bgcolor: T.bg,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  px: 1.5,
  color: T.textPrim,
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  '&:focus': { borderColor: T.primaryMuted },
  '&::-webkit-calendar-picker-indicator': { filter: 'invert(0.7)' },
} as const;

// ----------------------------------------------------------------------

export function AlertFormView({ nodeId, alertId }: Props) {
  const { t } = useTranslate('alert-list');
  const router = useRouter();
  const isEdit = Boolean(alertId);

  // Fetch existing data for edit mode
  const { data: existingData } = useSWR(
    alertId ? endpoints.alert.detail(nodeId, alertId) : null,
    fetcher
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      desc: '',
      interval: 120,
      scriptFileName: '',
      scriptCode: '',
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = methods;

  // Local state
  const [isActive, setIsActive] = useState(true);
  const [selectedDays, setSelectedDays] = useState<boolean[]>([true, true, true, true, true, false, false]);
  const [startTime, setStartTime] = useState('06:30');
  const [endTime, setEndTime] = useState('07:30');
  const [isScriptEditing, setIsScriptEditing] = useState(false);
  const editorRef = useRef<any>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (existingData?.data?.alert) {
      const d = existingData.data.alert;
      const script = existingData.data.script || '';
      // Extract filename from first line of script (e.g. "-- alert_A351SQ.moon")
      const firstLine = script.split('\n')[0] || '';
      const fileMatch = firstLine.match(/^--\s*(.+\.moon)/);
      const fileName = fileMatch ? fileMatch[1] : `${d.name || ''}.moon`;
      reset({
        name: d.name || '',
        desc: d.desc || '',
        interval: d.interval_sec ?? 120,
        scriptFileName: fileName,
        scriptCode: script,
      });
      setIsActive(d.status === 'active');
      if (d.schedule_days) setSelectedDays(parseCronDays(d.schedule_days));
      if (d.start_at != null) setStartTime(normalizeTime(d.start_at));
      if (d.end_at != null) setEndTime(normalizeTime(d.end_at));
    }
  }, [existingData, reset]);

  const cronDays = buildCronDays(selectedDays);

  const toggleDay = (index: number) => {
    setSelectedDays((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const applyPreset = (preset: 'weekdays' | 'weekend' | 'everyday' | 'reset') => {
    switch (preset) {
      case 'weekdays':
        setSelectedDays([true, true, true, true, true, false, false]);
        break;
      case 'weekend':
        setSelectedDays([false, false, false, false, false, true, true]);
        break;
      case 'everyday':
        setSelectedDays([true, true, true, true, true, true, true]);
        break;
      case 'reset':
        setSelectedDays([false, false, false, false, false, false, false]);
        break;
      default:
        break;
    }
  };

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const base = {
          desc: values.desc,
          schedule_days: cronDays,
          start_at: startTime,
          end_at: endTime,
          interval_sec: values.interval,
          status: isActive ? 'active' : 'inactive',
        };

        if (isEdit && alertId) {
          await axiosInstance.put(endpoints.alert.update(nodeId, alertId), base);
        } else {
          await axiosInstance.post(endpoints.alert.add(nodeId), { name: values.name, ...base });
        }
        toast.success(isEdit ? t('form.toast_updated') : t('form.toast_created'));
        router.push(paths.dashboard.nodes.alertsList(nodeId));
      } catch (err) {
        toast.error(t('form.toast_error'));
      }
    },
    [startTime, endTime, isActive, cronDays, isEdit, alertId, nodeId, router, t]
  );

  const goList = () => router.push(paths.dashboard.nodes.alertsList(nodeId));

  return (
    <PageShell
      node={nodeId}
      crumbs={[
        { label: t('top.title'), onClick: goList },
        { label: t('form.title_add_breadcrump') },
      ]}
      title={t('form.title_setup')}
    >
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            maxWidth: 1000,
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden',
            bgcolor: T.bgPanel,
            border: `1px solid ${T.border}`,
          }}
        >
          {/* ── Header bar ── */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2.5,
              py: 1.5,
              bgcolor: T.bgHover,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <Typography sx={{ color: T.textPrim, fontSize: 18, fontWeight: 500 }}>
              {isEdit ? t('form.title_edit') : t('form.title_add')}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              <Switch
                checked={isActive}
                onChange={(_, checked) => setIsActive(checked)}
                sx={{
                  '& .MuiSwitch-switchBase': { color: '#fff' },
                  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                    backgroundColor: T.border,
                    opacity: 1,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: T.primary,
                    opacity: 1,
                  },
                }}
              />
              <Typography sx={{ color: isActive ? ACCENT2 : T.textDim, fontSize: 15, fontWeight: 500 }}>
                {isActive ? t('form.running') : t('form.status_stopped')}
              </Typography>
            </Stack>
          </Stack>

          {/* ── Body ── */}
          <Stack sx={{ p: 2.5, gap: 3.5 }}>
            {/* ── Name ── */}
            <Box>
              <FieldLabel required>{t('form.name')}</FieldLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Box component="input" {...field} sx={{ ...nativeInputSx, mt: 1.5 }} />
                )}
              />
            </Box>

            {/* ── Description ── */}
            <Box>
              <FieldLabel>{t('form.desc')}</FieldLabel>
              <Controller
                name="desc"
                control={control}
                render={({ field }) => (
                  <Box
                    component="textarea"
                    {...field}
                    rows={4}
                    sx={{
                      ...nativeInputSx,
                      mt: 1.5,
                      height: 'auto',
                      py: 1.25,
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                )}
              />
            </Box>

            {/* ── Operation Schedule ── */}
            <Box>
              <FieldLabel required>{t('form.schedule')}</FieldLabel>

              <Box sx={{ ...boxSx, p: 2 }}>
                <Typography sx={{ color: T.textDim, fontSize: 14, mb: 2 }}>
                  {t('form.schedule_help')}
                </Typography>

                {/* Day buttons + crontab preview */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                    {DAY_KEYS.map((key, idx) => {
                      const selected = selectedDays[idx];
                      return (
                        <Box
                          key={key}
                          onClick={() => toggleDay(idx)}
                          sx={{
                            px: 1.75,
                            py: 0.75,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: 15,
                            userSelect: 'none',
                            bgcolor: selected ? '#5344FF22' : T.bg,
                            border: `1px solid ${selected ? T.primaryMuted : T.border}`,
                            color: selected ? T.primaryMuted : T.textDim,
                            '&:hover': { borderColor: selected ? T.primaryMuted : T.textDim },
                          }}
                        >
                          {t(`form.days.${key}`)}
                        </Box>
                      );
                    })}
                  </Stack>

                  {/* Crontab preview chip */}
                  {cronDays && (
                    <Box
                      sx={{
                        px: 1.75,
                        py: 0.75,
                        borderRadius: '6px',
                        bgcolor: '#4A3BFF22',
                        border: `1px solid ${T.primaryMuted}`,
                        color: T.primaryMuted,
                        fontSize: 15,
                        fontFamily: FONT_MONO,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cronDays}
                    </Box>
                  )}
                </Stack>

                {/* Preset chips */}
                <Stack direction="row" gap={1}>
                  {(['weekdays', 'weekend', 'everyday'] as const).map((preset) => (
                    <Box
                      key={preset}
                      onClick={() => applyPreset(preset)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#fff',
                        bgcolor: T.primary,
                        '&:hover': { bgcolor: T.primaryHov },
                      }}
                    >
                      {t(`form.presets.${preset}`)}
                    </Box>
                  ))}
                  <Box
                    onClick={() => applyPreset('reset')}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: T.textSec,
                      bgcolor: T.bg,
                      border: `1px solid ${T.border}`,
                      '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
                    }}
                  >
                    {t('form.presets.reset')}
                  </Box>
                </Stack>
              </Box>

              {/* Crontab helper note */}
              <Box sx={{ ...boxSx, p: 1.5 }}>
                <Typography component="span" sx={{ color: T.textDim, fontSize: 14 }}>
                  {t('form.schedule_cron_help')}{' '}
                  <Box component="span" sx={{ color: T.primaryMuted, fontFamily: FONT_MONO }}>
                    1 - 5
                  </Box>{' '}
                  {t('form.schedule_cron_help2')}{' '}
                  <Box component="span" sx={{ color: T.primaryMuted, fontFamily: FONT_MONO }}>
                    1,3,5
                  </Box>
                </Typography>
              </Box>
            </Box>

            {/* ── Time Range ── */}
            <Box>
              <FieldLabel required>{t('form.timezone')}</FieldLabel>

              <Box sx={{ ...boxSx, p: 2 }}>
                <Stack direction="row" alignItems="flex-end" gap={2} flexWrap="wrap">
                  {/* Start Time */}
                  <Stack sx={{ width: 160 }} gap={0.75}>
                    <Typography sx={{ color: T.textDim, fontSize: 13 }}>{t('form.start_time')}</Typography>
                    <Box
                      component="input"
                      type="time"
                      value={startTime}
                      onChange={(e: any) => setStartTime(e.target.value)}
                      sx={nativeInputSx}
                    />
                  </Stack>

                  <Typography sx={{ color: T.textDim, fontSize: 18, pb: 1 }}>—</Typography>

                  {/* End Time */}
                  <Stack sx={{ width: 160 }} gap={0.75}>
                    <Typography sx={{ color: T.textDim, fontSize: 13 }}>{t('form.end_time')}</Typography>
                    <Box
                      component="input"
                      type="time"
                      value={endTime}
                      onChange={(e: any) => setEndTime(e.target.value)}
                      sx={nativeInputSx}
                    />
                  </Stack>

                  <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: T.border, mx: 1 }} />

                  {/* Interval */}
                  <Stack sx={{ width: 240 }} gap={0.75}>
                    <Typography sx={{ color: T.textDim, fontSize: 13 }}>{t('form.interval_sec')}</Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Controller
                        name="interval"
                        control={control}
                        render={({ field }) => (
                          <Box
                            component="input"
                            type="number"
                            {...field}
                            onChange={(e: any) => field.onChange(Number(e.target.value))}
                            sx={{ ...nativeInputSx, flex: 1 }}
                          />
                        )}
                      />
                      <Typography sx={{ color: T.textDim, fontSize: 14, whiteSpace: 'nowrap' }}>
                        {t('form.interval_suffix')}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Time presets */}
                <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                  {([
                    { key: 'time_all_day', start: '00:00', end: '23:59' },
                    { key: 'time_regular_session', start: '08:00', end: '20:00' },
                  ] as const).map((preset) => (
                    <Box
                      key={preset.key}
                      onClick={() => {
                        setStartTime(preset.start);
                        setEndTime(preset.end);
                      }}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: T.textSec,
                        bgcolor: T.bg,
                        border: `1px solid ${T.border}`,
                        '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
                      }}
                    >
                      {t(`form.${preset.key}`)}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* ── Script ── */}
            <Box>
              <FieldLabel required>{t('form.script')}</FieldLabel>

              <Box sx={{ ...boxSx, overflow: 'hidden' }}>
                {/* Script header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                  sx={{ px: 2, py: 1.25, borderBottom: `1px solid ${T.border}`, bgcolor: T.bgHover }}
                >
                  {/* Filename input with green dot */}
                  <Controller
                    name="scriptFileName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: T.on, flexShrink: 0 }} />
                        <Box
                          component="input"
                          {...field}
                          placeholder="script_name.moon"
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            bgcolor: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: T.textPrim,
                            fontSize: 15,
                            fontFamily: FONT_MONO,
                          }}
                        />
                      </Stack>
                    )}
                  />

                  {/* View / Edit toggle */}
                  <ToggleBtn active={!isScriptEditing} onClick={() => setIsScriptEditing(false)}>
                    {t('form.script_view')}
                  </ToggleBtn>
                  <ToggleBtn active={isScriptEditing} onClick={() => setIsScriptEditing(true)}>
                    {t('form.script_edit')}
                  </ToggleBtn>
                </Stack>

                {/* Editor / viewer */}
                <Controller
                  name="scriptCode"
                  control={control}
                  render={({ field }) =>
                    isScriptEditing ? (
                      <Box sx={{ height: 320, bgcolor: T.bgCard }}>
                        <MonacoEditor
                          height="100%"
                          language="lua"
                          theme="watch-dark"
                          value={field.value}
                          onChange={(v) => field.onChange(v || '')}
                          beforeMount={(monaco) => {
                            monaco.editor.defineTheme('watch-dark', {
                              base: 'vs-dark',
                              inherit: true,
                              rules: [],
                              colors: {
                                'editor.background': '#00000000',
                                'editorStickyScroll.background': '#25212E',
                                'editorStickyScrollHover.background': '#2E2A3A',
                              },
                            });
                          }}
                          onMount={(ed, monaco) => {
                            editorRef.current = ed;
                            monaco.editor.setTheme('watch-dark');
                          }}
                          options={{
                            minimap: { enabled: false },
                            lineNumbers: 'off',
                            glyphMargin: false,
                            folding: false,
                            lineDecorationsWidth: 16,
                            lineNumbersMinChars: 0,
                            guides: { indentation: false, bracketPairs: false },
                            renderLineHighlight: 'none',
                            fontSize: 15,
                            fontFamily: FONT_MONO,
                            lineHeight: 24,
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: 'on',
                            scrollbar: {
                              verticalScrollbarSize: 8,
                              horizontalScrollbarSize: 8,
                            },
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ p: 1.75 }}>
                        <CodeBlock theme="moon" minHeight={288}>
                          {field.value || ''}
                        </CodeBlock>
                      </Box>
                    )
                  }
                />
              </Box>
            </Box>
          </Stack>

          {/* ── Footer ── */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            gap={1.25}
            sx={{ px: 2.5, py: 2, borderTop: `1px solid ${T.border}` }}
          >
            <BtnGhost onClick={goList}>{t('form.btn_cancel')}</BtnGhost>
            <BtnPrimary icon="eva:checkmark-fill" type="submit" disabled={isSubmitting}>
              {t('form.btn_save')}
            </BtnPrimary>
          </Stack>
        </Box>
      </FormProvider>
    </PageShell>
  );
}

// ----------------------------------------------------------------------

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        px: 1.75,
        height: 28,
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'inherit',
        color: active ? '#fff' : T.textSec,
        bgcolor: active ? T.primary : T.bg,
        border: `1px solid ${active ? T.primary : T.border}`,
        '&:hover': { bgcolor: active ? T.primaryHov : T.bgHover },
      }}
    >
      {children}
    </Box>
  );
}
