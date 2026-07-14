'use client';

import { useRef, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { T, FONT_MONO } from 'src/theme/tokens';

// ----------------------------------------------------------------------
// Timeline-drag frame navigation. Replaces the arrow-only nav in the audit
// log frame detail. Dragging only updates a local preview; the real seek
// (onSeek) fires once on release / click — same API cost as one arrow click.
// ----------------------------------------------------------------------

type FrameTimelineProps = {
  label?: string;
  current: number; // current seq (1..total)
  total: number; // max frame count
  onSeek: (seq: number) => void;
  disabled?: boolean;
};

export function FrameTimeline({ label, current, total, onSeek, disabled }: FrameTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragSeq, setDragSeq] = useState<number | null>(null);

  const active = total > 1 && !disabled;
  const pos = dragSeq ?? current;
  const ratio = total > 1 ? (Math.min(total, Math.max(1, pos)) - 1) / (total - 1) : 0;

  const seqFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return current;
      const rect = el.getBoundingClientRect();
      const r = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return Math.round(1 + r * (total - 1));
    },
    [current, total]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!active) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragSeq(seqFromClientX(e.clientX));
    },
    [active, seqFromClientX]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragSeq === null) return;
      setDragSeq(seqFromClientX(e.clientX));
    },
    [dragSeq, seqFromClientX]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragSeq === null) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      const target = dragSeq;
      setDragSeq(null);
      if (target !== current) onSeek(target);
    },
    [dragSeq, current, onSeek]
  );

  const step = useCallback(
    (d: number) => {
      if (!active) return;
      const n = Math.min(total, Math.max(1, current + d));
      if (n !== current) onSeek(n);
    },
    [active, total, current, onSeek]
  );

  // A handful of evenly-spaced ticks for scale reference.
  const ticks = useMemo(() => {
    if (total <= 1) return [];
    const n = Math.min(8, total);
    return Array.from({ length: n }, (_, i) => Math.round(1 + (i / (n - 1)) * (total - 1)));
  }, [total]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        opacity: active ? 1 : 0.5,
      }}
    >
      {label && (
        <Typography sx={{ fontSize: 16, color: T.textDim, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {label}
        </Typography>
      )}

      {/* Step back */}
      <NavStep dir="prev" onClick={() => step(-1)} disabled={!active || current <= 1} />

      {/* Track */}
      <Box
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        sx={{
          position: 'relative',
          flex: 1,
          minWidth: 120,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          cursor: !active ? 'default' : dragSeq !== null ? 'grabbing' : 'pointer',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* rail */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 6,
            borderRadius: 3,
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
          }}
        />
        {/* filled */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            width: `${ratio * 100}%`,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${T.primary}, ${T.link})`,
          }}
        />
        {/* ticks */}
        {ticks.map((tk) => {
          const left = ((tk - 1) / (total - 1)) * 100;
          return (
            <Box
              key={tk}
              sx={{
                position: 'absolute',
                left: `${left}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '1px',
                height: 10,
                bgcolor: T.borderSub,
                pointerEvents: 'none',
              }}
            />
          );
        })}
        {/* handle */}
        <Box
          sx={{
            position: 'absolute',
            left: `${ratio * 100}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 16,
            height: 22,
            borderRadius: '5px',
            bgcolor: active ? T.link : T.textDim,
            border: `2px solid ${T.bgPanel}`,
            boxShadow: `0 0 0 1px ${active ? T.link : T.border}, 0 3px 8px rgba(0,0,0,0.5)`,
            transition: dragSeq !== null ? 'none' : 'left .1s ease-out',
            pointerEvents: 'none',
          }}
        />
        {/* frame bubble while dragging */}
        {dragSeq !== null && (
          <Box
            sx={{
              position: 'absolute',
              left: `${ratio * 100}%`,
              top: -2,
              transform: 'translate(-50%, -100%)',
              px: 0.75,
              py: '2px',
              bgcolor: T.link,
              color: T.bg,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: FONT_MONO,
              borderRadius: '4px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {dragSeq}
          </Box>
        )}
      </Box>

      {/* Step forward */}
      <NavStep dir="next" onClick={() => step(1)} disabled={!active || current >= total} />

      {/* Readout */}
      <Typography
        sx={{
          fontSize: 14,
          color: T.textSec,
          fontFamily: FONT_MONO,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          minWidth: 88,
          textAlign: 'right',
        }}
      >
        {pos} / {total > 1 ? total : '—'}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

function NavStep({
  dir,
  onClick,
  disabled,
}: {
  dir: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}) {
  const d = dir === 'prev' ? 'M10 4 L6 8 L10 12' : 'M6 4 L10 8 L6 12';
  return (
    <Box
      component="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      sx={{
        flexShrink: 0,
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${T.border}`,
        bgcolor: T.bgCard,
        borderRadius: '6px',
        color: T.textSec,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': disabled ? undefined : { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      <Box component="svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d={d}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
    </Box>
  );
}
