'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  params: {
    node: string;
    'alert-list': string;
  };
};

// Table column headers matching the design
const TABLE_COLUMNS: { key: string; width?: number; flex?: number }[] = [
  { key: 'alert_name', width: 408 },
  { key: 'schedule', width: 408 },
  { key: 'start_at', flex: 1 },
  { key: 'end_at', flex: 1 },
  { key: 'interval', flex: 1 },
  { key: 'status', flex: 1 },
];

// ----------------------------------------------------------------------

export default function Page({ params }: Props) {
  const { node, 'alert-list': alertId } = params;
  const { t } = useTranslate('alert-list');
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const decodedAlertId = decodeURIComponent(alertId);

  const { data, isLoading, error } = useSWR(
    endpoints.alert.detail(node, decodedAlertId),
    fetcher
  );

  const detail = data?.data?.alert;
  const alertCode = data?.data?.script || '';
  const isActive = detail?.status === 'active';

  // Extract filename from first line of script (e.g. "-- alert_A351SQ.moon")
  const scriptFileName = (() => {
    const firstLine = alertCode.split('\n')[0] || '';
    const match = firstLine.match(/^--\s*(.+\.moon)/);
    return match ? match[1] : `${detail?.name || 'script'}.moon`;
  })();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.nodes.alertsEdit(node, decodedAlertId));
  }, [router, node, decodedAlertId]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm(t('detail.delete_confirm'))) return;
    try {
      await axiosInstance.delete(endpoints.alert.delete(node, decodedAlertId));
      toast.success(t('detail.delete_success'));
      router.push(paths.dashboard.nodes.alertsList(node));
    } catch {
      toast.error(t('detail.delete_error'));
    }
  }, [t, node, decodedAlertId, router]);

  // Build schedule display string from detail data
  const scheduleText = detail?.schedule_days || '';

  // Shared text color for data cells
  const cellTextColor = isDark ? '#D1D6E0' : '#373F4E';

  // Detail info rows
  const infoRows = detail
    ? [
      { label: t('detail.item_name'), value: detail.name },
      { label: t('detail.desc'), value: detail.desc, multiline: true },
      {
        label: t('detail.schedule'),
        value: scheduleText
          ? `${scheduleText} — ${t('detail.crontab')}: ${scheduleText}`
          : '-',
      },
      {
        label: t('detail.timezone'),
        value: `${detail.start_at || '-'} ~ ${detail.end_at || '-'}, ${detail.interval_sec ?? '-'} ${t('form.interval_suffix')}`,
      },
      {
        label: t('detail.status'),
        value: isActive ? `Active (${t('detail.active')})` : `Inactive (${t('detail.stopped')})`,
        isStatus: true,
      },
      { label: t('detail.script_file'), value: scriptFileName },
    ]
    : [];

  if (isLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Breadcrumb
          node={node}
          pages={[
            { pageName: t('top.title'), link: paths.dashboard.nodes.alertsList(node) },
            { pageName: decodedAlertId },
          ]}
        />
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 8 }}>
          <CircularProgress />
        </Stack>
      </DashboardContent>
    );
  }

  if (error || !detail) {
    return (
      <DashboardContent maxWidth="xl">
        <Breadcrumb
          node={node}
          pages={[
            { pageName: t('top.title'), link: paths.dashboard.nodes.alertsList(node) },
            { pageName: decodedAlertId },
          ]}
        />
        <Typography sx={{ mt: 4, color: '#667085' }}>
          {error ? t('detail.error') : t('detail.empty')}
        </Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={node}
        pages={[
          { pageName: t('top.title'), link: paths.dashboard.nodes.alertsList(node) },
          {
            pageName: `${t('top.title_prefix')}: ${decodedAlertId}`,
            link: paths.dashboard.nodes.alertsDetail(node, decodedAlertId),
          },
        ]}
      />

      {/* ── Title + Status Badge ── */}
      <Stack direction="row" alignItems="center" gap={2} sx={{ mt: 2 }}>
        <Typography
          sx={{
            color: isDark ? '#F0F1F5' : '#373F4E',
            fontSize: 28,
            fontWeight: 600,
            lineHeight: '33.6px',
          }}
        >
          {t('top.title_prefix')}: {decodedAlertId}
        </Typography>
        <Box
          sx={{
            px: 1,
            pr: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: isActive
              ? (isDark ? '#1D2F20' : '#E8F5E9')
              : (isDark ? '#2F1D1D' : '#FDE8E8'),
            borderRadius: '100px',
            outline: `1px solid ${isActive
              ? (isDark ? '#36573C' : '#A5D6A7')
              : (isDark ? '#573C3C' : '#F5A5A5')}`,
            outlineOffset: '-1px',
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isActive ? '#4FCB53' : '#FF5B5B',
              }}
            />
          </Box>
          <Typography
            sx={{
              color: isActive ? (isDark ? '#7EE081' : '#2E7D32') : '#FF5B5B',
              fontSize: 15,
              fontWeight: 400,
              lineHeight: '22.5px',
            }}
          >
            {isActive ? 'active' : 'inactive'}
          </Typography>
        </Box>
      </Stack>

      {/* ── Summary Table ── */}
      <Box
        sx={{
          mt: 3.5,
          borderRadius: '8px',
          overflow: 'hidden',
          border: `1px solid ${isDark ? '#2A3142' : '#D1D6E0'}`,
        }}
      >
        {/* Header row */}
        <Stack direction="row" sx={{ bgcolor: isDark ? '#667085' : '#1D2654' }}>
          {TABLE_COLUMNS.map((col) => (
            <Box
              key={col.key}
              sx={{
                width: col.width ?? undefined,
                flex: col.flex ?? undefined,
                minWidth: 116,
                px: 1.5,
                py: 1,
              }}
            >
              <Typography
                sx={{ color: '#F0F1F5', fontSize: 17, fontWeight: 400, lineHeight: '25.5px' }}
              >
                {t(`table.${col.key}`)}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Data row */}
        <Stack direction="row" sx={{ bgcolor: isDark ? '#202838' : '#FFFFFF' }}>
          {/* Alert Name */}
          <Box sx={{ width: 408, minWidth: 116, px: 1.5, py: 1 }}>
            <Typography
              sx={{ color: cellTextColor, fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}
            >
              {detail.name}
            </Typography>
          </Box>
          {/* Schedule */}
          <Box sx={{ width: 408, minWidth: 116, px: 1.5, py: 1 }}>
            <Typography
              sx={{ color: cellTextColor, fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}
            >
              {scheduleText || '-'}
            </Typography>
          </Box>
          {/* Start At */}
          <Box sx={{ flex: 1, minWidth: 116, px: 1.5, py: 1 }}>
            <Typography
              sx={{ color: cellTextColor, fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}
            >
              {detail.start_at || '-'}
            </Typography>
          </Box>
          {/* End At */}
          <Box sx={{ flex: 1, minWidth: 116, px: 1.5, py: 1 }}>
            <Typography
              sx={{ color: cellTextColor, fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}
            >
              {detail.end_at || '-'}
            </Typography>
          </Box>
          {/* Interval */}
          <Box sx={{ flex: 1, minWidth: 116, px: 1.5, py: 1 }}>
            <Typography
              sx={{ color: cellTextColor, fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}
            >
              {detail.interval_sec ?? '-'}
            </Typography>
          </Box>
          {/* Status */}
          <Box
            sx={{
              flex: 1,
              minWidth: 116,
              px: 1.5,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: isActive ? '#4FCB53' : '#FF5B5B',
                }}
              />
            </Box>
            <Typography
              sx={{
                flex: 1,
                color: isActive ? '#4FCB53' : '#FF5B5B',
                fontSize: 15,
                fontWeight: 400,
                lineHeight: '22.5px',
              }}
            >
              {isActive ? 'active' : 'inactive'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* ── Bottom: Detail Info (left) + Script Viewer (right) ── */}
      <Stack direction="row" gap={3.5} sx={{ mt: 3.5, flex: 1 }}>
        {/* Left column: Detail Info + Edit/Delete buttons */}
        <Stack gap={2.5} sx={{ flexShrink: 0 }}>
          {/* Detail Info Card */}
          <Box
            sx={{
              width: 616,
              bgcolor: isDark ? '#202838' : '#FFFFFF',
              borderRadius: '8px',
              overflow: 'hidden',
              border: `1px solid ${isDark ? '#2A3142' : '#D1D6E0'}`,
            }}
          >
            {/* Card header */}
            <Box sx={{ px: 2, py: 1, bgcolor: isDark ? '#667085' : '#1D2654' }}>
              <Typography
                sx={{
                  color: isDark ? '#E0E4EB' : '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: '22.5px',
                }}
              >
                {t('detail.info_title')}
              </Typography>
            </Box>

            {/* Card body */}
            <Stack sx={{ px: 2.5, py: 2.5, gap: 2 }}>
              {infoRows.map((row) => (
                <Stack key={row.label} direction="row" gap={2}>
                  <Typography
                    sx={{
                      width: 120,
                      flexShrink: 0,
                      color: '#667085',
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: '21px',
                      pt: 0.25,
                    }}
                  >
                    {row.label}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {row.isStatus ? (
                      <Stack direction="row" alignItems="center" gap={0.75}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: isActive ? '#4FCB53' : '#FF5B5B',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            color: isActive ? '#4FCB53' : '#FF5B5B',
                            fontSize: 15,
                            fontWeight: 400,
                            lineHeight: '22.5px',
                          }}
                        >
                          {row.value}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography
                        sx={{
                          color: cellTextColor,
                          fontSize: 15,
                          fontWeight: 400,
                          lineHeight: '22.5px',
                        }}
                      >
                        {row.value || '-'}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Edit / Delete buttons */}
          <Stack direction="row" gap={1}>
            <Box
              onClick={handleEdit}
              sx={{
                px: 1.5,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                bgcolor: isDark ? '#202838' : '#FFFFFF',
                borderRadius: '8px',
                outline: `1px solid ${isDark ? '#373F4E' : grey[300]}`,
                outlineOffset: '-1px',
                '&:hover': { bgcolor: isDark ? '#2A3142' : grey[100] },
              }}
            >
              {/* Pencil icon */}
              <Box
                component="svg"
                viewBox="0 0 16 16"
                sx={{ width: 16, height: 16, flexShrink: 0 }}
              >
                <path
                  d="M11.333 1.333a1.886 1.886 0 0 1 2.667 2.667l-8.667 8.667L2 13.333 2.667 10l8.666-8.667z"
                  fill="none"
                  stroke={isDark ? '#AFB7C8' : grey[500]}
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Box>
              <Typography
                sx={{
                  color: isDark ? '#AFB7C8' : grey[500],
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: '22.5px',
                }}
              >
                {t('detail.btn_edit')}
              </Typography>
            </Box>

            <Box
              onClick={handleDelete}
              sx={{
                px: 2,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                cursor: 'pointer',
                bgcolor: isDark ? '#202838' : '#FFFFFF',
                borderRadius: '8px',
                outline: `1px solid ${isDark ? '#373F4E' : grey[300]}`,
                outlineOffset: '-1px',
                '&:hover': { bgcolor: isDark ? '#2A3142' : grey[100] },
              }}
            >
              <Typography
                sx={{
                  color: '#FF5B5B',
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: '22.5px',
                }}
              >
                {t('detail.btn_delete')}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Right column: Script Viewer */}
        <Box
          sx={{
            flex: 1,
            minWidth: 116,
            bgcolor: isDark ? '#202838' : '#FFFFFF',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            // Light theme frames the (dark) code viewer with a 2px blackish border.
            border: isDark ? '1px solid #2A3142' : '3px solid #1A2030',
          }}
        >
          {/* Script header — light-gray strip (design), like the other detail pages */}
          <Box
            sx={{
              px: 1.5,
              py: 1.5,
              bgcolor: isDark ? '#667085' : '#E0E4EB',
              borderBottom: `1px solid ${isDark ? '#373F4E' : 'transparent'}`,
            }}
          >
            <Typography
              sx={{
                color: isDark ? grey[300] : '#4E576A',
                fontSize: 15,
                fontWeight: 400,
                lineHeight: '22.5px',
              }}
            >
              {t('alert')}
            </Typography>
          </Box>

          {/* Filename subheader — part of the dark code viewer in both themes */}
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: '#1A2030',
              borderBottom: '1px solid #373F4E',
            }}
          >
            <Typography
              sx={{ color: '#667085', fontSize: 13, fontWeight: 400, lineHeight: '19.5px' }}
            >
              -- {scriptFileName}
            </Typography>
          </Box>

          {/* Code body — dark code viewer (a11yDark) in both themes, matching the other detail pages. */}
          <Box sx={{ flex: 1, minHeight: 400, bgcolor: '#202838', overflowY: 'auto' }}>
            <Box
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 15, color: '#AFB7C8', m: 0 }}
            >
              <SyntaxHighlighter
                language="moonscript"
                style={a11yDark}
                customStyle={{
                  background: 'transparent',
                  whiteSpace: 'pre-wrap',
                  padding: '16px',
                  fontSize: 15,
                }}
              >
                {alertCode}
              </SyntaxHighlighter>
            </Box>
          </Box>
        </Box>
      </Stack>
    </DashboardContent>
  );
}
