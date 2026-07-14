'use client';

import { useRef, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { T, FONT_MONO } from 'src/theme/tokens';

// ----------------------------------------------------------------------
// TEST PAGE — timeline-drag frame navigation prototype (dummy data only).
// Route: /test-frame-timeline
// ----------------------------------------------------------------------

const TOTAL = 240; // dummy total frame count

const DESCS = [
  '데이터구분값',
  '정보구분값',
  '정보분배일련번호',
  '정보구분총종목수',
  '영업일자',
  '종목코드',
  '정보분배종목인덱스',
  '종목단축코드',
  '종목약명',
  '종목영문약명',
];

// Deterministic pseudo-data derived from the frame number (no randomness so
// dragging back and forth is stable).
function frameInfo(f: number) {
  const totalMs = 8 * 3600_000 + f * 47_137; // fake elapsed time
  const hh = String(Math.floor(totalMs / 3600_000) % 24).padStart(2, '0');
  const mm = String(Math.floor(totalMs / 60_000) % 60).padStart(2, '0');
  const ss = String(Math.floor(totalMs / 1000) % 60).padStart(2, '0');
  const size = 320 + ((f * 37) % 512);
  const rowCount = 4 + (f % 4);
  const rows = Array.from({ length: rowCount }, (_, i) => {
    const seed = (f * 13 + i * 7) % 997;
    return {
      id: i + 1,
      len: 2 + ((f + i) % 14),
      data: (seed * 31337).toString(16).toUpperCase().slice(0, 6).padStart(6, '0'),
      desc: DESCS[(f + i) % DESCS.length],
    };
  });
  return { seq: 8_088_000 + f, time: `08:13:${ss}.${hh}:${mm}`, size, rows };
}

export default function TestFrameTimelinePage() {
  const [frame, setFrame] = useState(1);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const ratio = (frame - 1) / (TOTAL - 1);
  const info = useMemo(() => frameInfo(frame), [frame]);

  const seekFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const r = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setFrame(Math.round(1 + r * (TOTAL - 1)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      seekFromClientX(e.clientX);
    },
    [seekFromClientX]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragging) seekFromClientX(e.clientX);
    },
    [dragging, seekFromClientX]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }, []);

  const step = useCallback((d: number) => {
    setFrame((f) => Math.min(TOTAL, Math.max(1, f + d)));
  }, []);

  // Major ticks every 30 frames.
  const ticks = useMemo(
    () => Array.from({ length: Math.floor(TOTAL / 30) + 1 }, (_, i) => i * 30 || 1),
    []
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: T.bg,
        color: T.textPrim,
        p: { xs: 3, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
          프레임 이동 — 타임라인 드래그 (프로토타입)
        </Typography>
        <Typography sx={{ fontSize: 14, color: T.textDim, mt: 0.5 }}>
          타임라인을 클릭하거나 핸들을 드래그해 프레임을 이동합니다. 더미 데이터 · 총 {TOTAL}개
          프레임.
        </Typography>
      </Box>

      {/* ============ Timeline ============ */}
      <Box
        sx={{
          bgcolor: T.bgPanel,
          border: `1px solid ${T.border}`,
          borderRadius: '10px',
          p: '22px 24px 30px',
        }}
      >
        {/* Current frame readout */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2.5 }}>
          <Typography sx={{ fontSize: 13, color: T.textDim }}>프레임</Typography>
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: T.link, fontFamily: FONT_MONO }}>
            {frame}
          </Typography>
          <Typography sx={{ fontSize: 14, color: T.textDim }}>/ {TOTAL}</Typography>
          <Box sx={{ flex: 1 }} />
          {/* fine-step buttons */}
          {[
            { label: '‹‹', d: -10 },
            { label: '‹', d: -1 },
            { label: '›', d: 1 },
            { label: '››', d: 10 },
          ].map((b) => (
            <Box
              key={b.label}
              component="button"
              onClick={() => step(b.d)}
              sx={{
                width: 34,
                height: 30,
                border: `1px solid ${T.border}`,
                bgcolor: T.bgCard,
                borderRadius: '6px',
                color: T.textSec,
                cursor: 'pointer',
                fontSize: 14,
                '&:hover': { bgcolor: T.bgHover, borderColor: T.textDim },
              }}
            >
              {b.label}
            </Box>
          ))}
        </Box>

        {/* Track */}
        <Box
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          sx={{
            position: 'relative',
            height: 44,
            display: 'flex',
            alignItems: 'center',
            cursor: dragging ? 'grabbing' : 'pointer',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          {/* base rail */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 8,
              borderRadius: 4,
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
              height: 8,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${T.primary}, ${T.link})`,
            }}
          />
          {/* ticks */}
          {ticks.map((tk) => {
            const left = ((tk - 1) / (TOTAL - 1)) * 100;
            return (
              <Box
                key={tk}
                sx={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '1px',
                  height: 14,
                  bgcolor: T.borderSub,
                  pointerEvents: 'none',
                }}
              />
            );
          })}
          {/* playhead thumb */}
          <Box
            sx={{
              position: 'absolute',
              left: `${ratio * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 18,
              height: 26,
              borderRadius: '6px',
              bgcolor: T.link,
              border: `2px solid ${T.bg}`,
              boxShadow: `0 0 0 1px ${T.link}, 0 4px 12px rgba(0,0,0,0.5)`,
              transition: dragging ? 'none' : 'left .08s ease-out',
              pointerEvents: 'none',
            }}
          />
          {/* frame bubble while dragging */}
          {dragging && (
            <Box
              sx={{
                position: 'absolute',
                left: `${ratio * 100}%`,
                top: -6,
                transform: 'translate(-50%, -100%)',
                px: 1,
                py: '2px',
                bgcolor: T.link,
                color: T.bg,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: FONT_MONO,
                borderRadius: '5px',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {frame}
            </Box>
          )}
        </Box>

        {/* tick labels */}
        <Box sx={{ position: 'relative', height: 16, mt: 0.5 }}>
          {ticks.map((tk) => {
            const left = ((tk - 1) / (TOTAL - 1)) * 100;
            return (
              <Typography
                key={tk}
                sx={{
                  position: 'absolute',
                  left: `${left}%`,
                  transform: 'translateX(-50%)',
                  fontSize: 11,
                  color: T.textFaint,
                  fontFamily: FONT_MONO,
                }}
              >
                {tk}
              </Typography>
            );
          })}
        </Box>
      </Box>

      {/* ============ Frame preview (dummy) ============ */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* info */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            bgcolor: T.bgPanel,
            border: `1px solid ${T.border}`,
            borderRadius: '10px',
            p: '18px 20px',
          }}
        >
          <Typography sx={{ fontSize: 15, color: T.textSec, mb: 1.5 }}>프레임 정보</Typography>
          {[
            ['프레임 번호', String(info.seq)],
            ['시간', info.time],
            ['크기', `${info.size} B`],
            ['채널', '1'],
          ].map(([k, v]) => (
            <Box key={k} sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: 13, color: T.textDim }}>{k}</Typography>
              <Typography sx={{ fontSize: 16, fontFamily: FONT_MONO, mt: 0.25 }}>{v}</Typography>
            </Box>
          ))}
        </Box>

        {/* mini data table */}
        <Box
          sx={{
            flex: 1,
            minWidth: 320,
            bgcolor: T.bgPanel,
            border: `1px solid ${T.border}`,
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${T.border}`,
              color: T.textSec,
              fontSize: 14,
            }}
          >
            <Box sx={{ width: 48 }}>ID</Box>
            <Box sx={{ width: 64 }}>Len</Box>
            <Box sx={{ width: 120 }}>Data</Box>
            <Box sx={{ flex: 1 }}>설명</Box>
          </Box>
          {info.rows.map((r) => (
            <Box
              key={r.id}
              sx={{
                display: 'flex',
                px: 2,
                py: 1,
                borderBottom: `1px solid ${T.borderSub}`,
                fontSize: 14,
                fontFamily: FONT_MONO,
              }}
            >
              <Box sx={{ width: 48, color: T.textDim }}>{r.id}</Box>
              <Box sx={{ width: 64, color: T.textDim }}>{r.len}</Box>
              <Box sx={{ width: 120, color: T.link }}>{r.data}</Box>
              <Box sx={{ flex: 1, color: T.textSec, fontFamily: 'inherit' }}>{r.desc}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
