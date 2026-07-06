'use client';

import type { INodeItem } from 'src/types/dashboard';

import useSWR from 'swr';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname, useRouter } from 'src/routes/hooks';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { signOut } from 'src/auth/context/jwt/action';
import { useAuthContext } from 'src/auth/hooks';
import { useGetStatus, useGetProcesses, useGetMemoryMetrics } from 'src/actions/dashboard';
import { useGetChannelList } from 'src/actions/nodes';

import { Logo } from 'src/components/logo';
import { KIcon } from 'src/components/k-icons';

import type { KIconName } from 'src/components/k-icons';

import { T } from 'src/theme/tokens';

// ----------------------------------------------------------------------

type NavVerticalV5Props = {
  nodes: INodeItem[];
};

export function NavVerticalV5({ nodes }: NavVerticalV5Props) {
  const { t } = useTranslate('sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const { user, checkUserSession } = useAuthContext();

  const nodeIds = useMemo(() => nodes.map((n) => n.id), [nodes]);

  const urlNode = useMemo(() => {
    const m = pathname.match(/\/dashboard\/nodes\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }, [pathname]);

  const [activeNode, setActiveNode] = useState<string>(urlNode || nodeIds[0] || '');

  useEffect(() => {
    if (urlNode) setActiveNode(urlNode);
    else if (!activeNode && nodeIds[0]) setActiveNode(nodeIds[0]);
  }, [urlNode, nodeIds, activeNode]);

  const activeNodeObj = nodes.find((n) => n.id === activeNode);
  const nodeOnline = activeNodeObj?.online_status ?? false;

  const [nodeOpen, setNodeOpen] = useState(true);

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(`${path}/`),
    [pathname]
  );

  const switchNode = useCallback(
    (newNode: string) => {
      if (!newNode) return;
      setActiveNode(newNode);
      const m = pathname.match(/^\/dashboard\/nodes\/[^/]+(\/.*)?$/);
      if (m) {
        const rest = pathname.replace(/^\/dashboard\/nodes\/[^/]+/, '');
        const firstSeg = rest.split('/').filter(Boolean)[0];
        router.push(
          firstSeg
            ? `/dashboard/nodes/${newNode}/${firstSeg}`
            : paths.dashboard.nodes.dashboard(newNode)
        );
      } else {
        router.push(paths.dashboard.nodes.dashboard(newNode));
      }
    },
    [pathname, router]
  );

  const stepNode = useCallback(
    (dir: 1 | -1) => {
      const idx = nodeIds.indexOf(activeNode);
      const next = nodeIds[idx + dir];
      if (next) switchNode(next);
    },
    [nodeIds, activeNode, switchNode]
  );

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, router]);

  const displayName = (user?.displayName || user?.name || user?.email?.split('@')[0] || 'User') as string;
  const teamName = (user?.role || user?.team || 'Team') as string;
  const initials = displayName
    .split(' ')
    .map((s: string) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const listMenu = [
    { label: t('tab_option.action_list'), path: paths.dashboard.nodes.actionList(activeNode) },
    { label: t('tab_option.rule_list'), path: paths.dashboard.nodes.rules(activeNode) },
    { label: t('tab_option.spec_list'), path: paths.dashboard.nodes.specList(activeNode) },
    { label: t('tab_option.identify_list'), path: paths.dashboard.nodes.identifyList(activeNode) },
    { label: t('tab_option.function_list'), path: paths.dashboard.nodes.functionList(activeNode) },
    { label: t('tab_option.daily_report_list'), path: paths.dashboard.nodes.dailyReportList(activeNode) },
    { label: t('tab_option.alerts_list'), path: paths.dashboard.nodes.alertsList(activeNode) },
  ];

  const dashActive = pathname === paths.dashboard.root;

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        height: 1,
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        width: '268px',
        bgcolor: T.bgPanel,
        borderRight: `1px solid ${T.border}`,
        overflow: 'hidden',
        zIndex: 'var(--layout-nav-zIndex)',
      }}
    >
      {/* Brand header */}
      <Box
        sx={{
          px: 2,
          py: 1.75,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo isSingle={false} isWhite width={110} height={24} disableLink />
        <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textDim, cursor: 'pointer' }}>
          <KIcon name="scrap" size={18} />
        </Box>
      </Box>

      {/* Nav list */}
      <Box className="no-scrollbar" sx={{ flex: 1, p: 1.25, display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto' }}>
        <NavRow label={t('side_bar.dashboard')} icon="home" active={dashActive} onClick={() => router.push(paths.dashboard.root)} />

        <NavRow label={t('side_bar.nodes')} icon="certified" expandable open={nodeOpen} onClick={() => setNodeOpen((v) => !v)} />

        {nodeOpen && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.25 }}>
            <NodeStepper
              node={activeNode}
              online={nodeOnline}
              canPrev={nodeIds.indexOf(activeNode) > 0}
              canNext={nodeIds.indexOf(activeNode) < nodeIds.length - 1}
              onPrev={() => stepNode(-1)}
              onNext={() => stepNode(1)}
            />

            {activeNode && (
              <NodeTiles
                node={activeNode}
                nodeOnline={nodeOnline}
                isActive={isActive}
                onNavigate={(p) => router.push(p)}
                t={t}
              />
            )}

            {activeNode && (
              <Box>
                <GroupHeader label={t('group.settings_list')} />
                {listMenu.map((item) => (
                  <NavRow key={item.path} label={item.label} indent={2} active={isActive(item.path)} onClick={() => router.push(item.path)} />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Bottom block */}
      <Box sx={{ borderTop: `1px solid ${T.border}`, p: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        <Box
          onClick={() => router.push('/dashboard/settings')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.375, px: 1.5, py: 1.125, borderRadius: 1, color: T.textSec, fontSize: 15, cursor: 'pointer', '&:hover': { bgcolor: T.bgHover, color: T.textPrim } }}
        >
          <KIcon name="settings" size={16} />
          {t('side_bar.settings')}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.125, px: 1.25, py: 1, borderRadius: 1 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: T.onFill, flexShrink: 0 }}>
            {initials}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: T.textPrim, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</Typography>
            <Typography sx={{ fontSize: 12, color: T.textSec, lineHeight: 1.3 }}>{teamName}</Typography>
          </Box>
          <Box
            onClick={handleLogout}
            sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, color: T.textDim, cursor: 'pointer', '&:hover': { bgcolor: T.offBg, color: T.off } }}
          >
            <KIcon name="logout" size={17} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// NodeTiles — fetches real values for the active node and renders the tile groups.
// ----------------------------------------------------------------------

type NodeTilesProps = {
  node: string;
  nodeOnline: boolean;
  isActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
  t: (key: string) => string;
};

function NodeTiles({ node, nodeOnline, isActive, onNavigate, t }: NodeTilesProps) {
  const { processes } = useGetProcesses(node) as { processes: any[] };
  const { channels: inChannels } = useGetChannelList(node, 'inbound') as { channels: any[] };
  const { channels: outChannels } = useGetChannelList(node, 'outbound') as { channels: any[] };
  const { memoryMetricsData } = useGetMemoryMetrics(node);
  const { status } = useGetStatus(node);
  const { data: layoutData } = useSWR(node ? endpoints.layouts.list(node) : null, fetcher);

  const layoutCount = (layoutData?.data?.list?.length ?? layoutData?.data?.layoutList?.length) as number | undefined;
  const memUsage = memoryMetricsData?.mem_usage;
  const statusOkay = status?.service_status?.okay;

  const groups = [
    {
      label: t('group.monitoring'),
      tiles: [
        {
          label: t('tab_option.node_dashboard'),
          value: nodeOnline ? 'ON' : 'OFF',
          tone: nodeOnline ? 'on' : 'dim',
          path: paths.dashboard.nodes.dashboard(node),
        },
        { label: t('tab_option.process'), value: processes?.length != null ? String(processes.length) : '', path: paths.dashboard.nodes.process(node) },
        { label: t('tab_option.memory'), value: memUsage != null ? `${memUsage}%` : '', path: paths.dashboard.nodes.memory(node) },
        {
          label: t('tab_option.status'),
          value: statusOkay == null ? '' : statusOkay ? t('tile.normal') : t('tile.abnormal'),
          tone: statusOkay === false ? 'off' : 'default',
          path: paths.dashboard.nodes.status(node),
        },
        { label: t('tab_option.replay'), value: '', tone: 'dim', path: paths.dashboard.nodes.replay(node) },
      ],
    },
    {
      label: t('group.data'),
      tiles: [
        { label: t('tab_option.audit_log'), value: '', path: paths.dashboard.nodes.auditLog(node) },
        { label: t('tab_option.layout_list'), value: layoutCount != null ? String(layoutCount) : '', path: paths.dashboard.nodes.layoutList(node) },
        { label: t('tab_option.channels_inbound'), value: inChannels?.length != null ? String(inChannels.length) : '', path: paths.dashboard.nodes.channelsInbound(node) },
        { label: t('tab_option.channels_outbound'), value: outChannels?.length != null ? String(outChannels.length) : '', path: paths.dashboard.nodes.channelsOutbound(node) },
      ],
    },
  ];

  return (
    <>
      {groups.map((group) => (
        <Box key={group.label}>
          <GroupHeader label={group.label} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {group.tiles.map((tile) => (
              <MenuTile
                key={tile.label}
                label={tile.label}
                value={tile.value}
                tone={(tile as any).tone || 'default'}
                active={isActive(tile.path)}
                onClick={() => onNavigate(tile.path)}
              />
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
}

// ----------------------------------------------------------------------

type NavRowProps = {
  label: string;
  icon?: KIconName;
  indent?: 0 | 1 | 2;
  active?: boolean;
  expandable?: boolean;
  open?: boolean;
  onClick?: () => void;
};

function NavRow({ label, icon, indent = 0, active, expandable, open, onClick }: NavRowProps) {
  const fontSize = indent === 0 ? 16 : indent === 1 ? 15 : 14;
  const isLeaf = !expandable;
  const color = active ? (isLeaf ? '#FFFFFF' : T.onFill) : indent === 2 ? T.textDim : T.textSec;
  const background = active ? (isLeaf ? T.primary : T.deep) : 'transparent';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.125,
        pl: 1.5,
        pr: 1.25,
        py: 1,
        borderRadius: 1,
        fontSize,
        fontWeight: active ? 500 : 450,
        color,
        background,
        cursor: 'pointer',
        transition: 'background .12s, color .12s',
        '&:hover': active ? undefined : { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      {icon && (
        <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <KIcon name={icon} size={15} />
        </Box>
      )}
      <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</Box>
      {expandable && (
        <Box component="span" sx={{ fontSize: 17, opacity: 0.5, flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>
          ›
        </Box>
      )}
    </Box>
  );
}

function GroupHeader({ label }: { label: string }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 500, color: T.textDim, letterSpacing: '0.04em', px: 0.5, pt: 1.25, pb: 0.5 }}>
      {label}
    </Typography>
  );
}

type MenuTileProps = {
  label: string;
  value?: string;
  tone?: string;
  active?: boolean;
  onClick?: () => void;
};

function MenuTile({ label, value, tone = 'default', active, onClick }: MenuTileProps) {
  const valueColor = active
    ? '#FFFFFF'
    : tone === 'on'
      ? T.on
      : tone === 'off'
        ? T.off
        : tone === 'dim'
          ? T.textDim
          : T.textPrim;

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        flex: '1 1 calc(50% - 4px)',
        minWidth: 'calc(50% - 4px)',
        textAlign: 'left',
        border: 'none',
        p: '10px 11px',
        borderRadius: 1,
        bgcolor: active ? T.primary : T.bgCard,
        cursor: 'pointer',
        transition: 'background .12s',
        '&:hover': active ? undefined : { bgcolor: T.bgHover },
      }}
    >
      <Typography sx={{ fontSize: 13, color: active ? 'rgba(255,255,255,0.8)' : T.textSec, lineHeight: 1.4 }}>{label}</Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 400, color: valueColor, lineHeight: 1.3, minHeight: 21 }}>{value ?? ''}</Typography>
    </Box>
  );
}

type NodeStepperProps = {
  node: string;
  online: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function NodeStepper({ node, online, canPrev, canNext, onPrev, onNext }: NodeStepperProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1.5, pr: 0.75, py: 0.625, borderRadius: '5px', bgcolor: T.bgCard, border: `1px solid ${T.border}` }}>
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, bgcolor: online ? T.on : T.offline, boxShadow: `0 0 5px ${online ? T.on : T.offline}99` }} />
      <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 500, color: T.textPrim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node || '—'}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <StepBtn icon="chevronUp" disabled={!canPrev} onClick={onPrev} />
        <StepBtn icon="chevronDown" disabled={!canNext} onClick={onNext} />
      </Box>
    </Box>
  );
}

function StepBtn({ icon, disabled, onClick }: { icon: KIconName; disabled: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      sx={{ width: 22, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', bgcolor: 'transparent', color: T.textSec, opacity: disabled ? 0.25 : 1, cursor: disabled ? 'default' : 'pointer', borderRadius: '3px', '&:hover': disabled ? undefined : { bgcolor: T.bgHover } }}
    >
      <KIcon name={icon} size={13} />
    </Box>
  );
}
