'use client';

import React from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import { ChartBar } from 'src/components/node-dashboard/chart-area-bar';

type Props = {
    params: { node: string; identifyId: string };
};

export default function Page({ params }: Props) {
    const { node, identifyId } = params;
    const { t } = useTranslate('identify-list');
    const decodedId = decodeURIComponent(identifyId);

    const url = endpoints.identify.detail(node, decodedId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const detail = data?.data || {};
    const keys: string[] = Array.isArray(detail.keys) ? detail.keys : [];
    const specList: Array<{ spec: string; refCount: number }> = detail.specList || [];
    const script: string = detail.script || '';

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.identify_list'), link: paths.dashboard.nodes.identifyList(node) },
                    { pageName: decodeURIComponent(identifyId) },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>
                IDENTIFY: {decodedId}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={7}>
                    <Grid >
                        <Box sx={{ backgroundColor: '#E0E4EB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <Typography sx={{ p: 1, py: 0.5 }} variant="body2" color="text.primary">
                                Key
                            </Typography>
                            <Box sx={{ backgroundColor: '#5E66FF', p: 1, py: 1.5 }}>
                                <Typography variant="body2" color="text.light">
                                    {isLoading ? t('loading') : error ? t('error') : keys.length ? `‘${keys.join("', '")}’` : t('empty')}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid>
                        <Box sx={{ mt: 3 }}>
                            <Paper>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box>
                                            <TableContainer>
                                                <Table size='small'>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>{t('detail_table.no')}</TableCell>
                                                            <TableCell>{t('detail_table.related_spec')}</TableCell>
                                                            <TableCell>{t('detail_table.ref_freq')}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {isLoading && (
                                                            <TableRow>
                                                                <TableCell colSpan={3}>{t('loading')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {error && (
                                                            <TableRow>
                                                                <TableCell colSpan={3}>{t('error')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {!isLoading && !error && specList.length === 0 && (
                                                            <TableRow>
                                                                <TableCell colSpan={3}>{t('empty')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {specList.map((row, idx) => (
                                                            <TableRow key={row.spec + idx}>
                                                                <TableCell>{idx + 1}</TableCell>
                                                                <TableCell>{row.spec}</TableCell>
                                                                <TableCell>{row.refCount}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                        <Box sx={{ textAlign: 'right', my: 2 }}>
                            <Typography color={'grey'} variant="body2">
                                {isLoading || error ? '' : `ref. SPECs ${specList.length}`}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                borderRadius: '8px',
                                height: 'calc(100vh - 195px)',
                                color: 'red',
                                backgroundColor: 'white'
                            }}
                        >
                            <ChartBar />
                        </Box>
                    </Grid>
                </Grid>


                <Grid item xs={12} md={5}>
                    <Paper sx={{ height: '100%', p: 0.5, backgroundColor: 'black' }}>
                        <Box sx={{ backgroundColor: '#E0E4EB', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                            <Typography color={'grey'} variant="body2" sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
                            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
                                {isLoading ? t('loading') : error ? t('error') : script || ''}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </DashboardContent >
    );
}


