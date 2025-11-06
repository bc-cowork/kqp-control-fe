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

      <Box sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>{t('detail_table.script_title') || 'Function Definition'}</Typography>
          <Paper sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }}>{script}</Paper>
        </Grid>
      </Box>
    </DashboardContent>
  );
}


