"use client";

import React from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useSWR from 'swr';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { fetcher, endpoints } from 'src/utils/axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';


type Props = {
  params: {
    node: string;
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { node, id } = params;
  const { t } = useTranslate('action-list');
  const decodedAction = decodeURIComponent(id);

  console.log('Decoded Action:', decodedAction);

  const url = endpoints.actions.detail(node, decodedAction);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const layoutList = data?.data?.layouts || [];
  const processList = data?.data?.processes || [];
  const script = data?.data?.definition || '';
  const refLayoutCount = data?.data?.ref_layout || '-'
  const refProcessCount = data?.data?.ref_process || '-'
  const timeStamp = data?.data?.timestamp || '-'


  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={node}
        pages={[
          { pageName: t('rule-list.title'), link: paths.dashboard.nodes.rules(node) },
          { pageName: decodedAction },
        ]}
      />

      <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{"RULE: "}{decodedAction}</Typography>
      <Typography sx={{ textAlign: 'right', color: 'GrayText' }}>
        {timeStamp}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <StackOfTables
              refLayoutCount={refLayoutCount}
              refProcessCount={refProcessCount}
              layoutList={layoutList}
              processList={processList}
              t={t}
              loading={isLoading}
              error={error}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ height: '100%', backgroundColor: 'black', p: 0.5 }} >
              <Box sx={{ backgroundColor: '#E0E4EB', p: 1.5, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                <Typography sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
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

function StackOfTables({ layoutList, processList, t, loading, error, refLayoutCount, refProcessCount }: any) {
  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('detail_table.layout_no')}</TableCell>
              <TableCell>{t('detail_table.layout_name')}</TableCell>
              <TableCell>{t('detail_table.layout_ref_freq')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={3}>{t('loading')}</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={3}>{t('error')}</TableCell>
              </TableRow>
            )}
            {!loading && !error && layoutList.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>{t('empty')}</TableCell>
              </TableRow>
            )}
            {layoutList.map((item: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.ref_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography sx={{ textAlign: 'right', color: 'GrayText' }}>
        {t('table.ref_layout')}{' '}{refLayoutCount}
      </Typography>
      <TableContainer sx={{ my: 4 }} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('detail_table.process_no')}</TableCell>
              <TableCell>{t('detail_table.process_name')}</TableCell>
              <TableCell>{t('detail_table.process_usage_freq')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={3}>{t('loading')}</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={3}>{t('error')}</TableCell>
              </TableRow>
            )}
            {!loading && !error && processList.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>{t('empty')}</TableCell>
              </TableRow>
            )}
            {processList.map((item: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.ref_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography sx={{ textAlign: 'right', color: 'GrayText' }}>
        {t('table.ref_process')}{' '}{refProcessCount}
      </Typography>
    </Box>
  );
}
