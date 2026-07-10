import { T, FLOW } from 'src/theme/tokens';

// ----------------------------------------------------------------------
// Data-flow visual tokens — ported PIXEL-for-PIXEL from the k-control
// reference mockup (NodePages.jsx). Colours come from the v5 palette (T)
// and the FLOW.* graph tokens; no ad-hoc hex where a token exists.
// ----------------------------------------------------------------------

// Node dimensions (reference: proc 210, source 150, header 30 — kept scaled
// up ~1.3x to stay legible inside the ReactFlow viewport).
export const ENTITY_NODE_WIDTH = 288;
export const RECV_NODE_WIDTH = 200;
export const HEADER_HEIGHT = 39;

// Graph accent colours (reference FLOW.*)
export const PROC_GREEN = FLOW.procGreen; // #3FCF6B — processing node border/header
export const SRC_BLUE = FLOW.srcBlue; // #5B8DEF — source (recv) node border/count
export const ACT_FN = FLOW.actFn; // #56D364 — action function name
export const EDGE_COLOR = FLOW.edge; // #AFB7C8 — edges + recv channel text

// Processing (entity) node
export const ENTITY_NODE_WIDTH_PX = ENTITY_NODE_WIDTH;
export const ENTITY_NODE_BORDER = PROC_GREEN;
export const ENTITY_NODE_BG = T.bgCard; // #25212E
export const ENTITY_HEADER_BG = `linear-gradient(180deg, ${PROC_GREEN}26, ${PROC_GREEN}05)`;
export const ENTITY_HEADER_BORDER = `${PROC_GREEN}33`;

// Source (recv) node
export const RECV_NODE_BORDER = SRC_BLUE;
export const RECV_NODE_BG = T.bgCard;
export const RECV_HEADER_BG = T.bgCard;

// PMR badge (reference bg #C9C6F0 / text #2E2B52)
export const BADGE_BG = FLOW.pmrBadgeBg;
export const BADGE_TEXT = FLOW.pmrBadgeText;

// Action-row token colours (reference FlowNode)
export const ACTION_LABEL = '#C8CDD8'; // "act "
export const ACTION_FN = ACT_FN; // 'route'
export const ACTION_COMMA = '#6E7686'; // ,
export const ACTION_PARAM = '#AEB4C0'; // {params}
export const ACTION_COLOR = ACT_FN;
export const ACTION_GRAY = ACTION_PARAM;

// Connection dots / handles — reference draws small grey circles (fill bgCard,
// stroke #6E7686) at node edges.
export const HANDLE_STROKE = '#6E7686';
export const HANDLE_GRAY = HANDLE_STROKE;
export const HANDLE_GREEN = HANDLE_STROKE;
export const HANDLE_PURPLE = HANDLE_STROKE;

// Header / dividers
export const HEADER_BG = T.bgPanel;
export const HEADER_BORDER = ENTITY_HEADER_BORDER;

// Text tokens
export const TEXT_PRIMARY = T.textPrim; // #E9E6EF
export const TEXT_SECONDARY = T.textSec; // #A8AABA
export const TEXT_TERTIARY = T.textSec;
export const TEXT_DIM = T.textDim; // #6A6878

// Canvas
export const CANVAS_BG = FLOW.canvasBg; // #161420
export const GRID_LINE_COLOR = T.border; // #33343F — Border/Default (color guide; was bluish FLOW.grid #2A2552)
export const HELP_TEXT_COLOR = T.textDim; // #6A6878

// Layout spacing
export const X_GAP = 140;
export const Y_GAP = 40;

// Legacy aliases
export const NODE_WIDTH = ENTITY_NODE_WIDTH;
export const NODE_BODY_BG = T.bgCard;
