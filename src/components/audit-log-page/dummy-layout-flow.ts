import type { LayoutFlow } from 'src/types/api';

// ----------------------------------------------------------------------
// TEMPORARY: sample layout-flow payload provided by the backend dev.
// Used as a fallback until `apik/{node}/auditlog/frame` returns `data.layoutFlow`.
// Once the API ships the real field, this fallback is simply ignored.
// ----------------------------------------------------------------------

export const DUMMY_LAYOUT_FLOW: LayoutFlow = {
  layoutName: 'KOSPI_KOSDAQ',
  process: 'PMR',
  topic: 'inbound',
  matchedBy: {
    frameRid: 216,
    layoutNode: 'KSKQ_def',
    condition: 'frame.spec.rid is included in PMR.KSKQ_def.recv2r',
  },
  layoutSubset: {
    KSKQ_def: {
      desc: 'Structured securities default/other router',
      recv2r: [216, 224, 225, 226, 230, 238, 239, 261, 260],
      topics: {
        inbound: [
          { act: 'log', args: { to: 'rcv0' } },
          { act: 'route', args: { to: 'next_flow' } },
        ],
      },
    },
  },
  dataChanges: [
    {
      step: 1,
      layoutNode: 'KSKQ_def',
      action: 'log',
      args: { to: 'rcv0' },
      dataBefore: 'B601Q00004343G140...',
      dataAfter: 'B601Q00004343G140...',
      change: 'No payload change. The frame is only logged to rcv0.',
    },
    {
      step: 2,
      layoutNode: 'KSKQ_def',
      action: 'route',
      args: { to: 'next_flow' },
      dataBefore: 'B601Q00004343G140...',
      dataAfter: 'B601Q00004343G140...',
      change:
        'No payload change. The frame is routed to the next flow, but the next node details are not included in this data.',
    },
  ],
};
