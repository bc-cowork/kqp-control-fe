"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import useSWR from 'swr';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { fetcher, endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { grey } from '@mui/material/colors';

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
      <Paper sx={{ height: '100%', }} >

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


