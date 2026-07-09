// ----------------------------------------------------------------------
// Design tokens — ported from k-control-fe-ui (ACTIVE palette "v5", mauve-dark).
// The app is dark-only; these are the single source of truth for the new design.
// Use `T.*` directly in redesigned screens (mirrors the reference mockup).
// ----------------------------------------------------------------------

export const T = {
  brand: '#4A3BFF', // logo indigo
  primary: '#4A3BFF', // main action / buttons / active leaf nav / selection accent
  primaryHov: '#5344FF', // button hover
  primaryMuted: '#5344FF', // selected-state input border
  link: '#9384FF', // bright indigo (= ACCENT2) for clickable name links in tables
  secondary: '#4A3BFF',
  deep: '#494453', // mauve — active (expandable/parent) menu background
  accent: '#4A3BFF', // link / highlight

  bg: '#161420', // app canvas
  bgPanel: '#1E1B27', // top bar, sidebar, right panel, table header, login card
  bgCard: '#25212E', // cards, inputs, tiles, dropdowns, table body
  bgHover: '#2E2A3A', // hover backgrounds / sub-boxes
  bgRowSel: '#4A3BFF26', // selected table row / unread notification bg

  border: '#33343F', // primary borders / grid lines
  borderSub: '#2A2632', // subtle inner dividers

  textPrim: '#E9E6EF', // primary text
  textSec: '#A8AABA', // secondary text (lavender-grey)
  textDim: '#6A6878', // dim text / labels
  textFaint: '#55536A', // faintest — placeholders
  onFill: '#C8D2E0', // text on indigo fill

  on: '#35C28A', // success / ON green
  onBg: '#12372866',
  off: '#FF5C6A', // danger / OFF / alert red
  offBg: '#3A1A1F66',
  offline: '#7E7C8E', // offline node grey
  offlineBg: '#2E2A3A66',

  ramp: ['#4A3BFF', '#4A3BFF', '#4A3BFF', '#8B84A0', '#AFB7C8'],
} as const;

// ----------------------------------------------------------------------
// Non-palette literals used pervasively across the reference design.
// These are intentional hard-coded values, not derived from T.
// ----------------------------------------------------------------------

// Lighter lavender-indigo — a first-class parallel accent (abnormal counts,
// alert dots, replay UI, summary-card labels/glow). Hardcode everywhere.
export const ACCENT2 = '#9384FF';
export const ACCENT2_FILL = '#9384FF22';
export const ACCENT2_BORDER = '#9384FF44';
export const ACCENT2_GLOW = '#9384FF99';

// Chart series colours (literal, not tokens).
export const CHART = {
  cpu: '#4A3BFF',
  memory: '#7A6CFF',
  inbound: '#9C8FE8',
  outbound: '#BDB4DA',
  threshold: '#D9A441', // amber dashed reference line
  axis: '#4B5563', // sparkline micro-labels
  grid: '#33343F',
};

// specChip tri-colour system — shared by SPEC field tables and audit frame
// fragment tables. { bg, text } pairs; chip border is `${text}40`.
export const SPEC_CHIP = {
  green: { bg: '#1D2F20', text: '#7EE081' }, // offset / ID
  blue: { bg: '#1D2654', text: '#7AA2FF' }, // length / Len
  amber: { bg: '#31291D', text: '#FFC711' }, // type / Data
};

// Data-flow graph (layout detail) constants.
export const FLOW = {
  procGreen: '#3FCF6B',
  srcBlue: '#5B8DEF',
  actFn: '#56D364',
  edge: '#AFB7C8',
  grid: '#2A2552',
  canvasBg: '#161420',
  pmrBadgeBg: '#C9C6F0',
  pmrBadgeText: '#2E2B52',
};

export const FONT_MONO = "'Roboto Variable', Roboto, monospace";
export const FONT_CODE = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

export type Tokens = typeof T;
