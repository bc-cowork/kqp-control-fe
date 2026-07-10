'use client';

import type { ChartDataPoint } from 'src/types/dashboard';

import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Area, XAxis, YAxis, Tooltip, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { T } from 'src/theme/tokens';

// ----------------------------------------------------------------------

type MetricKey = keyof Omit<ChartDataPoint, 'timestamp'>;
type Fmt = 'percent' | 'count' | 'bytes';

export type MetricDef = {
  key: string;
  title: string;
  color: string;
  threshold?: number;
  variants: { label?: string; metric: MetricKey; fmt: Fmt }[];
};

// ----------------------------------------------------------------------

const fmtBytes = (v: number) =>
  v >= 1e9 ? `${(v / 1e9).toFixed(1)}GB` : v >= 1e6 ? `${Math.round(v / 1e6)}MB` : `${v}`;
const fmtAxisNum = (v: number) =>
  v >= 1e6 ? `${Math.round(v / 1e6)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}k` : `${v}`;
const fmtValue = (v: number, f: Fmt) =>
  f === 'percent' ? `${v.toFixed(1)}%` : f === 'bytes' ? fmtBytes(v) : Math.round(v).toLocaleString();

function MetricTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <Box sx={{ bgcolor: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: '5px', p: '8px 12px', fontSize: 14, boxShadow: '0 4px 16px #00000066' }}>
      <Box sx={{ color: T.textPrim, mb: 0.5 }}>{label}</Box>
      <Box sx={{ color: T.textSec }}>
        {p.dataKey} : <Box component="span" sx={{ color: T.textPrim, fontFamily: 'Roboto' }}>{Number(p.value).toLocaleString()}</Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

type BigMetricProps = {
  m: MetricDef;
  data: ChartDataPoint[];
  compact?: boolean;
  offline?: boolean;
  loading?: boolean;
  animKey?: string | number;
};

export function BigMetric({ m, data, compact = false, offline = false, loading = false, animKey }: BigMetricProps) {
  const [vi, setVi] = useState(0);
  const v = m.variants[vi];
  const isPercent = v.fmt === 'percent';
  const lastVal = data.length ? Number((data[data.length - 1] as any)[v.metric]) || 0 : 0;

  return (
    <Box sx={{ bgcolor: T.bgCard, p: compact ? '8px 12px 6px' : '12px 14px 10px', display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 22 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 400, color: T.textSec }}>{m.title}</Typography>
        {m.variants.length > 1 ? (
          <Box sx={{ display: 'flex', border: `1px solid ${T.border}`, borderRadius: '5px', overflow: 'hidden', opacity: offline ? 0.4 : 1, pointerEvents: offline ? 'none' : 'auto' }}>
            {m.variants.map((vv, i) => (
              <Box
                component="button"
                key={vv.label}
                onClick={() => setVi(i)}
                sx={{ fontSize: 13, p: '3px 10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, bgcolor: vi === i ? T.bgHover : 'transparent', color: vi === i ? T.textPrim : T.textDim }}
              >
                {vv.label}
              </Box>
            ))}
          </Box>
        ) : compact && isPercent ? (
          <Box component="span" sx={{ fontSize: 13, fontWeight: 500, p: '3px 9px', borderRadius: '5px', border: `1px solid ${T.border}`, bgcolor: T.bgHover, color: T.textPrim, opacity: offline ? 0.4 : 1 }}>
            %
          </Box>
        ) : null}
      </Box>

      {!compact && (
        <Typography sx={{ fontSize: 22, fontWeight: 500, fontFamily: 'Roboto', color: offline ? T.textDim : m.color, letterSpacing: '-0.02em', lineHeight: 1.3, mb: 0.5 }}>
          {offline || loading || !data.length ? '—' : fmtValue(lastVal, v.fmt)}
        </Typography>
      )}

      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }} style={{ opacity: offline ? 0.6 : 1 }}>
            <CartesianGrid stroke={T.border} strokeWidth={0.5} />
            <XAxis dataKey="timestamp" tick={{ fontSize: 13, fill: T.textDim, fontFamily: 'Roboto' }} tickLine={false} axisLine={{ stroke: T.border }} minTickGap={28} />
            <YAxis
              tick={{ fontSize: 13, fill: T.textDim, fontFamily: 'Roboto' }}
              tickLine={false}
              axisLine={{ stroke: T.border }}
              width={42}
              domain={isPercent ? [0, 100] : [0, 'auto']}
              tickFormatter={isPercent ? undefined : fmtAxisNum}
              tickCount={compact ? 2 : undefined}
            />
            {!offline && <Tooltip content={<MetricTooltip />} cursor={{ stroke: T.textDim, strokeWidth: 1 }} />}
            <Area
              key={`${animKey}-${v.metric}-${offline ? 'off' : 'on'}`}
              type="linear"
              dataKey={v.metric}
              stroke={offline ? 'transparent' : m.color}
              fill={m.color}
              fillOpacity={offline ? 0 : 0.2}
              strokeWidth={1.6}
              dot={false}
              isAnimationActive={!offline}
              animationDuration={700}
              animationEasing="ease-out"
              activeDot={offline ? false : { r: 4, fill: m.color, stroke: '#fff', strokeWidth: 1.5 }}
            />
            {offline && <ReferenceLine y={0} stroke={T.textDim} strokeWidth={1.4} />}
            {!offline && m.threshold != null && <ReferenceLine y={m.threshold} stroke="#D9A441" strokeWidth={1} strokeDasharray="4 3" />}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
