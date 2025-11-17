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

type ActionItem = {
    id: string;
    name: string;
    path: string;
    timestamp: string;
    ref_layout?: string;
    ref_process?: string;
    desc?: string;
};

export function ActionListView({ nodeId }: Props) {
    const { t } = useTranslate('action-list');
    const router = useRouter();

    const url = endpoints.actions.list(nodeId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const rows: ActionItem[] = (data && data.data && data.data.auditLogList) || [];

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={nodeId} pages={[{ pageName: t('top.action_list') }]} />

            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
                {t('top.action_list')}
            </Typography>

            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>{ }</TableCell>
                                <TableCell>{t('table.id')}</TableCell>
                                <TableCell>{t('table.action_name')}</TableCell>
                                <TableCell>{t('table.path')}</TableCell>
                                <TableCell>{t('table.timestamp')}</TableCell>
                                <TableCell>{t('table.ref_layout')}</TableCell>
                                <TableCell>{t('table.ref_process')}</TableCell>
                                <TableCell>{t('table.desc')}</TableCell>
                                <TableCell>{ }</TableCell>
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
                                    <TableCell colSpan={7}>{t('empty') || 'No actions'}</TableCell>
                                </TableRow>
                            )}

                            {rows.map((row, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => router.push(
                                        `${paths.dashboard.nodes.actionDetail(nodeId, String(row.name))}`
                                    )}
                                    sx={{ cursor: 'pointer' }}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            router.push(
                                                `${paths.dashboard.nodes.actionDetail(nodeId, String(row.name))}`
                                            );
                                        }
                                    }}
                                >
                                    <TableCell>{ }</TableCell>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.path}</TableCell>
                                    <TableCell>{row.timestamp}</TableCell>
                                    <TableCell>{row.ref_layout}</TableCell>
                                    <TableCell>{row.ref_process}</TableCell>
                                    <TableCell>{row.desc}</TableCell>
                                    <TableCell>{ }</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </DashboardContent>
    );
}
