"use client";

import type { DataFlowDefinition } from 'src/components/data-flow';

import useSWR from 'swr';
import SyntaxHighlighter from 'react-syntax-highlighter';
import React, { useState, useEffect, useCallback } from 'react';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import { Table, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DataFlowCanvas, DataFlowJsonEditor } from 'src/components/data-flow';

const demoLayoutDefinifinition: DataFlowDefinition = {
  "PMR": {
    "description": "KOSPI/KOSDAQ 주식 그룹",
    "nodes": {
      "KSKQ_def": {
        "description": "구조화증권 기본/기타 라우터",
        "recv2r": [216, 224, 225, 226, 230, 238, 239, 261, 260],
        "topics": {
          "inbound": [
            { "act": "log", "params": { "to": "rcv0" }, "comment": "입수 로깅" },
            { "act": "route", "params": { "to": "1", "app": "kqp" }, "comment": "통합시세로 넘김" },
            { "act": "route", "params": { "to": "KSKQ_def_emit" }, "comment": "송출기로 넘김.  => CBR" }
          ]
        }
      },
      "KSKQ_def_emit": {
        "description": "",
        "topics": {
          "inbound": [
            { "act": "destinate", "params": { "rule": "route_map" } },
            { "act": "modify", "params": { "rule": "wrsec1" }, "comment": "헤더 추가" },
            { "act": "emit", "params": {} },
            { "act": "log", "params": { "to": "dist0" }, "comment": "송출 로깅" }
          ]
        }
      },
      "KS_q": {
        "description": "KOSPI 주식 호가",
        "recv2r": [222, 223, 258],
        "topics": {
          "inbound": [
            { "act": "log", "params": { "to": "rcv0" } },
            { "act": "route", "params": { "to": "ksp_q", "app": "kqp" }, "comment": "통합시세로 넘김" },
            { "act": "route", "params": { "to": "KS_q_emit" } }
          ]
        }
      },
      "KS_q_emit": {
        "description": "",
        "topics": {
          "inbound": [
            { "act": "destinate", "params": { "rule": "route_map" } },
            { "act": "modify", "params": { "rule": "wrsec1" }, "comment": "헤더 추가" },
            { "act": "emit", "params": {} }
          ]
        }
      },
      "KS_f": {
        "description": "KOSPI 주식 체결",
        "recv2r": [217, 218, 219, 220, 221, 256],
        "topics": {
          "inbound": [
            { "act": "log", "params": { "to": "rcv0" } },
            { "act": "route", "params": { "to": "KS_f_emit" } }
          ]
        }
      },
      "KS_f_emit": {
        "description": "",
        "topics": {
          "inbound": [
            { "act": "destinate", "params": { "rule": "route_map" } },
            { "act": "modify", "params": { "rule": "wrsec1" }, "comment": "헤더 추가" },
            { "act": "emit", "params": {} },
            { "act": "log", "params": { "to": "dist0" }, "comment": "송출 로깅" }
          ]
        }
      },
      "KQ_q": {
        "description": "KOSDAQ 주식 호가",
        "recv2r": [236, 237, 259],
        "topics": {
          "inbound": [
            { "act": "log", "params": { "to": "rcv0" } },
            { "act": "route", "params": { "to": "KS_q_emit" } }
          ]
        }
      },
      "KQ_q_emit": {
        "description": "",
        "topics": {
          "inbound": [
            { "act": "destinate", "params": { "rule": "route_map" } },
            { "act": "modify", "params": { "rule": "wrsec1" }, "comment": "헤더 추가" },
            { "act": "emit", "params": {} }
          ]
        }
      },
      "KQ_f": {
        "description": "KOSDAQ 주식 체결",
        "recv2r": [231, 232, 233, 234, 235, 257],
        "topics": {
          "inbound": [
            { "act": "log", "params": { "to": "rcv0" } },
            { "act": "route", "params": { "to": "KQ_f_emit" } }
          ]
        }
      },
      "KQ_f_emit": {
        "description": "",
        "topics": {
          "inbound": [
            { "act": "destinate", "params": { "rule": "route_map" } },
            { "act": "modify", "params": { "rule": "wrsec1" }, "comment": "헤더 추가" },
            { "act": "emit", "params": {} }
          ]
        }
      }
    }
  }
};
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


  const url = endpoints.layouts.detail(node, decodedLayout);
  const { data, isLoading, error } = useSWR(url, fetcher);

  const layoutItem = data?.data?.detail || {};
  const layoutEmpty = data?.data?.detail == null;
  const layoutDefinition = data?.data?.layout_definition || '';
  const apiDataFlowDef = data?.data?.data_flow_definition || null;

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

  // Handle JSON editor changes — parse and update graph
  const handleJsonChange = useCallback((value: string) => {
    setJsonValue(value);
    try {
      const parsed = JSON.parse(value) as DataFlowDefinition;
      setDataFlowDefinition(parsed);
    } catch {
      // Invalid JSON — keep current graph, user is still typing
    }
  }, []);

  return (
    <DashboardContent maxWidth="xl">
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
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'transparent' : 'black'
      }} >

        <Box sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#667085' : '#E0E4EB', p: 1.5, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
          <Typography sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.mode === 'dark' ? grey[300] : '#4E576A'
          }}>{t('detail_table.script_title')}</Typography>
        </Box>

        <Box sx={{ bgcolor: '#202838', height: 'calc(100vh - 48px)', overflowY: 'auto' }}>
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


    </DashboardContent>
  );
}


