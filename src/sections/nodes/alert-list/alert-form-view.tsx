'use client';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { BtnGhost, PageShell, CodeBlock, BtnPrimary } from 'src/components/v5';

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

// Schedule presets — boolean[7] over DAY_KEYS
const SCHEDULE_PRESETS: Record<'weekdays' | 'weekend' | 'everyday', boolean[]> = {
  weekdays: [true, true, true, true, true, false, false],
  weekend: [false, false, false, false, false, true, true],
  everyday: [true, true, true, true, true, true, true],
};

// Time presets
const TIME_PRESETS = [
  { key: 'time_all_day', start: '00:00', end: '23:59' },
  { key: 'time_regular_session', start: '09:00', end: '15:30' },
] as const;

/** Ensure time string is in HH:mm format required by the picker */
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

const arraysEqual = (a: boolean[], b: boolean[]) => a.every((v, i) => v === b[i]);

// ----------------------------------------------------------------------

// Field label (fontSize 15 / weight 500 / textSec, dim variant = textDim)
function FieldLabel({
  children,
  required,
  dim,
}: {
  children: React.ReactNode;
  required?: boolean;
  dim?: boolean;
}) {
  return (
    <Typography
      component="div"
      sx={{
        fontSize: 15,
        fontWeight: 500,
        color: dim ? T.textDim : T.textSec,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {children}
      {required && (
        <Box component="span" sx={{ color: T.off, fontWeight: 600 }}>
          *
        </Box>
      )}
    </Typography>
  );
}

// Sub-box wrapper (schedule / time / script frames) — transparent, border only
const boxSx = {
  borderRadius: '8px',
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
} as const;

// Ghost button (days / presets / view-edit toggles) — mirrors reference ghostBtn
function GhostBtn({
  on,
  onClick,
  color,
  children,
}: {
  on?: boolean;
  onClick?: () => void;
  color?: string;
  children: React.ReactNode;
}) {
  const c = color || T.primary;
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        height: 34,
        px: '14px',
        borderRadius: '8px',
        fontSize: 15,
        fontFamily: 'inherit',
        fontWeight: on ? 500 : 400,
        cursor: 'pointer',
        bgcolor: on ? c : T.bgCard,
        border: `1px solid ${on ? c : T.border}`,
        color: on ? '#fff' : T.textSec,
        transition: 'all .12s',
        '&:hover': on ? undefined : { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      {children}
    </Box>
  );
}

// Custom ON/OFF toggle (46x26, knob 20)
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: 46,
        height: 26,
        borderRadius: '13px',
        border: 'none',
        cursor: 'pointer',
        bgcolor: on ? T.primary : T.border,
        position: 'relative',
        transition: 'background .15s',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: '#fff',
          transition: 'left .15s',
        }}
      />
    </Box>
  );
}

// Custom hour/minute picker (replaces native time input)
function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [h, m] = (value || '00:00').split(':');
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const mins = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const colSx = {
    flex: 1,
    maxHeight: 208,
    overflowY: 'auto',
    p: '5px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  } as const;
  const itemSx = (sel: boolean) =>
    ({
      py: '7px',
      textAlign: 'center',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: 15,
      fontFamily: FONT_MONO,
      bgcolor: sel ? T.primary : 'transparent',
      color: sel ? '#fff' : T.textSec,
      '&:hover': sel ? {} : { bgcolor: T.bgHover },
    }) as const;

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((o) => !o)}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          height: 40,
          bgcolor: T.bg,
          border: `1px solid ${open ? T.primary : T.border}`,
          borderRadius: '6px',
          color: T.textPrim,
          fontSize: 15,
          fontFamily: FONT_MONO,
          px: 1.5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          outline: 'none',
        }}
      >
        <span>{value}</span>
        <Iconify icon="mingcute:time-line" width={15} sx={{ color: T.textDim }} />
      </Box>
      {open && (
        <>
          <Box onClick={() => setOpen(false)} sx={{ position: 'fixed', inset: 0, zIndex: 30 }} />
          <Box
            sx={{
              position: 'absolute',
              top: 44,
              left: 0,
              zIndex: 40,
              width: 180,
              display: 'flex',
              bgcolor: T.bgPanel,
              border: `1px solid ${T.border}`,
              borderRadius: '8px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
              overflow: 'hidden',
            }}
          >
            <Box sx={colSx}>
              {hours.map((hh) => (
                <Box key={hh} onClick={() => onChange(`${hh}:${m}`)} sx={itemSx(hh === h)}>
                  {hh}
                </Box>
              ))}
            </Box>
            <Box sx={{ width: '1px', bgcolor: T.border }} />
            <Box sx={colSx}>
              {mins.map((mm) => (
                <Box key={mm} onClick={() => onChange(`${h}:${mm}`)} sx={itemSx(mm === m)}>
                  {mm}
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

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
      interval: 5,
      scriptFileName: '',
      scriptCode: '',
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Local state
  const [isActive, setIsActive] = useState(true);
  const [selectedDays, setSelectedDays] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('15:30');
  const [isScriptEditing, setIsScriptEditing] = useState(true);
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
        interval: d.interval_sec ?? 5,
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
          sx={{ maxWidth: 1000, width: '100%' }}
        >
          <Stack sx={{ gap: 2.75 }}>
            {/* ── Header bar (register + toggle) ── */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                bgcolor: T.bgHover,
                border: `1px solid ${T.border}`,
                borderRadius: '8px',
                px: '18px',
                py: '13px',
              }}
            >
              <Typography sx={{ color: T.textSec, fontSize: 16, fontWeight: 500 }}>
                {isEdit ? t('form.title_edit') : t('form.title_add')}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1.25}>
                <Toggle on={isActive} onClick={() => setIsActive((a) => !a)} />
                <Typography
                  sx={{ color: isActive ? T.accent : T.textDim, fontSize: 15, fontWeight: 500 }}
                >
                  {isActive ? t('form.running') : t('form.status_stopped')}
                </Typography>
              </Stack>
            </Stack>

            {/* ── Name ── */}
            <Box>
              <FieldLabel required>{t('form.name')}</FieldLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Box component="input" {...field} placeholder={t('form.name')} sx={nativeInputSx} />
                )}
              />
            </Box>

            {/* ── Description ── */}
            <Box>
              <FieldLabel dim>{t('form.desc')}</FieldLabel>
              <Controller
                name="desc"
                control={control}
                render={({ field }) => (
                  <Box
                    component="textarea"
                    {...field}
                    rows={3}
                    placeholder={t('form.desc_placeholder')}
                    sx={{
                      ...nativeInputSx,
                      height: 'auto',
                      py: '10px',
                      resize: 'vertical',
                      lineHeight: 1.5,
                    }}
                  />
                )}
              />
            </Box>

            {/* ── Operation Schedule ── */}
            <Box>
              <FieldLabel required>{t('form.schedule')}</FieldLabel>

              <Box sx={{ ...boxSx, p: 2 }}>
                <Typography sx={{ color: T.textDim, fontSize: 14, mb: 1.25, lineHeight: 1.5 }}>
                  {t('form.schedule_help')}
                </Typography>

                {/* Day buttons + crontab preview */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1.5}
                  sx={{ mb: 1.5 }}
                >
                  <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                    {DAY_KEYS.map((key, idx) => (
                      <GhostBtn key={key} on={selectedDays[idx]} onClick={() => toggleDay(idx)}>
                        {t(`form.days.${key}`)}
                      </GhostBtn>
                    ))}
                  </Stack>

                  {/* Crontab preview chip */}
                  {cronDays && (
                    <Box
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: 15,
                        color: T.primaryMuted,
                        bgcolor: `${T.primary}22`,
                        border: `1px solid ${T.primaryMuted}`,
                        borderRadius: '6px',
                        py: '6px',
                        px: 1.5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cronDays}
                    </Box>
                  )}
                </Stack>

                {/* Preset chips */}
                <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                  {(['weekdays', 'weekend', 'everyday'] as const).map((preset) => (
                    <GhostBtn
                      key={preset}
                      color={T.accent}
                      on={arraysEqual(selectedDays, SCHEDULE_PRESETS[preset])}
                      onClick={() => setSelectedDays([...SCHEDULE_PRESETS[preset]])}
                    >
                      {t(`form.presets.${preset}`)}
                    </GhostBtn>
                  ))}
                  <GhostBtn
                    onClick={() =>
                      setSelectedDays([false, false, false, false, false, false, false])
                    }
                  >
                    {t('form.presets.reset')}
                  </GhostBtn>
                </Stack>
              </Box>

              {/* Crontab helper note */}
              <Box sx={{ ...boxSx, px: 2, py: 1.5, mt: 1.25 }}>
                <Typography
                  component="span"
                  sx={{ color: T.textDim, fontSize: 14, lineHeight: 1.6 }}
                >
                  {t('form.schedule_cron_help')}{' '}
                  <Box component="span" sx={{ color: T.accent }}>
                    1 - 5
                  </Box>{' '}
                  {t('form.schedule_cron_help2')}{' '}
                  <Box component="span" sx={{ color: T.accent }}>
                    1,3,5
                  </Box>
                </Typography>
              </Box>
            </Box>

            {/* ── Time Range ── */}
            <Box>
              <FieldLabel required>{t('form.timezone')}</FieldLabel>

              <Box sx={{ ...boxSx, p: 2 }}>
                <Stack direction="row" alignItems="flex-end" gap={2} sx={{ mb: 1.75 }}>
                  {/* Start Time */}
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel dim>{t('form.start_time')}</FieldLabel>
                    <TimePicker value={startTime} onChange={setStartTime} />
                  </Box>

                  <Typography sx={{ color: T.textDim, fontSize: 20, pb: 1 }}>—</Typography>

                  {/* End Time */}
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel dim>{t('form.end_time')}</FieldLabel>
                    <TimePicker value={endTime} onChange={setEndTime} />
                  </Box>

                  {/* Interval */}
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel dim>{t('form.interval_sec')}</FieldLabel>
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
                            sx={{ ...nativeInputSx, flex: 1, fontFamily: FONT_MONO }}
                          />
                        )}
                      />
                      <Typography sx={{ color: T.textSec, fontSize: 14, whiteSpace: 'nowrap' }}>
                        {t('form.interval_suffix')}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Time presets */}
                <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                  {TIME_PRESETS.map((preset) => (
                    <GhostBtn
                      key={preset.key}
                      color={T.accent}
                      on={startTime === preset.start && endTime === preset.end}
                      onClick={() => {
                        setStartTime(preset.start);
                        setEndTime(preset.end);
                      }}
                    >
                      {t(`form.${preset.key}`)}
                    </GhostBtn>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* ── Script ── */}
            <Box>
              <FieldLabel required>{t('form.script')}</FieldLabel>

              <Box sx={{ ...boxSx, p: 2 }}>
                {/* Script header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1.25 }}
                >
                  {/* Filename input with green dot */}
                  <Controller
                    name="scriptFileName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: T.on, flexShrink: 0 }}
                        />
                        <Box
                          component="input"
                          {...field}
                          placeholder={t('form.script_file_placeholder')}
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
                  <Stack direction="row" gap={0.75} sx={{ flexShrink: 0 }}>
                    <GhostBtn on={!isScriptEditing} onClick={() => setIsScriptEditing(false)}>
                      {t('form.script_view')}
                    </GhostBtn>
                    <GhostBtn on={isScriptEditing} onClick={() => setIsScriptEditing(true)}>
                      {t('form.script_edit')}
                    </GhostBtn>
                  </Stack>
                </Stack>

                {/* Editor / viewer */}
                <Controller
                  name="scriptCode"
                  control={control}
                  render={({ field }) =>
                    isScriptEditing ? (
                      <Box
                        sx={{
                          height: 240,
                          bgcolor: '#1e1e1e',
                          border: `1px solid ${T.border}`,
                          borderRadius: '8px',
                          overflow: 'hidden',
                        }}
                      >
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
                      <CodeBlock theme="moon" minHeight={240}>
                        {field.value || ''}
                      </CodeBlock>
                    )
                  }
                />
              </Box>
            </Box>
          </Stack>

          {/* ── Buttons ── */}
          <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1.25} sx={{ mt: 1 }}>
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
