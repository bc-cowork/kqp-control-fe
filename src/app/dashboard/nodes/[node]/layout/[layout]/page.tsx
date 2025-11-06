"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';

import useSWR from 'swr';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { fetcher, endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';

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
  const { data } = useSWR(url, fetcher);

  const script = data?.data?.script || '';

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
      <Typography sx={{ fontSize: 15, fontWeight: 500, mt: 2, textAlign: 'right', color: '#667085', p: 2 }}>{"2025 - 10 - 28 13:05:30"}</Typography>

      <Paper sx={{ height: '100%', backgroundColor: 'black', p: 0.5 }} >

        <Box sx={{ backgroundColor: '#E0E4EB', p: 1.5, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
          <Typography sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
        </Box>

        <Box sx={{ p: 2, bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
            {script}
          </Box>
        </Box>
      </Paper>
    </DashboardContent>
  );
}


