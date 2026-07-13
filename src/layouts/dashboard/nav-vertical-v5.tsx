'use client';

import type { INodeItem } from 'src/types/dashboard';
import type { KIconName } from 'src/components/k-icons';

import useSWR from 'swr';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { formatBytes } from 'src/utils/helper';
import { fetcher, endpoints } from 'src/utils/axios';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';
import { useAuditLogList, useGetChannelList } from 'src/actions/nodes';
import { useGetProcesses, useGetMemoryMetrics } from 'src/actions/dashboard';

import { KIcon } from 'src/components/k-icons';
import { useIsDesktopViewport } from 'src/components/viewport-zoom';

import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';

// ----------------------------------------------------------------------

type NavVerticalV5Props = {
  nodes: INodeItem[];
};

export function NavVerticalV5({ nodes }: NavVerticalV5Props) {
  const { t } = useTranslate('sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const { user, checkUserSession } = useAuthContext();

  // Below the desktop breakpoint (1200px) the sidebar switches to the compact
  // 140px rail (per Figma): a node stepper instead of the combo, single-column
  // stat tiles, and a narrower shell. Everything else is shared.
  const isDesktop = useIsDesktopViewport();
  const compact = !isDesktop;

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

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, router]);

  const displayName = (user?.displayName ||
    user?.name ||
    user?.email?.split('@')[0] ||
    user?.id ||
    user?.user?.id ||
    'User') as string;
  const teamName = (user?.role || user?.user?.role || user?.team || 'Team') as string;
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
    {
      label: t('tab_option.daily_report_list'),
      path: paths.dashboard.nodes.dailyReportList(activeNode),
    },
    { label: t('tab_option.alerts_list'), path: paths.dashboard.nodes.alertsList(activeNode) },
  ];

  // trailingSlash is enabled, so pathname comes as "/dashboard/" — strip the
  // trailing slash before the exact match, otherwise the dashboard never lights up.
  const dashActive = pathname.replace(/\/+$/, '') === paths.dashboard.root;

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        width: compact ? '140px' : '268px',
        bgcolor: T.bgPanel,
        borderRight: `1px solid ${T.border}`,
        overflow: 'hidden',
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
        <Box
          component="img"
          src="/logo/pmr-butterfly.png"
          alt="PMR"
          sx={{ height: 24, width: 'auto', display: 'block' }}
        />
        {!compact && (
          <Box
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.textDim,
              cursor: 'pointer',
            }}
          >
            <KIcon name="scrap" size={18} />
          </Box>
        )}
      </Box>

      {/* Nav list */}
      <Box
        className="no-scrollbar"
        sx={{
          flex: 1,
          p: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          overflowY: 'auto',
        }}
      >
        <NavRow
          label={t('side_bar.dashboard')}
          icon="home"
          active={dashActive}
          onClick={() => router.push(paths.dashboard.root)}
        />

        <NavRow
          label={t('side_bar.nodes')}
          icon="certified"
          expandable
          open={nodeOpen}
          onClick={() => setNodeOpen((v) => !v)}
        />

        {nodeOpen && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.25 }}>
            {compact ? (
              <NodeStepper
                nodes={nodes}
                activeNode={activeNode}
                online={nodeOnline}
                onSelect={switchNode}
              />
            ) : (
              <NodeCombo
                nodes={nodes}
                activeNode={activeNode}
                online={nodeOnline}
                onSelect={switchNode}
              />
            )}

            {activeNode && (
              <NodeTiles
                node={activeNode}
                nodeOnline={nodeOnline}
                isActive={isActive}
                onNavigate={(p) => router.push(p)}
                columns={compact ? 1 : 2}
                t={t}
              />
            )}

            {activeNode && (
              <Box>
                <GroupHeader label={t('group.settings_list')} />
                {listMenu.map((item) => (
                  <NavRow
                    key={item.path}
                    label={item.label}
                    indent={2}
                    active={isActive(item.path)}
                    onClick={() => router.push(item.path)}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Bottom block */}
      <Box
        sx={{
          borderTop: `1px solid ${T.border}`,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
        }}
      >
        <Box
          onClick={() => router.push('/dashboard/settings')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.375,
            px: 1.5,
            py: 1.125,
            borderRadius: 1,
            color: T.textSec,
            fontSize: 15,
            cursor: 'pointer',
            '&:hover': { bgcolor: T.bgHover, color: T.textPrim },
          }}
        >
          <KIcon name="settings" size={16} />
          {t('side_bar.settings')}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.125,
            px: 1.25,
            py: 1,
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${T.primary}, ${T.primary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 500,
              color: T.onFill,
              flexShrink: 0,
            }}
          >
            {initials}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: T.textPrim,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </Typography>
            <Typography sx={{ fontSize: 12, color: T.textSec, lineHeight: 1.3 }}>
              {teamName}
            </Typography>
          </Box>
          <Box
            onClick={handleLogout}
            sx={{
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              color: T.textDim,
              cursor: 'pointer',
              '&:hover': { bgcolor: T.offBg, color: T.off },
            }}
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
  columns?: 1 | 2;
  t: (key: string) => string;
};

function NodeTiles({ node, nodeOnline, isActive, onNavigate, columns = 2, t }: NodeTilesProps) {
  const { processes } = useGetProcesses(node) as { processes: any[] };
  const { channels: inChannels } = useGetChannelList(node, 'inbound') as { channels: any[] };
  const { channels: outChannels } = useGetChannelList(node, 'outbound') as { channels: any[] };
  const { memoryMetricsData } = useGetMemoryMetrics(node);
  const { auditLogs } = useAuditLogList(node, 'all', 1, 1000);
  const { data: layoutData } = useSWR(node ? endpoints.layouts.list(node) : null, fetcher);

  const layoutCount = (layoutData?.data?.list?.length ?? layoutData?.data?.layoutList?.length) as
    | number
    | undefined;
  const memUsage = memoryMetricsData?.mem_usage;

  // Total audit-log disk usage = sum of every audit-log file's size (bytes).
  const auditTotalBytes = (auditLogs || []).reduce((sum, log) => sum + (Number(log.size) || 0), 0);
  const auditTotal = auditLogs?.length ? String(formatBytes(auditTotalBytes) ?? '') : '';

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
        {
          label: t('tab_option.process'),
          value: processes?.length != null ? String(processes.length) : '',
          path: paths.dashboard.nodes.process(node),
        },
        {
          label: t('tab_option.memory'),
          value: memUsage != null ? `${memUsage}%` : '',
          path: paths.dashboard.nodes.memory(node),
        },
        {
          label: t('tab_option.status'),
          value: nodeOnline ? t('tile.normal') : t('tile.abnormal'),
          tone: nodeOnline ? 'default' : 'off',
          path: paths.dashboard.nodes.status(node),
        },
        {
          label: t('tab_option.replay'),
          value: '',
          tone: 'dim',
          path: paths.dashboard.nodes.replay(node),
        },
      ],
    },
    {
      label: t('group.data'),
      tiles: [
        {
          label: t('tab_option.audit_log'),
          value: auditTotal,
          path: paths.dashboard.nodes.auditLog(node),
        },
        {
          label: t('tab_option.layout_list'),
          value: layoutCount != null ? String(layoutCount) : '',
          path: paths.dashboard.nodes.layoutList(node),
        },
        {
          label: t('tab_option.channels_inbound'),
          value: inChannels?.length != null ? String(inChannels.length) : '',
          path: paths.dashboard.nodes.channelsInbound(node),
        },
        {
          label: t('tab_option.channels_outbound'),
          value: outChannels?.length != null ? String(outChannels.length) : '',
          path: paths.dashboard.nodes.channelsOutbound(node),
        },
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
                columns={columns}
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
  const color = active ? '#FFFFFF' : indent === 2 ? T.textDim : T.textSec;
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
        fontWeight: 400,
        color,
        background,
        cursor: 'pointer',
        transition: 'background .12s, color .12s',
        '&:hover': active ? undefined : { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <KIcon name={icon} size={15} />
        </Box>
      )}
      <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </Box>
      {expandable && (
        <Box
          component="span"
          sx={{
            fontSize: 17,
            opacity: 0.5,
            flexShrink: 0,
            transform: open ? 'rotate(90deg)' : 'none',
            transition: 'transform .15s',
          }}
        >
          ›
        </Box>
      )}
    </Box>
  );
}

function GroupHeader({ label }: { label: string }) {
  return (
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 500,
        color: T.textDim,
        letterSpacing: '0.04em',
        px: 0.5,
        pt: 1.25,
        pb: 0.5,
      }}
    >
      {label}
    </Typography>
  );
}

type MenuTileProps = {
  label: string;
  value?: string;
  tone?: string;
  active?: boolean;
  columns?: 1 | 2;
  onClick?: () => void;
};

function MenuTile({ label, value, tone = 'default', active, columns = 2, onClick }: MenuTileProps) {
  const valueColor = active
    ? '#FFFFFF'
    : tone === 'on'
      ? T.on
      : tone === 'off'
        ? T.off
        : tone === 'dim'
          ? T.textDim
          : T.textPrim;

  // Single-column (compact rail) tiles span the full width; the default 2-up
  // grid keeps each tile at half width minus the row gap.
  const basis = columns === 1 ? '100%' : 'calc(50% - 4px)';

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        flex: `1 1 ${basis}`,
        minWidth: basis,
        maxWidth: basis,
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
      <Typography
        sx={{ fontSize: 13, color: active ? 'rgba(255,255,255,0.8)' : T.textSec, lineHeight: 1.4 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: 16, fontWeight: 400, color: valueColor, lineHeight: 1.3, minHeight: 21 }}
      >
        {value ?? ''}
      </Typography>
    </Box>
  );
}

type NodeComboProps = {
  nodes: INodeItem[];
  activeNode: string;
  online: boolean;
  onSelect: (node: string) => void;
};

// Small status dot shared by the input adornment and the option rows.
function StatusDot({ online, glow = false }: { online: boolean; glow?: boolean }) {
  const color = online ? T.on : T.offline;
  return (
    <Box
      sx={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        flexShrink: 0,
        bgcolor: color,
        ...(glow && { boxShadow: `0 0 5px ${color}99` }),
      }}
    />
  );
}

function NodeCombo({ nodes, activeNode, online, onSelect }: NodeComboProps) {
  const activeObj = useMemo(
    () => nodes.find((n) => n.id === activeNode) ?? null,
    [nodes, activeNode]
  );

  return (
    <Autocomplete
      fullWidth
      size="small"
      autoHighlight
      openOnFocus
      options={nodes}
      value={activeObj}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      getOptionLabel={(o) => o.id}
      onChange={(_, newValue) => {
        if (newValue) onSelect(newValue.id);
      }}
      popupIcon={<KIcon name="chevronDown" size={14} />}
      renderOption={(props, option) => {
        // eslint-disable-next-line react/prop-types
        const { key, ...rest } = props as typeof props & { key: string };
        const nOnline = option.online_status ?? false;
        return (
          <Box
            component="li"
            key={key}
            {...rest}
            sx={{
              gap: 1.25,
              fontSize: 14,
              color: T.textPrim,
              '&:hover': { bgcolor: T.bgHover },
              '&[aria-selected="true"]': { bgcolor: T.deep },
              '&.Mui-focused': { bgcolor: T.bgHover },
              '&[aria-selected="true"].Mui-focused': { bgcolor: T.deep },
            }}
          >
            <StatusDot online={nOnline} />
            <Box
              sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {option.id}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={activeNode || '—'}
          InputProps={{
            ...params.InputProps,
            startAdornment: <StatusDot online={online} glow />,
          }}
        />
      )}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          },
        },
        clearIndicator: { sx: { display: 'none' } },
      }}
      sx={{
        '& .MuiAutocomplete-listbox': { maxHeight: 320, py: 0.5 },
        '& .MuiOutlinedInput-root': {
          gap: 1,
          pl: 1.5,
          pr: 1,
          py: 0.25,
          borderRadius: '5px',
          bgcolor: T.bgCard,
          transition: 'border-color .12s, background .12s',
          '&:hover': { bgcolor: T.bgHover },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: T.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.border },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: T.primary,
            borderWidth: 1,
          },
        },
        '& .MuiOutlinedInput-input': {
          fontSize: 14,
          fontWeight: 500,
          color: T.textPrim,
          '&::placeholder': { color: T.textPrim, opacity: 1 },
        },
        '& .MuiAutocomplete-endAdornment': { right: 8 },
        '& .MuiAutocomplete-popupIndicator': {
          color: T.textSec,
          transition: 'transform .15s',
        },
      }}
    />
  );
}

// ----------------------------------------------------------------------
// NodeStepper — compact-rail node switcher: status dot + node id + up/down
// steppers that cycle through the node list (the combo is too wide at 140px).
// ----------------------------------------------------------------------

function NodeStepper({ nodes, activeNode, online, onSelect }: NodeComboProps) {
  const idx = nodes.findIndex((n) => n.id === activeNode);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!nodes.length) return;
      const base = idx < 0 ? 0 : idx;
      const next = (base + dir + nodes.length) % nodes.length;
      onSelect(nodes[next].id);
    },
    [nodes, idx, onSelect]
  );

  const disabled = nodes.length <= 1;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        bgcolor: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: '5px',
        pl: '13px',
        pr: '7px',
        py: '6px',
      }}
    >
      <StatusDot online={online} glow />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: 14,
          fontWeight: 500,
          color: T.textPrim,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {activeNode || '—'}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
        <StepBtn up disabled={disabled} onClick={() => step(-1)} />
        <StepBtn disabled={disabled} onClick={() => step(1)} />
      </Box>
    </Box>
  );
}

function StepBtn({
  up,
  disabled,
  onClick,
}: {
  up?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 22,
        height: 16,
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: T.textSec,
        opacity: disabled ? 0.25 : 1,
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': disabled ? undefined : { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      <Box sx={{ display: 'flex', transform: up ? 'rotate(180deg)' : 'none' }}>
        <KIcon name="chevronDown" size={13} />
      </Box>
    </Box>
  );
}
