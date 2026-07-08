'use client';

import type { ReactNode } from 'react';

import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import SyntaxHighlighter from 'react-syntax-highlighter';
// eslint-disable-next-line import/no-extraneous-dependencies
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { KIcon } from 'src/components/k-icons';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { T, ACCENT2, SPEC_CHIP, FONT_MONO } from 'src/theme/tokens';

// ----------------------------------------------------------------------
// PageShell — breadcrumb + title + body (every screen wrapper)
// ----------------------------------------------------------------------

export type Crumb = { label: string; onClick?: () => void };

type PageShellProps = {
  node?: string;
  crumbs?: Crumb[];
  title: ReactNode;
  actions?: ReactNode;
  scroll?: boolean;
  children: ReactNode;
};

export function PageShell({ node, crumbs = [], title, actions, scroll = true, children }: PageShellProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        animation: 'fadeUp .25s ease both',
      }}
    >
      {(node || crumbs.length > 0) && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 3, pt: 2.75, fontSize: 15, lineHeight: 1 }}>
          {node && (
            <>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: T.on, boxShadow: `0 0 5px ${T.on}99` }} />
              <Typography sx={{ color: T.textPrim, fontSize: 15 }}>{node}</Typography>
            </>
          )}
          {crumbs.map((c, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={1}>
              <Box sx={{ color: T.textDim, display: 'flex' }}>
                <KIcon name="fwd" size={11} />
              </Box>
              <Typography
                onClick={c.onClick}
                sx={{
                  color: T.textSec,
                  fontSize: 15,
                  cursor: c.onClick ? 'pointer' : 'default',
                  '&:hover': c.onClick ? { color: ACCENT2 } : undefined,
                }}
              >
                {c.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, color: T.textPrim }}>
          {title}
        </Typography>
        {actions}
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.75,
          px: 3,
          pb: 2.5,
          overflow: scroll ? 'auto' : 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// DataTable
// ----------------------------------------------------------------------

export type Column<R = any> = {
  key: string;
  label: ReactNode;
  align?: 'left' | 'right' | 'center';
  mono?: boolean;
  dim?: boolean;
  grow?: boolean;
  width?: number;
  color?: string;
  weight?: number;
  render?: (row: R, index: number) => ReactNode;
};

type DataTableProps<R = any> = {
  columns: Column<R>[];
  rows: R[];
  dense?: boolean;
  headerVariant?: 'default' | 'light';
  flush?: boolean;
  bodyWeight?: number;
  selectedIndex?: number | null;
  onRowClick?: (row: R, index: number) => void;
  loading?: boolean;
  error?: boolean;
  emptyLabel?: string;
  maxHeight?: number | string;
};

export function DataTable<R = any>({
  columns,
  rows,
  dense,
  headerVariant = 'default',
  flush,
  bodyWeight = 300,
  selectedIndex = null,
  onRowClick,
  loading,
  error,
  emptyLabel = 'No data',
  maxHeight,
}: DataTableProps<R>) {
  const light = headerVariant === 'light';
  const showPlaceholder = loading || error || rows.length === 0;
  const placeholderText = loading ? 'Loading…' : error ? 'Failed to load' : emptyLabel;

  return (
    <Box
      sx={{
        border: flush ? 'none' : `1px solid ${T.border}`,
        borderRadius: flush ? 0 : '6px',
        bgcolor: T.bgCard,
        overflow: 'auto',
        minHeight: 0,
        maxHeight,
      }}
    >
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, lineHeight: 1.2 }}>
        <Box component="thead">
          <Box component="tr">
            {columns.map((col) => (
              <Box
                key={col.key}
                component="th"
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  bgcolor: T.bgPanel,
                  color: T.textSec,
                  fontWeight: 500,
                  textAlign: col.align || 'left',
                  p: dense ? '12px 12px' : '11px 14px',
                  borderBottom: `1px solid ${T.border}`,
                  whiteSpace: 'nowrap',
                  fontSize: 16,
                  textTransform: light ? 'none' : 'uppercase',
                  letterSpacing: light ? 0 : '0.05em',
                  width: col.width,
                }}
              >
                {col.label}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {showPlaceholder ? (
            <Box component="tr">
              <Box
                component="td"
                colSpan={columns.length}
                sx={{ p: '28px 14px', textAlign: 'center', color: error ? T.off : T.textDim, fontSize: 15 }}
              >
                {placeholderText}
              </Box>
            </Box>
          ) : (
            rows.map((row, ri) => {
              const selected = selectedIndex === ri;
              return (
                <Box
                  key={ri}
                  component="tr"
                  onClick={onRowClick ? () => onRowClick(row, ri) : undefined}
                  sx={{
                    borderBottom: `1px solid ${T.borderSub}`,
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background .12s',
                    bgcolor: selected ? T.bgRowSel : 'transparent',
                    '&:hover': { bgcolor: selected ? T.bgRowSel : T.bgHover },
                  }}
                >
                  {columns.map((col, ci) => {
                    const raw = (row as any)[col.key];
                    return (
                      <Box
                        key={col.key}
                        component="td"
                        sx={{
                          p: dense ? '12px' : '10px 14px',
                          textAlign: col.align || 'left',
                          fontFamily: col.mono ? FONT_MONO : 'inherit',
                          fontWeight: col.weight ?? bodyWeight,
                          color: col.color || (col.dim ? T.textSec : T.textPrim),
                          whiteSpace: col.grow ? 'normal' : 'nowrap',
                          maxWidth: col.grow ? 380 : undefined,
                          overflow: col.grow ? 'hidden' : undefined,
                          textOverflow: col.grow ? 'ellipsis' : undefined,
                          boxShadow: selected && ci === 0 ? `inset 2px 0 0 0 ${T.primary}` : undefined,
                        }}
                      >
                        {col.render ? col.render(row, ri) : (raw ?? '—')}
                      </Box>
                    );
                  })}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// StatCard / SummaryCard
// ----------------------------------------------------------------------

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box sx={{ flex: 1, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', p: '14px 18px', position: 'relative', overflow: 'hidden' }}>
      <Typography sx={{ fontSize: 15, color: T.textSec, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.25 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 34, fontWeight: 400, letterSpacing: '-0.03em', fontFamily: FONT_MONO, color: T.textPrim }}>
        {value}
      </Typography>
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, bgcolor: T.primary, opacity: 0.35 }} />
    </Box>
  );
}

export function SummaryCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box sx={{ flex: 1, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', p: '14px 16px', position: 'relative', overflow: 'hidden' }}>
      <Typography sx={{ fontSize: 15, color: ACCENT2, fontWeight: 500, letterSpacing: '0.05em', mb: 1.5 }}>{label}</Typography>
      <Typography sx={{ fontSize: 46, fontWeight: 400, letterSpacing: '-0.03em', color: T.textPrim, lineHeight: 1 }}>{value}</Typography>
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: `linear-gradient(to top, ${ACCENT2}22, transparent)` }} />
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, bgcolor: ACCENT2, opacity: 0.4 }} />
    </Box>
  );
}

// ----------------------------------------------------------------------
// StatusBadge
// ----------------------------------------------------------------------

export function StatusBadge({ on, labelOn = 'active', labelOff = 'inactive', color, fontSize = 14 }: { on: boolean; labelOn?: string; labelOff?: string; color?: string; fontSize?: number }) {
  const c = color || (on ? T.on : T.off);
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625, fontSize, fontWeight: 300, px: 1, py: '2px', borderRadius: '3px', letterSpacing: '0.03em', color: c }}>
      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'currentColor' }} />
      {on ? labelOn : labelOff}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Buttons
// ----------------------------------------------------------------------

type BtnProps = {
  children: ReactNode;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

const btnBase = {
  height: 30,
  border: 'none',
  borderRadius: '5px',
  px: 1.75,
  fontSize: 15,
  fontWeight: 500,
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  cursor: 'pointer',
  transition: 'background .12s, color .12s',
} as const;

export function BtnPrimary({ children, icon, onClick, disabled, type = 'button' }: BtnProps) {
  return (
    <Box component="button" type={type} onClick={onClick} disabled={disabled} sx={{ ...btnBase, bgcolor: T.primary, color: '#fff', '&:hover': { bgcolor: T.primaryHov }, '&:disabled': { bgcolor: '#373F4E', color: '#667085', cursor: 'default' } }}>
      {icon && <Iconify icon={icon} width={15} />}
      {children}
    </Box>
  );
}

export function BtnGhost({ children, icon, onClick, disabled, type = 'button' }: BtnProps) {
  return (
    <Box component="button" type={type} onClick={onClick} disabled={disabled} sx={{ ...btnBase, bgcolor: T.bgCard, border: `1px solid ${T.border}`, color: T.textSec, '&:hover': { bgcolor: T.bgHover, color: T.textPrim }, '&:disabled': { bgcolor: '#373F4E', color: '#667085', cursor: 'default' } }}>
      {icon && <Iconify icon={icon} width={15} />}
      {children}
    </Box>
  );
}

export function BtnDanger({ children, icon, onClick, disabled, type = 'button' }: BtnProps) {
  return (
    <Box component="button" type={type} onClick={onClick} disabled={disabled} sx={{ ...btnBase, fontSize: 14, bgcolor: T.off, color: '#fff', '&:hover': { opacity: 0.9 }, '&:disabled': { bgcolor: '#373F4E', color: '#667085', cursor: 'default' } }}>
      {icon && <Iconify icon={icon} width={15} />}
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------
// FilterField (labeled dropdown)
// ----------------------------------------------------------------------

type FilterFieldProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  width?: number;
  accent?: string;
};

export function FilterField({ label, value, options, onChange, width = 180, accent = T.primary }: FilterFieldProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = !!anchor;
  const selected = options.find((o) => o.value === value);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography sx={{ fontSize: 14, color: T.textDim }}>{label}</Typography>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          height: 32,
          width,
          boxSizing: 'border-box',
          bgcolor: T.bgCard,
          border: `1px solid ${open ? accent : T.border}`,
          borderRadius: '5px',
          px: 1.25,
          fontSize: 15,
          fontFamily: FONT_MONO,
          color: T.textPrim,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        {selected?.label ?? value}
        <Iconify icon="eva:chevron-down-fill" width={16} sx={{ color: T.textSec, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </Box>
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: 0.5, width, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', boxShadow: '0 10px 28px rgba(0,0,0,0.4)', p: 0.5 } } }}
      >
        {options.map((o) => (
          <Box
            key={o.value}
            onClick={() => {
              onChange(o.value);
              setAnchor(null);
            }}
            sx={{
              p: '7px 10px',
              borderRadius: '4px',
              fontSize: 15,
              fontFamily: FONT_MONO,
              color: o.value === value ? accent : T.textPrim,
              bgcolor: o.value === value ? `${accent}1f` : 'transparent',
              cursor: 'pointer',
              '&:hover': { bgcolor: o.value === value ? `${accent}1f` : T.bgHover },
            }}
          >
            {o.label}
          </Box>
        ))}
      </Popover>
    </Box>
  );
}

// ----------------------------------------------------------------------
// SpecChip (tri-colour field chip)
// ----------------------------------------------------------------------

export function SpecChip({ tone, children }: { tone: 'green' | 'blue' | 'amber'; children: ReactNode }) {
  const c = SPEC_CHIP[tone];
  return (
    <Box component="span" sx={{ display: 'inline-block', px: 1.25, py: '2px', borderRadius: '5px', fontSize: 14, fontFamily: FONT_MONO, bgcolor: c.bg, color: c.text, border: `1px solid ${c.text}40` }}>
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Panel / SectionLabel
// ----------------------------------------------------------------------

export function Panel({ children, sx }: { children: ReactNode; sx?: object }) {
  return <Box sx={{ border: `1px solid ${T.border}`, borderRadius: '8px', bgcolor: T.bgPanel, overflow: 'hidden', ...sx }}>{children}</Box>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Typography sx={{ fontSize: 17, fontWeight: 500, color: T.textSec }}>{children}</Typography>;
}

// ----------------------------------------------------------------------
// CodeBlock (read-only, lightly tinted)
// ----------------------------------------------------------------------

export function CodeBlock({
  children,
  theme = 'moon',
  minHeight,
  fill,
  flush,
}: {
  children: string;
  theme?: 'moon' | 'default';
  minHeight?: number;
  fill?: boolean;
  flush?: boolean;
}) {
  // Single near-black surface with syntax-coloured tokens (matches the reference editors).
  // The inner highlighter is transparent so the container colour fills every pixel —
  // no lighter band beneath the last line.
  const bg = '#161420';
  const language = theme === 'moon' ? 'moonscript' : 'yaml';
  return (
    <Box
      sx={{
        border: flush ? 'none' : `1px solid ${T.border}`,
        borderRadius: flush ? 0 : '8px',
        overflow: 'auto',
        bgcolor: bg,
        minHeight,
        ...(fill && { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }),
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={a11yDark}
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '16px 18px',
          fontSize: 15.5,
          lineHeight: 1.7,
          ...(fill && { flex: 1, minHeight: '100%' }),
        }}
        codeTagProps={{ style: { fontFamily: FONT_MONO, background: 'transparent' } }}
      >
        {children}
      </SyntaxHighlighter>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Pager (AuditPagerBar)
// ----------------------------------------------------------------------

type PagerProps = {
  page: number; // 1-based
  totalPages: number;
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange?: (n: number) => void;
};

export function Pager({ page, totalPages, perPage, perPageOptions = [10, 20, 40, 60], onPageChange, onPerPageChange }: PagerProps) {
  const { t } = useTranslate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // window of page numbers
  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  for (let i = start; i <= Math.min(totalPages, start + 4); i += 1) pages.push(i);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '8px', p: '8px 14px' }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={{ fontSize: 14, color: T.textSec }}>{t('table.rows_per_page')}:</Typography>
        {onPerPageChange && (
          <>
            <Box
              onClick={(e) => setAnchor(e.currentTarget)}
              sx={{ height: 30, px: 1, display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: '5px', fontSize: 14, color: T.textPrim, cursor: 'pointer' }}
            >
              {perPage}
              <Iconify icon="eva:chevron-down-fill" width={14} sx={{ color: T.textSec }} />
            </Box>
            <Popover open={!!anchor} anchorEl={anchor} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { mt: 0.5, bgcolor: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', p: 0.5 } } }}>
              {perPageOptions.map((n) => (
                <Box key={n} onClick={() => { onPerPageChange(n); setAnchor(null); }} sx={{ px: 1.5, py: 0.75, borderRadius: '4px', fontSize: 14, color: n === perPage ? T.primary : T.textPrim, cursor: 'pointer', '&:hover': { bgcolor: T.bgHover } }}>
                  {n}
                </Box>
              ))}
            </Popover>
          </>
        )}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <PagerArrow icon="eva:arrowhead-left-fill" disabled={!canPrev} onClick={() => onPageChange(1)} />
        <PagerArrow icon="eva:arrow-ios-back-fill" disabled={!canPrev} onClick={() => onPageChange(page - 1)} />
        {pages.map((p) => (
          <Box
            key={p}
            onClick={() => onPageChange(p)}
            sx={{
              minWidth: 24,
              height: 24,
              px: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              fontSize: 14,
              cursor: 'pointer',
              bgcolor: p === page ? T.bgHover : 'transparent',
              color: p === page ? T.textPrim : T.textSec,
            }}
          >
            {p}
          </Box>
        ))}
        <PagerArrow icon="eva:arrow-ios-forward-fill" disabled={!canNext} onClick={() => onPageChange(page + 1)} />
        <PagerArrow icon="eva:arrowhead-right-fill" disabled={!canNext} onClick={() => onPageChange(totalPages)} />
      </Stack>
    </Stack>
  );
}

function PagerArrow({ icon, disabled, onClick }: { icon: string; disabled: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        bgcolor: 'transparent',
        borderRadius: '4px',
        color: T.textSec,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': disabled ? undefined : { bgcolor: T.bgHover, color: T.textPrim },
      }}
    >
      <Iconify icon={icon} width={16} />
    </Box>
  );
}
