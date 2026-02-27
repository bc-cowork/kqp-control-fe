import type { DataFlowEdgeType, DataFlowNodeType } from './types';

// ----------------------------------------------------------------------

export const NODE_TYPE_COLORS: Record<
  DataFlowNodeType,
  { border: string; bodyBg: string; badgeBg: string; actionHighlight: string }
> = {
  entity: {
    border: '#4A3BFF',
    bodyBg: '#212447',
    badgeBg: '#212447',
    actionHighlight: '#5E66FF',
  },
  recv: {
    border: '#4A3BFF',
    bodyBg: '#212447',
    badgeBg: '#212447',
    actionHighlight: '#5E66FF',
  },
  route: {
    border: '#00A41E',
    bodyBg: '#1D2F20',
    badgeBg: '#1D2F20',
    actionHighlight: '#4FCB53',
  },
  log: {
    border: '#FF3D4A',
    bodyBg: '#331B1E',
    badgeBg: '#331B1E',
    actionHighlight: '#FF5B5B',
  },
  emit: {
    border: '#C77F14',
    bodyBg: '#31291D',
    badgeBg: '#31291D',
    actionHighlight: '#C77F14',
  },
};

export const NODE_TYPE_LABELS: Record<DataFlowNodeType, string> = {
  entity: 'ENTITY',
  recv: 'RECV',
  route: 'ROUTE',
  log: 'LOG',
  emit: 'EMIT',
};

export const EDGE_COLORS: Record<DataFlowEdgeType, string> = {
  receive: '#4A3BFF',
  routing: '#00A41E',
  logging: '#FF3D4A',
  emit: '#C77F14',
};

export const NODE_WIDTHS: Record<DataFlowNodeType, number> = {
  entity: 333,
  recv: 333,
  route: 333,
  log: 148,
  emit: 148,
};

export const EMIT_NODE_HEIGHT = 47;

export const HEADER_BG = '#161C25';
export const HEADER_BORDER = '#373F4E';
export const TEXT_SECONDARY = '#E0E4EB';
export const TEXT_TERTIARY = '#D1D6E0';
export const TEXT_GRAY = '#AFB7C8';
export const CANVAS_BG = '#161C25';
export const GRID_LINE_COLOR = '#202838';

// Layout
export const X_GAP = 80;
export const Y_GAP = 40;
