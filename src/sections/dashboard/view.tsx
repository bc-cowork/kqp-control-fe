'use client';

import type { INodeItem } from 'src/types/dashboard';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTabs, useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { T, ACCENT2 } from 'src/theme/tokens';
import { useGetNodes, useGetDiskMetrics } from 'src/actions/dashboard';

import { KIcon } from 'src/components/k-icons';
import { DiskUsage } from 'src/components/dashboard/DiskUsage';
import { NodeList } from 'src/components/dashboard/NodeList';
import { NodeGraphs } from 'src/components/dashboard/NodeGraphs';
import { SegmentedButtonGroup } from 'src/components/dashboard/SegmentedButtonGroup';

// ----------------------------------------------------------------------

const VIEW_TABS = [
  { value: '2x2', label: '2×2' },
  { value: '1x4', label: '1×4' },
];

export function DashboardView() {
  const { t } = useTranslate('dashboard');
  const { nodes, nodesLoading, nodesEmpty, nodesError } = useGetNodes();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(1);
  const viewTabs = useTabs(VIEW_TABS[0].value);
  const [selectedNode, setSelectedNode] = useState<INodeItem | undefined>(undefined);
  const selectedNodeParam = selectedNode?.id || selectedNodeId;

  const totalNodes = nodes?.length || 0;
  const onlineNodes = nodes?.filter((node) => node.online_status)?.length || 0;
  const offlineNodes = totalNodes - onlineNodes;

  const [spinning, setSpinning] = useState(false);
  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    setSpinning(true);
    setTimeout(() => setSpinning(false), 700);
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
      {/* ════ LEFT PANEL ════ */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.25,
          p: '24px 20px 20px 24px',
          overflow: 'hidden',
          animation: 'fadeUp .25s ease both',
        }}
      >
        <Typography sx={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, color: T.textPrim }}>
          {t('top.dashboard')}
        </Typography>

        {/* Summary cards */}
        <Stack direction="row" spacing={1.25} sx={{ mt: '35px' }}>
          <SummaryStat label={t('top.total')} value={totalNodes} />
          <SummaryStat pill="on" value={onlineNodes} />
          <SummaryStat pill="off" value={offlineNodes} />
        </Stack>

        {/* Nodes table */}
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: 17, fontWeight: 500, mb: 1.5, letterSpacing: '-0.01em', color: T.textPrim }}>
            {t('node.node')}
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <NodeList
              selectedNode={selectedNode}
              selectedNodeId={selectedNodeId}
              setSelectedNode={setSelectedNode}
              setSelectedNodeId={setSelectedNodeId}
              nodes={nodes}
              nodesLoading={nodesLoading}
              nodesEmpty={nodesEmpty}
              nodesError={nodesError}
            />
          </Box>
        </Box>
      </Box>

      {/* ════ RIGHT PANEL (Info) ════ */}
      <Box
        sx={{
          width: 460,
          flexShrink: 0,
          bgcolor: T.bgPanel,
          borderLeft: `1px solid ${T.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeUp .3s ease both',
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: '14px 16px', borderBottom: `1px solid ${T.border}` }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.02em', color: T.textPrim }}>
              {t('info.info')}
            </Typography>
            <Box
              component="button"
              onClick={handleRefresh}
              sx={{ border: 'none', background: 'transparent', p: 0, display: 'flex', alignItems: 'center', color: ACCENT2, cursor: 'pointer', animation: spinning ? 'spin .7s ease-in-out' : 'none' }}
            >
              <KIcon name="reset" size={18} />
            </Box>
          </Stack>
          <SegmentedButtonGroup tabs={VIEW_TABS} value={viewTabs.value} onChange={viewTabs.onChange} />
        </Stack>

        {selectedNode ? (
          <>
            <NodeInfoCard node={selectedNode} t={t} />

            {/* Metrics grid */}
            <NodeGraphs
              selectedNodeParam={selectedNodeParam}
              selectedTab={viewTabs.value}
              refreshKey={refreshKey}
              offline={!selectedNode.online_status}
            />

            <DiskCard node={selectedNodeParam} online={selectedNode.online_status} t={t} />

            {/* Bottom links */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', bgcolor: T.border, m: 1.5, borderRadius: '6px', overflow: 'hidden' }}>
              <LinkTile label={t('navigate.process_list')} accent={T.primary} link={`/dashboard/nodes/${selectedNodeParam}/process`} />
              <LinkTile label={t('navigate.channel_inbound')} accent={ACCENT2} link={`/dashboard/nodes/${selectedNodeParam}/channels-inbound`} />
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Typography sx={{ fontSize: 16, color: T.textSec }}>{t('info.select_node')}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function SummaryStat({ label, pill, value }: { label?: string; pill?: 'on' | 'off'; value: number }) {
  return (
    <Box sx={{ flex: '1 1 0', minWidth: 0, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', p: '11px 16px', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ mb: 1, textAlign: 'right' }}>
        {pill ? (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: pill === 'on' ? T.onBg : T.bgHover,
              border: `1px solid ${pill === 'on' ? `${T.on}55` : T.border}`,
              color: pill === 'on' ? T.on : T.textSec,
              fontSize: 13,
              px: 0.75,
              py: '1px',
              borderRadius: '3px',
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: pill === 'on' ? T.on : T.textSec }} />
            {pill === 'on' ? 'ON' : 'OFF'}
          </Box>
        ) : (
          <Typography component="span" sx={{ fontSize: 15, fontWeight: 500, letterSpacing: '0.05em', color: T.textSec }}>
            {label}
          </Typography>
        )}
      </Box>
      <Typography sx={{ fontSize: 40, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1, color: pill === 'on' ? T.on : T.textPrim }}>
        {value.toLocaleString()}
      </Typography>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 36, background: `linear-gradient(to top, ${ACCENT2}22, transparent)`, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, bgcolor: ACCENT2, opacity: 0.4 }} />
    </Box>
  );
}

// ----------------------------------------------------------------------

function NodeInfoCard({ node, t }: { node: INodeItem; t: (k: string) => string }) {
  const on = node.online_status;
  const sc = on ? T.on : T.offline;
  return (
    <Box sx={{ m: 1.5, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ p: '10px 14px', bgcolor: on ? `${ACCENT2}22` : T.offlineBg, borderBottom: `1px solid ${T.border}` }}>
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 13, fontWeight: 700, px: 0.875, py: '2px', borderRadius: '3px', letterSpacing: '0.08em', fontFamily: 'Roboto', bgcolor: on ? T.onBg : T.offlineBg, color: sc, border: `1px solid ${sc}55` }}>
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: sc }} />
          {on ? 'ON' : 'OFF'}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 500, color: T.textPrim }}>
            {node.id} <Box component="span" sx={{ fontSize: 15, fontWeight: 400, color: T.textSec }}>| {node.name}</Box>
          </Typography>
          <Typography sx={{ fontSize: 15, color: T.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.desc}</Typography>
        </Box>
      </Stack>
      <Box sx={{ p: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
        <Row label={t('info.emittable')} value={node.emittable ? t('info.true') : t('info.false')} color={node.emittable ? T.on : T.textDim} />
        <Row label={t('info.emit_count')} value={String(node.emit_count ?? 0)} color={ACCENT2} />
      </Box>
    </Box>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography sx={{ fontSize: 15, color: T.textSec }}>{label}</Typography>
      <Typography sx={{ fontSize: 15, fontWeight: 500, fontFamily: 'Roboto', color }}>{value}</Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function DiskCard({ node, online, t }: { node: string; online: boolean; t: (k: string) => string }) {
  const { diskMetricsData } = useGetDiskMetrics(node);
  const used = diskMetricsData?.disk_used_size;
  const total = diskMetricsData?.disk_total_size;

  return (
    <Box sx={{ m: '8px 12px 0', bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', p: '12px 14px' }}>
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: T.textSec, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1 }}>
        {t('disk.disk')}
      </Typography>
      {online && total != null ? (
        <DiskUsage used={Number(used)} total={Number(total)} />
      ) : (
        <Typography sx={{ fontSize: 15, color: T.textDim }}>{t('info.offline')}</Typography>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function LinkTile({ label, accent, link }: { label: string; accent: string; link: string }) {
  const router = useRouter();
  return (
    <Box
      onClick={() => router.push(link)}
      sx={{ bgcolor: T.bgHover, p: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 15.5, fontWeight: 500, color: T.textPrim, borderLeft: `3px solid ${accent}`, transition: 'background .15s', '&:hover': { bgcolor: `${accent}22` } }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: accent, flexShrink: 0 }} />
        {label}
      </Stack>
      <Box sx={{ color: accent, display: 'flex' }}>
        <KIcon name="arrowRight" size={14} />
      </Box>
    </Box>
  );
}
