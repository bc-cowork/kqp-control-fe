"use client";

import React from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import useSWR from 'swr';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { fetcher, endpoints } from 'src/utils/axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useRouter } from 'next/navigation';
import { grey } from '@mui/material/colors';


type Props = {
  params: {
    node: string;
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { node, id } = params;
  const { t } = useTranslate('rule-list');
  const decodedAction = decodeURIComponent(id);

  const url = endpoints.rules.detail(node, decodedAction);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const ruleItem = data?.data?.detail || {};
  const layoutList = data?.data?.detail?.related_layouts || [];
  const processList = data?.data?.detail?.related_processes || [];
  const actionList = data?.data?.detail?.related_actions || [];
  const script = data?.data?.detail?.function_def?.code || '';


  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={node}
        pages={[
          { pageName: t('top.title'), link: paths.dashboard.nodes.rules(node) },
          { pageName: decodedAction },
        ]}
      />

      <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{"RULE: "}{decodedAction}</Typography>
      <TableContainer
        component={Paper}
        sx={{ height: 'auto', my: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{ }</TableCell>
              <TableCell>{t('table_header.name')}</TableCell>
              <TableCell>{t('table_header.path')}</TableCell>
              <TableCell align="left">{t('table_header.timestamp')}</TableCell>
              <TableCell align="left">{t('table_header.ref_layout')}</TableCell>
              <TableCell>{t('table_header.ref_process')}</TableCell>
              <TableCell>{t('table_header.ref_actions')}</TableCell>
              <TableCell>{ }</TableCell>
              <TableCell align="left">{t('table_header.desc')}</TableCell>
              <TableCell>{ }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : ruleItem == null ? (
              <TableRow>
                <TableCell colSpan={10}>No Action Rule</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10}>Error Fetching Rule</TableCell>
              </TableRow>
            ) : (
              <TableRow
                key={ruleItem.name}
                hover
              >
                <TableCell align="left">{ }</TableCell>
                <TableCell align="left">{ruleItem.name}</TableCell>
                <TableCell>{ruleItem.path}</TableCell>
                <TableCell align='left'>{ruleItem.timestamp}</TableCell>
                <TableCell align="left">{ruleItem.ref_layout}</TableCell>
                <TableCell align="left">{ruleItem.ref_process}</TableCell>
                <TableCell align="left">{ruleItem.ref_actions}</TableCell>
                <TableCell align="left">{ }</TableCell>
                <TableCell align="left">{ruleItem?.desc}</TableCell>
                <TableCell align="left">{ }</TableCell>

              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <StackOfTables
              layoutList={layoutList}
              processList={processList}
              actionList={actionList}
              t={t}
              loading={isLoading}
              error={error}
              node={node}
            />
          </Grid>

          <Grid item xs={12} md={5}>
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

              <Box sx={{ bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
                <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, m: 0 }}>
                  <SyntaxHighlighter
                    language="moonscript"
                    style={a11yDark}
                    customStyle={{
                      background: "transparent",
                      whiteSpace: "pre-wrap",
                    }}
                  >

                    {isLoading ? t('loading') : error ? t('error') : script || t('detail.placeholder')}
                  </SyntaxHighlighter>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent >
  );
}

function StackOfTables({ layoutList, processList, actionList, t, loading, error, node }: any) {
  const router = useRouter();
  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{ }</TableCell>
              <TableCell align='right'>{t('detail_table.layout_no')}</TableCell>
              <TableCell>{t('detail_table.layout_name')}</TableCell>
              <TableCell>{t('detail_table.layout_ref_freq')}</TableCell>
              <TableCell>{ }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5}>{t('loading')}</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>{t('error')}</TableCell>
              </TableRow>
            )}
            {!loading && !error && layoutList.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>{t('empty')}</TableCell>
              </TableRow>
            )}
            {layoutList.map((item: any, idx: number) => (
              <TableRow
                hover
                key={idx}

              >
                <TableCell>{ }</TableCell>
                <TableCell
                  align='right'
                >{idx + 1}</TableCell>
                <TableCell
                  onClick={() =>
                    router.push(`${paths.dashboard.nodes.layoutDetail(node, item.url.split('/')[item.url.split('/').length - 1])}`)
                  }
                  sx={{
                    color: '#4A3BFF',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >{item.name}</TableCell>
                <TableCell>{item.ref_count}</TableCell>
                <TableCell>{ }</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer sx={{ my: 4 }} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{ }</TableCell>
              <TableCell align='right'>{t('detail_table.process_no')}</TableCell>
              <TableCell>{t('detail_table.process_name')}</TableCell>
              <TableCell>{t('detail_table.process_usage_freq')}</TableCell>
              <TableCell>{ }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5}>{t('loading')}</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>{t('error')}</TableCell>
              </TableRow>
            )}
            {!loading && !error && processList.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>{t('empty')}</TableCell>
              </TableRow>
            )}
            {processList.map((item: any, idx: number) => (
              <TableRow
                hover
                key={idx}

              >
                <TableCell>{ }</TableCell>
                <TableCell align='right'>{idx + 1}</TableCell>
                <TableCell
                  onClick={() =>
                    router.push(`${paths.dashboard.nodes.processDetail(node, item.url.split('/')[item.url.split('/').length - 1])}`)
                  }
                  sx={{
                    color: '#4A3BFF',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >{item.name}</TableCell>
                <TableCell>{item.usage_count}</TableCell>
                <TableCell>{ }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer sx={{ my: 4 }} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{ }</TableCell>
              <TableCell align='right'>{t('detail_table.process_no')}</TableCell>
              <TableCell>{t('detail_table.related_actions')}</TableCell>
              <TableCell>{t('detail_table.process_usage_freq')}</TableCell>
              <TableCell>{ }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5}>{t('loading')}</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5}>{t('error')}</TableCell>
              </TableRow>
            )}
            {!loading && !error && actionList.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>{t('empty')}</TableCell>
              </TableRow>
            )}
            {actionList.map((item: any, idx: number) => (
              <TableRow
                hover
                key={idx}
              >
                <TableCell>{ }</TableCell>
                <TableCell align='right'>{idx + 1}</TableCell>
                <TableCell
                  onClick={() =>
                    router.push(`${paths.dashboard.nodes.actionDetail(node, item.url.split('/')[item.url.split('/').length - 1])}`)
                  }
                  sx={{
                    color: '#4A3BFF',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >{item.name}</TableCell>
                <TableCell>{item.usage_count}</TableCell>
                <TableCell>{ }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
