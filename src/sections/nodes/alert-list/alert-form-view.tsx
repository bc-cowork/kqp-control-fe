'use client';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

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
      parts.push(start === prev ? String(start) : `${start} - ${prev}`);
      start = cur;
      prev = cur;
    }
  }
  return parts.join(', ');
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
        const payload = {
          name: values.name,
          desc: values.desc,
          start_at: startTime,
          end_at: endTime,
          interval_sec: values.interval,
          status: isActive ? 'OK' : 'STOPPED',
          file: values.scriptFileName,
          alert_def: { code: values.scriptCode },
          schedule_days: cronDays,
        };

        if (isEdit && alertId) {
          await axiosInstance.put(endpoints.alert.update(nodeId, alertId), payload);
        } else {
          await axiosInstance.post(endpoints.alert.add(nodeId), payload);
        }
        toast.success(isEdit ? 'Alert updated' : 'Alert created');
        router.push(paths.dashboard.nodes.alertsList(nodeId));
      } catch (error) {
        toast.error('Failed to save alert');
      }
    },
    [startTime, endTime, isActive, cronDays, isEdit, alertId, nodeId, router]
  );

  // Shared input styles
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: (theme: any) => (theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF'),
      borderRadius: '8px',
      '& fieldset': {
        borderColor: (theme: any) => (theme.palette.mode === 'dark' ? '#4E576A' : grey[300]),
      },
      '&:hover fieldset': {
        borderColor: (theme: any) => (theme.palette.mode === 'dark' ? '#667085' : grey[400]),
      },
    },
    '& .MuiOutlinedInput-input': {
      color: (theme: any) => (theme.palette.mode === 'dark' ? '#D1D6E0' : '#373F4E'),
      fontSize: 17,
      fontWeight: 400,
      lineHeight: '25.5px',
      '&::-webkit-calendar-picker-indicator': {
        filter: (theme: any) => (theme.palette.mode === 'dark' ? 'invert(0.7)' : 'none'),
      },
    },
  };

  const labelSx = {
    color: (theme: any) => (theme.palette.mode === 'dark' ? '#AFB7C8' : grey[600]),
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '22.4px',
  };

  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={nodeId}
        pages={[
          { pageName: t('top.title'), link: paths.dashboard.nodes.alertsList(nodeId) },
          { pageName: t('form.title_add_breadcrump') },
        ]}
      />

      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 600,
          color: (theme) => (theme.palette.mode === 'dark' ? grey[50] : '#373F4E'),
          mt: 2,
        }}
      >
        {t('form.page_title')}
      </Typography>

      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            mt: 3,
            borderRadius: '12px',
            overflow: 'hidden',
            fontFamily: 'Pretendard',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF'),
            '& .MuiTypography-root': { fontFamily: 'Pretendard' },
            '& .MuiOutlinedInput-input': { fontFamily: 'Pretendard' },
            '& .MuiInput-input': { fontFamily: 'Pretendard' },
            '& .MuiButton-root': { fontFamily: 'Pretendard' },
          }}
        >
          {/* ── Header ── */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#4E576A' : grey[200]),
              borderBottom: (theme) =>
                `1px solid ${theme.palette.mode === 'dark' ? '#4E576A' : grey[300]}`,
            }}
          >
            <Typography
              sx={{
                color: (theme) => (theme.palette.mode === 'dark' ? '#AFB7C8' : grey[600]),
                fontSize: 22,
                fontWeight: 500,
                lineHeight: '26.4px',
              }}
            >
              {isEdit ? t('form.title_edit') : t('form.title_add')}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
              <Switch
                checked={isActive}
                onChange={(_, checked) => setIsActive(checked)}
                sx={{
                  '& .MuiSwitch-switchBase': { color: '#AFB7C8' },
                  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                    bgcolor: '#373F4E',
                    opacity: 1,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#5E66FF',
                    opacity: 1,
                  },
                }}
              />
              <Typography
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#6B89FF' : '#5E66FF',
                  fontSize: 17,
                  fontWeight: 500,
                  lineHeight: '25.5px',
                }}
              >
                {isActive ? t('form.status_active') : t('form.status_stopped')}
              </Typography>
            </Stack>
          </Stack>

          {/* ── Form Body ── */}
          <Stack
            sx={{
              background: (theme) =>
                theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              gap: '40px',
              pb: 0,
            }}
          >
            {/* ── Item Name ── */}
            <Box sx={{ px: 2, pt: 2 }}>
              <Typography sx={labelSx}>
                {t('form.name')}{' '}
                <Typography component="span" sx={{ color: '#F87171', fontSize: 16, fontWeight: 600 }}>
                  *
                </Typography>
              </Typography>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} fullWidth size="small" sx={{ mt: 1.5, ...inputSx }} />
                )}
              />
            </Box>

            {/* ── Description ── */}
            <Box sx={{ px: 2 }}>
              <Typography sx={{
                ...labelSx,
                color: '#4E576A'
              }}>{t('form.desc')}</Typography>
              <Controller
                name="desc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    sx={{
                      mt: 1.5,
                      ...inputSx,
                      '& .MuiOutlinedInput-root': {
                        ...inputSx['& .MuiOutlinedInput-root'],
                        borderRadius: '12px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* ── Operation Schedule ── */}
            <Box sx={{ px: 2 }}>
              <Typography sx={labelSx}>
                {t('form.schedule')}{' '}
                <Typography component="span" sx={{ color: '#F87171', fontSize: 16, fontWeight: 600 }}>
                  *
                </Typography>
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  p: 2,
                  borderRadius: '12px',
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark' ? '#4E576A' : grey[300]}`,
                }}
              >
                {/* Help text */}
                <Typography
                  sx={{
                    color: (theme) => (theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500]),
                    fontSize: 15,
                    py: 0.5,
                    mb: 1.5,
                  }}
                >
                  {t('form.schedule_help')}
                </Typography>

                {/* Day buttons + crontab badge */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ pb: 2 }}
                >
                  <Stack direction="row" gap={1}>
                    {DAY_KEYS.map((key, idx) => {
                      const selected = selectedDays[idx];
                      return (
                        <Box
                          key={key}
                          onClick={() => toggleDay(idx)}
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            bgcolor: (theme) =>
                              selected
                                ? '#212447'
                                : theme.palette.mode === 'dark'
                                  ? '#202838'
                                  : '#FFFFFF',
                            border: (theme) =>
                              `1px solid ${selected
                                ? '#24306D'
                                : theme.palette.mode === 'dark'
                                  ? '#373F4E'
                                  : grey[300]
                              }`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 17,
                              fontWeight: 400,
                              lineHeight: '25.5px',
                              color: selected
                                ? '#FFFFFF'
                                : (theme) =>
                                  theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500],
                            }}
                          >
                            {t(`form.days.${key}`)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>

                  {/* Crontab badge */}
                  {cronDays && (
                    <Box
                      sx={{
                        px: 1.85,
                        py: 0.85,
                        borderRadius: '8px',
                        bgcolor: '#212447',
                        border: '1px solid #6B89FF',
                      }}
                    >
                      <Typography
                        sx={{ color: '#6B89FF', fontSize: 17, fontWeight: 400, lineHeight: '25.5px' }}
                      >
                        {cronDays}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Preset chips */}
                <Stack direction="row" gap={1}>
                  {(['weekdays', 'weekend', 'everyday', 'reset'] as const).map((preset) => (
                    <Box
                      key={preset}
                      onClick={() => applyPreset(preset)}
                      sx={{
                        px: 1.75,
                        py: 0.625,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF',
                        border: (theme) =>
                          `1px solid ${theme.palette.mode === 'dark' ? '#373F4E' : grey[300]}`,
                      }}
                    >
                      <Typography
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500],
                          fontSize: 12,
                          fontWeight: 400,
                          lineHeight: '16.8px',
                        }}
                      >
                        {t(`form.presets.${preset}`)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Crontab info box */}
              <Box
                sx={{
                  mt: 1.5,
                  p: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF'),
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark' ? '#4E576A' : grey[300]}`,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: (theme) => (theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500]),
                    fontSize: 15,
                    lineHeight: '22.5px',
                  }}
                >
                  {t('form.schedule_cron_help')}{' '}
                  <Typography
                    component="span"
                    sx={{ color: '#5E66FF', fontSize: 15, lineHeight: '22.5px' }}
                  >
                    1 - 5
                  </Typography>{' '}
                  {t('form.schedule_cron_help2')}{' '}
                  <Typography
                    component="span"
                    sx={{ color: '#5E66FF', fontSize: 15, lineHeight: '22.5px' }}
                  >
                    1,3,5
                  </Typography>
                </Typography>
              </Box>
            </Box>

            {/* ── Operation Time Zone ── */}
            <Box sx={{ px: 2 }}>
              <Typography sx={labelSx}>
                {t('form.timezone')}{' '}
                <Typography component="span" sx={{ color: '#F87171', fontSize: 16, fontWeight: 600 }}>
                  *
                </Typography>
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark' ? '#4E576A' : grey[300]}`,
                }}
              >
                <Stack direction="row" alignItems="flex-end" gap={2} sx={{ px: 1, py: 2 }}>
                  {/* Start Time */}
                  <Stack sx={{ width: 160 }} gap={0.5}>
                    <Typography
                      sx={{
                        color: (theme) => (theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500]),
                        fontSize: 13,
                        lineHeight: '19.5px',
                      }}
                    >
                      {t('form.start_time')}
                    </Typography>
                    <TextField
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      size="small"
                      sx={{
                        ...inputSx,
                        '& .MuiOutlinedInput-root': {
                          ...inputSx['& .MuiOutlinedInput-root'],
                          bgcolor: (theme: any) =>
                            theme.palette.mode === 'dark' ? '#161C25' : grey[50],
                        },
                      }}
                      inputProps={{ step: 60 }}
                    />
                  </Stack>

                  {/* Separator */}
                  <Typography
                    sx={{
                      color: (theme) => (theme.palette.mode === 'dark' ? '#4E576A' : grey[400]),
                      fontSize: 20,
                      pb: 0.5,
                    }}
                  >
                    —
                  </Typography>

                  {/* End Time */}
                  <Stack sx={{ width: 160 }} gap={0.5}>
                    <Typography
                      sx={{
                        color: (theme) => (theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500]),
                        fontSize: 13,
                        lineHeight: '19.5px',
                      }}
                    >
                      {t('form.end_time')}
                    </Typography>
                    <TextField
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      size="small"
                      sx={{
                        ...inputSx,
                        '& .MuiOutlinedInput-root': {
                          ...inputSx['& .MuiOutlinedInput-root'],
                          bgcolor: (theme: any) =>
                            theme.palette.mode === 'dark' ? '#161C25' : grey[50],
                        },
                      }}
                      inputProps={{ step: 60 }}
                    />
                  </Stack>

                  {/* Vertical divider */}
                  <Box
                    sx={{
                      minWidth: 2,
                      maxWidth: 1,
                      height: 56,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '#373F4E' : grey[300],
                    }}
                  />

                  {/* Interval */}
                  <Stack sx={{ width: 225 }} gap={0.5}>
                    <Typography
                      sx={{
                        color: (theme) => (theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500]),
                        fontSize: 13,
                        lineHeight: '19.5px',
                      }}
                    >
                      {t('form.interval_sec')}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Controller
                        name="interval"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            size="small"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            sx={{
                              flex: 1,
                              ...inputSx,
                              '& .MuiOutlinedInput-root': {
                                ...inputSx['& .MuiOutlinedInput-root'],
                                bgcolor: (theme: any) =>
                                  theme.palette.mode === 'dark' ? '#161C25' : grey[50],
                              },
                            }}
                          />
                        )}
                      />
                      <Typography
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === 'dark' ? '#667085' : grey[500],
                          fontSize: 15,
                          lineHeight: '22.5px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('form.interval_suffix')}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* ── Running Script ── */}
            <Box sx={{ px: 2 }}>
              <Typography sx={labelSx}>
                {t('form.script')}{' '}
                <Typography component="span" sx={{ color: '#F87171', fontSize: 16, fontWeight: 600 }}>
                  *
                </Typography>
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark' ? '#4E576A' : grey[300]}`,
                }}
              >
                {/* Script header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    px: 2,
                    py: 1,
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.mode === 'dark' ? '#4E576A' : grey[300]}`,
                  }}
                >
                  {/* File name */}
                  <Controller
                    name="scriptFileName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        sx={{
                          flex: 1,
                          px: 2,
                          py: 1.5,
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF',
                          borderRadius: '8px',
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#4FCB53',
                            flexShrink: 0,
                          }}
                        />
                        <TextField
                          {...field}
                          variant="standard"
                          placeholder="script_name.moon"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            '& .MuiInput-input': {
                              color: (theme: any) =>
                                theme.palette.mode === 'dark' ? '#D1D6E0' : '#373F4E',
                              fontSize: 17,
                              fontWeight: 400,
                              lineHeight: '25.5px',
                              p: 0,
                            },
                          }}
                        />
                      </Stack>
                    )}
                  />

                  {/* View / Edit buttons */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsScriptEditing(false)}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: 15,
                      fontWeight: 400,
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? '#D1D6E0' : '#373F4E',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#373F4E' : grey[300],
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF',
                      '&:hover': {
                        borderColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#667085' : grey[400],
                      },
                    }}
                  >
                    {t('form.script_view')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsScriptEditing(true)}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: 15,
                      fontWeight: 400,
                      color: isScriptEditing ? '#FFFFFF' : (theme) =>
                        theme.palette.mode === 'dark' ? '#D1D6E0' : '#373F4E',
                      borderColor: isScriptEditing ? '#5E66FF' : (theme) =>
                        theme.palette.mode === 'dark' ? '#373F4E' : grey[300],
                      bgcolor: isScriptEditing ? '#5E66FF' : (theme) =>
                        theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF',
                      '&:hover': {
                        borderColor: isScriptEditing ? '#4A3BFF' : (theme) =>
                          theme.palette.mode === 'dark' ? '#667085' : grey[400],
                        bgcolor: isScriptEditing ? '#4A3BFF' : undefined,
                      },
                    }}
                  >
                    {t('form.script_edit')}
                  </Button>
                </Stack>

                {/* Monaco editor */}
                <Controller
                  name="scriptCode"
                  control={control}
                  render={({ field }) => (
                    <Box
                      sx={{
                        height: 300,
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? isScriptEditing ? '#161C25' : 'transparent'
                            : '#FFFFFF',
                      }}
                    >
                      <MonacoEditor
                        height="100%"
                        language="lua"
                        theme="alert-transparent"
                        value={field.value}
                        onChange={(v) => field.onChange(v || '')}
                        beforeMount={(monaco) => {
                          monaco.editor.defineTheme('alert-transparent', {
                            base: 'vs-dark',
                            inherit: true,
                            rules: [],
                            colors: {
                              'editor.background': '#00000000',
                              'editorStickyScroll.background': '#202838',
                              'editorStickyScrollHover.background': '#2A3142',
                            },
                          });
                        }}
                        onMount={(ed) => {
                          editorRef.current = ed;
                        }}
                        options={{
                          readOnly: !isScriptEditing,
                          minimap: { enabled: false },
                          lineNumbers: 'off',
                          glyphMargin: false,
                          folding: false,
                          lineDecorationsWidth: 0,
                          lineNumbersMinChars: 0,
                          guides: { indentation: false, bracketPairs: false },
                          renderLineHighlight: 'none',
                          fontSize: 17,
                          fontFamily: 'Pretendard, Roboto, monospace',
                          lineHeight: 25.5,
                          padding: { top: 16 },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                          wordWrap: 'on',
                          scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                            verticalSliderSize: 8,
                            horizontalSliderSize: 8,
                          },
                        }}
                      />
                    </Box>
                  )}
                />
              </Box>
            </Box>

            {/* ── Footer ── */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              gap={1.5}
              sx={{
                pt: 2,
                pb: 3,
                px: 2,
                borderTop: (theme) =>
                  `1px solid ${theme.palette.mode === 'dark' ? '#373F4E' : grey[300]}`,
              }}
            >
              <Button
                onClick={() => router.push(paths.dashboard.nodes.alertsList(nodeId))}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  color: (theme) => (theme.palette.mode === 'dark' ? '#D1D6E0' : '#373F4E'),
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF'),
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark' ? '#4E576A' : grey[300]}`,
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? '#2A3142' : grey[100],
                  },
                }}
              >
                {t('form.btn_cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#FFFFFF',
                  bgcolor: '#4A3BFF',
                  '&:hover': { bgcolor: '#3D32D9' },
                  '&:disabled': { bgcolor: '#4A3BFF', opacity: 0.6 },
                }}
              >
                {t('form.btn_save')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </FormProvider>
    </DashboardContent>
  );
}
