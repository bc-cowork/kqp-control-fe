'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import useSWR from 'swr';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

type Props = { nodeId: string };

type LayoutItem = {
    id: string;
    layoutName: string;
    path: string;
    timestamp: string;
    process?: number;
    channelIn?: number;
    desc?: string;
};

export function LayoutListView({ nodeId }: Props) {
    const { t } = useTranslate('layout-list');
    const router = useRouter();

    const url = endpoints.layouts.list(nodeId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const rows: LayoutItem[] = (data && data.data && data.data.layoutList) || [];

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={nodeId} pages={[{ pageName: t('top.layout_list') }]} />

            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
                {t('top.layout_list')}
            </Typography>

            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('table.id')}</TableCell>
                                <TableCell>{t('table.layout_name')}</TableCell>
                                <TableCell>{t('table.path')}</TableCell>
                                <TableCell>{t('table.timestamp')}</TableCell>
                                <TableCell>{t('table.process')}</TableCell>
                                <TableCell>{t('table.channel_in')}</TableCell>
                                <TableCell>{t('table.desc')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={7}>{t('loading') || 'Loading...'}</TableCell>
                                </TableRow>
                            )}

                            {error && (
                                <TableRow>
                                    <TableCell colSpan={7}>{t('error') || 'Failed to load'}</TableCell>
                                </TableRow>
                            )}

                            {!isLoading && !error && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7}>{t('empty') || 'No layouts'}</TableCell>
                                </TableRow>
                            )}

                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    onClick={() => router.push(
                                        `${paths.dashboard.nodes.layoutDetail(nodeId, String(row.layoutName))}?timestamp=${encodeURIComponent(row.timestamp || '')}`
                                    )}
                                    sx={{ cursor: 'pointer' }}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            router.push(
                                                `${paths.dashboard.nodes.layoutDetail(nodeId, String(row.layoutName))}?timestamp=${encodeURIComponent(row.timestamp || '')}`
                                            );
                                        }
                                    }}
                                >
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.layoutName}</TableCell>
                                    <TableCell>{row.path}</TableCell>
                                    <TableCell>{row.timestamp}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.channelIn}</TableCell>
                                    <TableCell>{row.desc}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </DashboardContent>
    );
}


