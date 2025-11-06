"use client";

import React from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useSWR from 'swr';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { fetcher, endpoints } from 'src/utils/axios';

type Props = {
    params: {
        node: string;
        action: string;
    };
};

export default function Page({ params }: Props) {
    const { node, action } = params;
    const { t } = useTranslate('action-list');
    const decodedAction = decodeURIComponent(action);

    const url = endpoints.actions.detail(node, decodedAction);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const layoutList = data?.data?.layoutList || [];
    const processList = data?.data?.processList || [];
    const script = data?.data?.script || '';

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.action_list'), link: paths.dashboard.nodes.actionList(node) },
                    { pageName: decodedAction },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{decodedAction}</Typography>

            <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <StackOfTables
                            layoutList={layoutList}
                            processList={processList}
                            t={t}
                            loading={isLoading}
                            error={error}
                        />
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper sx={{ height: '100%' }}>
                            <Box sx={{ backgroundColor: '#E0E4EB', p: 2, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                                <Typography sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
                            </Box>

                            <Box sx={{ p: 2, bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
                                <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
                                    {isLoading ? t('loading') : error ? t('error') : script || t('detail.placeholder')}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </DashboardContent>
    );
}

function StackOfTables({ layoutList, processList, t, loading, error }: any) {
    return (
        <Box>
            <TableContainer component={Paper} sx={{ mb: 14 }}>
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
                                <TableCell>{item.layout}</TableCell>
                                <TableCell>{item.refCount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper}>
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
                                <TableCell>{item.process}</TableCell>
                                <TableCell>{item.usageCount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
