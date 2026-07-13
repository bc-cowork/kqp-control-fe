'use client';

import type { DataFlowDefinition } from 'src/components/data-flow';

import useSWR from 'swr';
import SyntaxHighlighter from 'react-syntax-highlighter';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { PageShell, DataTable } from 'src/components/v5';
import { DataFlowCanvas, DataFlowJsonEditor, TestEnvironmentModal } from 'src/components/data-flow';

// .moon (YAML) syntax palette — mirrors the reference CodeBlock `theme="moon"`
// (Monokai-family tokens: text #f8f8f2, keys #ffa07a, strings #abe338, nums #f5ab35).
const MOON_HLJS_STYLE: Record<string, React.CSSProperties> = {
  hljs: { display: 'block', overflowX: 'auto', background: 'transparent', color: '#f8f8f2' },
  'hljs-attr': { color: '#ffa07a' },
  'hljs-string': { color: '#abe338' },
  'hljs-number': { color: '#f5ab35' },
  'hljs-literal': { color: '#f5ab35' },
  'hljs-keyword': { color: '#ffa07a' },
  'hljs-bullet': { color: '#f8f8f2' },
};

const demoLayoutDefinifinition: DataFlowDefinition = {
  KSKQ_def: {
    desc: '구조화증권 기본/기타 라우터',
    recv2r: [216, 224, 225, 226, 230, 238, 239, 261, 260],
    actions: [
      {
        act: 'log',
        param: {
          to: 'rcv0',
        },
      },
      {
        act: 'route',
        param: {
          to: 'KSKQ_def_emit',
        },
      },
      {
        act: 'kpass',
        param: {
          app: 'kqp',
          inst: '1',
          fnid: 10,
        },
      },
    ],
  },
  KSKQ_def_emit: {
    desc: '구조화증권 기본/기타 송출',
    actions: [
      {
        act: 'destinate',
        param: {
          rule: 'route_map',
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'dist0',
        },
      },
    ],
  },
  'kqp.1': {
    desc: '통합시세 기본',
    actions: [],
  },
  KS_q: {
    desc: 'KOSPI 주식 호가',
    recv2r: [222, 223, 258],
    actions: [
      {
        act: 'log',
        param: {
          to: 'rcv0',
        },
      },
      {
        act: 'route',
        param: {
          to: 'KS_q_emit',
        },
      },
      {
        act: 'kpass',
        param: {
          app: 'kqp',
          inst: 'ksp_q',
          fnid: 10,
        },
      },
      {
        act: 'route',
        param: {
          to: 'KS_q_qos',
        },
      },
    ],
  },
  KS_q_emit: {
    desc: 'KOSPI 주식 호가 송출',
    actions: [
      {
        act: 'destinate',
        param: {
          rule: 'route_map',
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'dist0',
        },
      },
    ],
  },
  KS_q_qos: {
    desc: 'KOSPI 주식 호가 QoS',
    actions: [
      {
        act: 'qos',
        param: {
          rule: 'qos_wrsec',
          time_ms: 200,
          head: 'B6',
        },
      },
      {
        act: 'destinate',
        param: {
          rule: 'rtm_code_route',
          offset: [18, 12],
          dest: [2611, 2612, 2613, 2614, 2615],
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'qos',
        },
      },
    ],
  },
  'kqp.ksp_q': {
    desc: '통합시세 KOSPI 호가',
    actions: [],
  },
  KS_f: {
    desc: 'KOSPI 주식 체결',
    recv2r: [217, 218, 219, 220, 221, 256],
    actions: [
      {
        act: 'log',
        param: {
          to: 'rcv0',
        },
      },
      {
        act: 'route',
        param: {
          to: 'KS_f_emit',
        },
      },
      {
        act: 'kpass',
        param: {
          app: 'kqp',
          inst: 'ksp_f',
          fnid: 10,
        },
      },
      {
        act: 'route',
        param: {
          to: 'KS_f_qos',
        },
      },
    ],
  },
  KS_f_emit: {
    desc: 'KOSPI 주식 체결 송출',
    actions: [
      {
        act: 'destinate',
        param: {
          rule: 'route_map',
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'dist0',
        },
      },
    ],
  },
  KS_f_qos: {
    desc: 'KOSPI 주식 체결 QoS',
    actions: [
      {
        act: 'qos',
        param: {
          rule: 'qos_wrsec_A3',
          time_ms: 200,
        },
      },
      {
        act: 'destinate',
        param: {
          rule: 'rtm_code_route',
          offset: [18, 12],
          dest: [2621, 2622, 2623, 2624, 2625],
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'qos',
        },
      },
    ],
  },
  'kqp.ksp_f': {
    desc: '통합시세 KOSPI 체결',
    actions: [],
  },
  KQ_q: {
    desc: 'KOSDAQ 주식 호가',
    recv2r: [236, 237, 259],
    actions: [
      {
        act: 'log',
        param: {
          to: 'rcv0',
        },
      },
      {
        act: 'route',
        param: {
          to: 'KQ_q_emit',
        },
      },
      {
        act: 'kpass',
        param: {
          app: 'kqp',
          inst: 'ksq_q',
          fnid: 10,
        },
      },
      {
        act: 'route',
        param: {
          to: 'KQ_q_qos',
        },
      },
    ],
  },
  KQ_q_emit: {
    desc: 'KOSDAQ 주식 호가 송출',
    actions: [
      {
        act: 'destinate',
        param: {
          rule: 'route_map',
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'dist0',
        },
      },
    ],
  },
  KQ_q_qos: {
    desc: 'KOSDAQ 주식 호가 QoS',
    actions: [
      {
        act: 'qos',
        param: {
          rule: 'qos_wrsec',
          time_ms: 200,
          head: 'B6',
        },
      },
      {
        act: 'destinate',
        param: {
          rule: 'rtm_code_route',
          offset: [18, 12],
          dest: [2651, 2652, 2653, 2654, 2655],
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'qos',
        },
      },
    ],
  },
  'kqp.ksq_q': {
    desc: '통합시세 KOSDAQ 호가',
    actions: [],
  },
  KQ_f: {
    desc: 'KOSDAQ 주식 체결',
    recv2r: [231, 232, 233, 234, 235, 257],
    actions: [
      {
        act: 'log',
        param: {
          to: 'rcv0',
        },
      },
      {
        act: 'route',
        param: {
          to: 'KQ_f_emit',
        },
      },
      {
        act: 'kpass',
        param: {
          app: 'kqp',
          inst: 'ksq_f',
          fnid: 10,
        },
      },
      {
        act: 'route',
        param: {
          to: 'KQ_f_qos',
        },
      },
    ],
  },
  KQ_f_emit: {
    desc: 'KOSDAQ 주식 체결 송출',
    actions: [
      {
        act: 'destinate',
        param: {
          rule: 'route_map',
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'dist0',
        },
      },
    ],
  },
  KQ_f_qos: {
    desc: 'KOSDAQ 주식 체결 QoS',
    actions: [
      {
        act: 'qos',
        param: {
          rule: 'qos_wrsec_A3',
          time_ms: 200,
        },
      },
      {
        act: 'destinate',
        param: {
          rule: 'rtm_code_route',
          offset: [18, 12],
          dest: [2661, 2662, 2663, 2664, 2665],
        },
      },
      {
        act: 'modify',
        param: {
          rule: 'wrsec1',
        },
      },
      {
        act: 'emit',
        param: {},
      },
      {
        act: 'log',
        param: {
          to: 'qos',
        },
      },
    ],
  },
  'kqp.ksq_f': {
    desc: '통합시세 KOSDAQ 체결',
    actions: [],
  },
  relations: {
    KSKQ_def: {
      to: ['KSKQ_def_emit', 'kqp.1'],
    },
    KS_q: {
      to: ['KS_q_emit', 'kqp.ksp_q', 'KS_q_qos'],
    },
    KS_f: {
      to: ['KS_f_emit', 'kqp.ksp_f', 'KS_f_qos'],
    },
    KQ_q: {
      to: ['KQ_q_emit', 'kqp.ksq_q', 'KQ_q_qos'],
    },
    KQ_f: {
      to: ['KQ_f_emit', 'kqp.ksq_f', 'KQ_f_qos'],
    },
  },
};

const demoJSONValue = JSON.stringify(demoLayoutDefinifinition, null, 2);

type Props = {
  params: {
    node: string;
    layout: string;
  };
};

export default function Page({ params }: Props) {
  const router = useRouter();
  const { node, layout } = params;
  const { t } = useTranslate('layout-list');
  const { t: tFlow } = useTranslate('data-flow');
  const decodedLayout = decodeURIComponent(layout);
  const testEnvModal = useBoolean();

  const url = endpoints.layouts.detail(node, decodedLayout);
  const { data, isLoading, error } = useSWR(url, fetcher);

  const layoutItem = data?.data?.detail || {};
  const layoutEmpty = data?.data?.detail == null;
  const layoutDefinition = data?.data?.layout_definition || '';
  const apiDataFlowDef = data?.data?.data_flow_definition || null;

  // State for JSON editor text and parsed definition
  const [jsonValue, setJsonValue] = useState(demoJSONValue);
  const [dataFlowDefinition, setDataFlowDefinition] = useState<DataFlowDefinition | null>(
    demoLayoutDefinifinition
  );

  // Initialize from API data
  useEffect(() => {
    if (apiDataFlowDef) {
      setJsonValue(JSON.stringify(apiDataFlowDef, null, 2));
      setDataFlowDefinition(apiDataFlowDef);
    }
  }, [apiDataFlowDef]);

  // Handle JSON editor changes — update text immediately, debounce graph rebuild
  const parseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleJsonChange = useCallback((val: string) => {
    clearTimeout(parseTimerRef.current);
    parseTimerRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(val) as DataFlowDefinition;
        setDataFlowDefinition(parsed);
      } catch {
        // Invalid JSON — keep current graph, user is still typing
      }
    }, 1000);
  }, []);

  // Copy the .moon layout definition to the clipboard (mirrors DataFlowJsonEditor)
  const handleCopyMoon = useCallback(() => {
    const text = layoutDefinition;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }, [layoutDefinition]);

  return (
    <PageShell
      node={node}
      crumbs={[
        {
          label: t('top.layout_list'),
          onClick: () => router.push(paths.dashboard.nodes.layoutList(node)),
        },
        { label: decodedLayout },
      ]}
      title={`${t('top.title_prefix')} : ${decodedLayout}`}
      actions={
        dataFlowDefinition ? (
          <Button
            disableRipple
            onClick={testEnvModal.onTrue}
            sx={{
              height: 32,
              px: '14px',
              minWidth: 0,
              background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`,
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              color: ACCENT2,
              fontSize: 15,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { background: `linear-gradient(to top, ${ACCENT2}77, ${ACCENT2}22)` },
            }}
          >
            {tFlow('toolbar.test_env')}
          </Button>
        ) : undefined
      }
    >
      {/* Layout Detail (single-row summary table) — normal flow, scrolls away.
          flexShrink: 0 is required — PageShell's body is a fixed-height flex column,
          and DataTable (minHeight: 0, overflow: auto) collapses to a sliver without it. */}
      <Box sx={{ flexShrink: 0 }}>
        <DataTable
          headerVariant="light"
          bodyWeight={300}
          headerWeight={400}
          headerSize={17}
          columns={[
            { key: 'name', label: t('detail_table.layout_name'), color: T.primary },
            { key: 'path', label: t('detail_table.path'), dim: true },
            { key: 'timestamp', label: t('detail_table.timestamp'), dim: true },
            { key: 'process', label: t('detail_table.process'), color: T.textSec },
            { key: 'channel_in', label: t('detail_table.channel_in'), color: T.textSec },
            { key: 'desc', label: t('detail_table.description'), grow: true, dim: true },
          ]}
          rows={layoutEmpty ? [] : [layoutItem]}
          loading={isLoading}
          error={!!error}
          emptyLabel={t('detail_table.empty')}
        />
      </Box>

      {/* Data Flow Visualization */}
      {/* flexShrink: 0 on all sections below — PageShell's body is a fixed-height
          flex column, so any child without it gets compressed to fit the viewport */}
      {dataFlowDefinition && (
        <Box sx={{ mb: 3, flexShrink: 0 }}>
          <DataFlowCanvas definition={dataFlowDefinition} fileName={`${decodedLayout}.moon`} />
        </Box>
      )}

      {/* JSON Definition Editor */}
      {jsonValue && (
        <Box sx={{ mb: 3, flexShrink: 0 }}>
          <DataFlowJsonEditor value={jsonValue} onChange={handleJsonChange} />
        </Box>
      )}

      {/* Layout Definition (.moon) — section label + Monokai/moon code block */}
      <Box
        sx={{
          mb: 3,
          flexShrink: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          border: `1px solid ${T.border}`,
        }}
      >
        {/* Header bar — matches Data Flow / JSON Definition (with copy button) */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ p: 1.5, backgroundColor: T.bgPanel, borderBottom: `1px solid ${T.border}` }}
        >
          <Typography
            sx={{ flex: 1, fontSize: 17, fontWeight: 400, lineHeight: '22.5px', color: T.textSec }}
          >
            {t('detail_table.script_title')}
          </Typography>
          <IconButton
            onClick={handleCopyMoon}
            size="small"
            sx={{ color: T.textSec, '&:hover': { color: T.textPrim } }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.1333 5.33346C4.1333 4.67072 4.67056 4.13346 5.3333 4.13346H12.8C13.4627 4.13346 14 4.67072 14 5.33346V12.8001C14 13.4629 13.4627 14.0001 12.8 14.0001H5.3333C4.67056 14.0001 4.1333 13.4629 4.1333 12.8001V5.33346ZM5.3333 5.20013C5.25966 5.20013 5.19997 5.25983 5.19997 5.33346V12.8001C5.19997 12.8738 5.25966 12.9335 5.3333 12.9335H12.8C12.8736 12.9335 12.9333 12.8738 12.9333 12.8001V5.33346C12.9333 5.25982 12.8736 5.20013 12.8 5.20013H5.3333Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.00049 3.2C2.00049 2.53726 2.53775 2 3.20049 2H12.1333C12.4279 2 12.6666 2.23878 12.6666 2.53333C12.6666 2.82789 12.4279 3.06667 12.1333 3.06667H3.20049C3.12685 3.06667 3.06715 3.12636 3.06715 3.2V12.1335C3.06715 12.428 2.82837 12.6668 2.53382 12.6668C2.23927 12.6668 2.00049 12.428 2.00049 12.1335V3.2Z"
                fill="currentColor"
              />
            </svg>
          </IconButton>
        </Stack>
        <Box
          sx={{
            backgroundColor: T.bgCard,
            overflow: 'auto',
            maxHeight: 480,
            p: '16px 18px',
          }}
        >
          <SyntaxHighlighter
            language="yaml"
            style={MOON_HLJS_STYLE}
            customStyle={{
              background: 'transparent',
              margin: 0,
              padding: 0,
              fontFamily: FONT_MONO,
              fontSize: 15.5,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}
            codeTagProps={{ style: { fontFamily: FONT_MONO } }}
          >
            {layoutDefinition}
          </SyntaxHighlighter>
        </Box>
      </Box>

      {/* Test Environment Modal */}
      {dataFlowDefinition && (
        <TestEnvironmentModal
          open={testEnvModal.value}
          onClose={testEnvModal.onFalse}
          definition={dataFlowDefinition}
          fileName={`${decodedLayout}.moon`}
          layoutDefinition={layoutDefinition}
          node={node}
          layout={decodedLayout}
        />
      )}
    </PageShell>
  );
}
