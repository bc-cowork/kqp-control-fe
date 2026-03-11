"use client";

import type { DataFlowDefinition } from 'src/components/data-flow';

import useSWR from 'swr';
import SyntaxHighlighter from 'react-syntax-highlighter';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import { Table, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DataFlowCanvas, DataFlowJsonEditor, TestEnvironmentModal } from 'src/components/data-flow';

const demoLayoutDefinifinition: DataFlowDefinition = {
  "KSKQ_def": {
    "desc": "구조화증권 기본/기타 라우터",
    "recv2r": [
      216,
      224,
      225,
      226,
      230,
      238,
      239,
      261,
      260
    ],
    "actions": [
      {
        "act": "log",
        "param": {
          "to": "rcv0"
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KSKQ_def_emit"
        }
      },
      {
        "act": "kpass",
        "param": {
          "app": "kqp",
          "inst": "1",
          "fnid": 10
        }
      }
    ]
  },
  "KSKQ_def_emit": {
    "desc": "구조화증권 기본/기타 송출",
    "actions": [
      {
        "act": "destinate",
        "param": {
          "rule": "route_map"
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "dist0"
        }
      }
    ]
  },
  "kqp.1": {
    "desc": "통합시세 기본",
    "actions": []
  },
  "KS_q": {
    "desc": "KOSPI 주식 호가",
    "recv2r": [
      222,
      223,
      258
    ],
    "actions": [
      {
        "act": "log",
        "param": {
          "to": "rcv0"
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KS_q_emit"
        }
      },
      {
        "act": "kpass",
        "param": {
          "app": "kqp",
          "inst": "ksp_q",
          "fnid": 10
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KS_q_qos"
        }
      }
    ]
  },
  "KS_q_emit": {
    "desc": "KOSPI 주식 호가 송출",
    "actions": [
      {
        "act": "destinate",
        "param": {
          "rule": "route_map"
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "dist0"
        }
      }
    ]
  },
  "KS_q_qos": {
    "desc": "KOSPI 주식 호가 QoS",
    "actions": [
      {
        "act": "qos",
        "param": {
          "rule": "qos_wrsec",
          "time_ms": 200,
          "head": "B6"
        }
      },
      {
        "act": "destinate",
        "param": {
          "rule": "rtm_code_route",
          "offset": [18, 12],
          "dest": [2611, 2612, 2613, 2614, 2615]
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "qos"
        }
      }
    ]
  },
  "kqp.ksp_q": {
    "desc": "통합시세 KOSPI 호가",
    "actions": []
  },
  "KS_f": {
    "desc": "KOSPI 주식 체결",
    "recv2r": [
      217,
      218,
      219,
      220,
      221,
      256
    ],
    "actions": [
      {
        "act": "log",
        "param": {
          "to": "rcv0"
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KS_f_emit"
        }
      },
      {
        "act": "kpass",
        "param": {
          "app": "kqp",
          "inst": "ksp_f",
          "fnid": 10
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KS_f_qos"
        }
      }
    ]
  },
  "KS_f_emit": {
    "desc": "KOSPI 주식 체결 송출",
    "actions": [
      {
        "act": "destinate",
        "param": {
          "rule": "route_map"
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "dist0"
        }
      }
    ]
  },
  "KS_f_qos": {
    "desc": "KOSPI 주식 체결 QoS",
    "actions": [
      {
        "act": "qos",
        "param": {
          "rule": "qos_wrsec_A3",
          "time_ms": 200
        }
      },
      {
        "act": "destinate",
        "param": {
          "rule": "rtm_code_route",
          "offset": [18, 12],
          "dest": [2621, 2622, 2623, 2624, 2625]
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "qos"
        }
      }
    ]
  },
  "kqp.ksp_f": {
    "desc": "통합시세 KOSPI 체결",
    "actions": []
  },
  "KQ_q": {
    "desc": "KOSDAQ 주식 호가",
    "recv2r": [
      236,
      237,
      259
    ],
    "actions": [
      {
        "act": "log",
        "param": {
          "to": "rcv0"
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KQ_q_emit"
        }
      },
      {
        "act": "kpass",
        "param": {
          "app": "kqp",
          "inst": "ksq_q",
          "fnid": 10
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KQ_q_qos"
        }
      }
    ]
  },
  "KQ_q_emit": {
    "desc": "KOSDAQ 주식 호가 송출",
    "actions": [
      {
        "act": "destinate",
        "param": {
          "rule": "route_map"
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "dist0"
        }
      }
    ]
  },
  "KQ_q_qos": {
    "desc": "KOSDAQ 주식 호가 QoS",
    "actions": [
      {
        "act": "qos",
        "param": {
          "rule": "qos_wrsec",
          "time_ms": 200,
          "head": "B6"
        }
      },
      {
        "act": "destinate",
        "param": {
          "rule": "rtm_code_route",
          "offset": [18, 12],
          "dest": [2651, 2652, 2653, 2654, 2655]
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "qos"
        }
      }
    ]
  },
  "kqp.ksq_q": {
    "desc": "통합시세 KOSDAQ 호가",
    "actions": []
  },
  "KQ_f": {
    "desc": "KOSDAQ 주식 체결",
    "recv2r": [
      231,
      232,
      233,
      234,
      235,
      257
    ],
    "actions": [
      {
        "act": "log",
        "param": {
          "to": "rcv0"
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KQ_f_emit"
        }
      },
      {
        "act": "kpass",
        "param": {
          "app": "kqp",
          "inst": "ksq_f",
          "fnid": 10
        }
      },
      {
        "act": "route",
        "param": {
          "to": "KQ_f_qos"
        }
      }
    ]
  },
  "KQ_f_emit": {
    "desc": "KOSDAQ 주식 체결 송출",
    "actions": [
      {
        "act": "destinate",
        "param": {
          "rule": "route_map"
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "dist0"
        }
      }
    ]
  },
  "KQ_f_qos": {
    "desc": "KOSDAQ 주식 체결 QoS",
    "actions": [
      {
        "act": "qos",
        "param": {
          "rule": "qos_wrsec_A3",
          "time_ms": 200
        }
      },
      {
        "act": "destinate",
        "param": {
          "rule": "rtm_code_route",
          "offset": [18, 12],
          "dest": [2661, 2662, 2663, 2664, 2665]
        }
      },
      {
        "act": "modify",
        "param": {
          "rule": "wrsec1"
        }
      },
      {
        "act": "emit",
        "param": {}
      },
      {
        "act": "log",
        "param": {
          "to": "qos"
        }
      }
    ]
  },
  "kqp.ksq_f": {
    "desc": "통합시세 KOSDAQ 체결",
    "actions": []
  },
  "relations": {
    "KSKQ_def": {
      "to": [
        "KSKQ_def_emit",
        "kqp.1"
      ]
    },
    "KS_q": {
      "to": [
        "KS_q_emit",
        "kqp.ksp_q",
        "KS_q_qos"
      ]
    },
    "KS_f": {
      "to": [
        "KS_f_emit",
        "kqp.ksp_f",
        "KS_f_qos"
      ]
    },
    "KQ_q": {
      "to": [
        "KQ_q_emit",
        "kqp.ksq_q",
        "KQ_q_qos"
      ]
    },
    "KQ_f": {
      "to": [
        "KQ_f_emit",
        "kqp.ksq_f",
        "KQ_f_qos"
      ]
    }
  }
}

  ;
const demoJSONValue = JSON.stringify(demoLayoutDefinifinition, null, 2);

type Props = {
  params: {
    node: string;
    layout: string;
  };
};

export default function Page({ params }: Props) {
  const { node, layout } = params;
  const { t } = useTranslate('layout-list');
  const decodedLayout = decodeURIComponent(layout);
  const testEnvModal = useBoolean();

  const url = endpoints.layouts.detail(node, decodedLayout);
  const { data, isLoading, error } = useSWR(url, fetcher);

  const layoutItem = data?.data?.detail || {};
  const layoutEmpty = data?.data?.detail == null;
  const layoutDefinition = data?.data?.layout_definition || '';
  const apiDataFlowDef = data?.data?.data_flow_definition || null;

  const [scriptCopied, setScriptCopied] = useState(false);
  const handleCopyScript = useCallback(() => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(layoutDefinition);
    } else {
      const ta = document.createElement('textarea');
      ta.value = layoutDefinition;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  }, [layoutDefinition]);

  // State for JSON editor text and parsed definition
  const [jsonValue, setJsonValue] = useState(demoJSONValue);
  const [dataFlowDefinition, setDataFlowDefinition] = useState<DataFlowDefinition | null>(demoLayoutDefinifinition);

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

  return (
    <DashboardContent maxWidth="xl" sx={{ position: 'relative' }}>
      <Breadcrumb
        node={node}
        pages={[
          { pageName: t('top.layout_list'), link: paths.dashboard.nodes.layoutList(node) },
          { pageName: decodedLayout },
        ]}
      />

      <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{t('top.layout')}{" : "}{decodedLayout}</Typography>
      <TableContainer
        component={Paper}
        sx={{ height: 'auto', my: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{ }</TableCell>
              <TableCell>{t('detail_table.layout_name')}</TableCell>
              <TableCell>{t('detail_table.path')}</TableCell>
              <TableCell align="left">{t('detail_table.timestamp')}</TableCell>
              <TableCell align="left">{t('detail_table.process')}</TableCell>
              <TableCell>{t('detail_table.channel_in')}</TableCell>
              <TableCell>{ }</TableCell>
              <TableCell>{ }</TableCell>
              <TableCell align="left">{t('detail_table.description')}</TableCell>
              <TableCell>{ }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : layoutEmpty ? (
              <TableRow>
                <TableCell colSpan={8}>No Process Found</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8}>Error Fetching Process</TableCell>
              </TableRow>
            ) : (
              <TableRow
                key={layoutItem.name}
                hover
              >
                <TableCell align="left">{ }</TableCell>
                <TableCell align="left">{layoutItem.name}</TableCell>
                <TableCell>{layoutItem.path}</TableCell>
                <TableCell align='left'>{layoutItem.timestamp}</TableCell>
                <TableCell align="left">{layoutItem.process}</TableCell>
                <TableCell align="left">{layoutItem.channel_in}</TableCell>
                <TableCell align="left">{ }</TableCell>
                <TableCell align="left">{ }</TableCell>
                <TableCell align="left">{layoutItem?.desc}</TableCell>
                <TableCell align="left">{ }</TableCell>

              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Data Flow Visualization */}
      {dataFlowDefinition && (
        <Box sx={{ mb: 3 }}>
          <DataFlowCanvas
            definition={dataFlowDefinition}
            fileName={`${decodedLayout}.moon`}
            onTestEnvClick={testEnvModal.onTrue}
          />
        </Box>
      )}

      {/* JSON Definition Editor */}
      {jsonValue && (
        <Box sx={{ mb: 3 }}>
          <DataFlowJsonEditor
            value={jsonValue}
            onChange={handleJsonChange}
          />
        </Box>
      )}

      <Paper sx={{
        height: '100%',
        padding: (theme) => theme.palette.mode === 'dark' ? '0px' : '4px',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'transparent' : 'black',
      }} >

        <Box sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#667085' : '#E0E4EB', p: 1.5, borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{
            flex: 1,
            fontWeight: 600,
            color: (theme) => theme.palette.mode === 'dark' ? grey[300] : '#4E576A'
          }}>{t('detail_table.script_title')}</Typography>
          <IconButton onClick={handleCopyScript} size="small" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#E0E4EB' : '#4E576A', '&:hover': { color: '#fff' } }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.1333 5.33346C4.1333 4.67072 4.67056 4.13346 5.3333 4.13346H12.8C13.4627 4.13346 14 4.67072 14 5.33346V12.8001C14 13.4629 13.4627 14.0001 12.8 14.0001H5.3333C4.67056 14.0001 4.1333 13.4629 4.1333 12.8001V5.33346ZM5.3333 5.20013C5.25966 5.20013 5.19997 5.25983 5.19997 5.33346V12.8001C5.19997 12.8738 5.25966 12.9335 5.3333 12.9335H12.8C12.8736 12.9335 12.9333 12.8738 12.9333 12.8001V5.33346C12.9333 5.25982 12.8736 5.20013 12.8 5.20013H5.3333Z" fill="white" />
              <path fillRule="evenodd" clipRule="evenodd" d="M2.00049 3.2C2.00049 2.53726 2.53775 2 3.20049 2H12.1333C12.4279 2 12.6666 2.23878 12.6666 2.53333C12.6666 2.82789 12.4279 3.06667 12.1333 3.06667H3.20049C3.12685 3.06667 3.06715 3.12636 3.06715 3.2V12.1335C3.06715 12.428 2.82837 12.6668 2.53382 12.6668C2.23927 12.6668 2.00049 12.428 2.00049 12.1335V3.2Z" fill="white" />
            </svg>
          </IconButton>
          {scriptCopied && (
            <Typography sx={{ fontSize: 12, color: '#7EE081', ml: 0.5 }}>Copied!</Typography>
          )}
        </Box>

        <Box sx={{
          bgcolor: '#202838', height: 'calc(100vh - 48px)', overflowY: 'auto',
        }}>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
            <SyntaxHighlighter
              language="moonscript"
              style={a11yDark}
              customStyle={{
                background: "transparent",
                whiteSpace: "pre-wrap",

              }}
            >
              {layoutDefinition}
            </SyntaxHighlighter>
          </Box>
        </Box>
      </Paper>

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

    </DashboardContent>
  );
}


