'use client';

import React from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Props = {
    params: { node: string; identifyId: string };
};

export default function Page({ params }: Props) {
    const { node, identifyId } = params;
    const { t } = useTranslate('function-list');
    const decodedId = decodeURIComponent(identifyId);

    const url = endpoints.function.detail(node, decodedId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const detail = data?.data || {};
    const specList: Array<{ name: string; ref_count: number }> = detail.related_identifies || [];
    const script: string = detail.definition || '';


    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.function_list'), link: paths.dashboard.nodes.functionList(node) },
                    { pageName: detail?.function?.name || '-' },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>
                FUNCTION: {detail?.function?.name || '-'}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={7}>
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
                                                            <TableRow key={idx + 1}>
                                                                <TableCell>{idx + 1}</TableCell>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell>{row.ref_count}</TableCell>
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
                            <Typography color='grey' variant="body2">
                                {isLoading || error ? '' : `ref. Identifies ${specList.length}`}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>


                <Grid item xs={12} md={5}>
                    <Paper sx={{ height: '100%', p: 0.5, backgroundColor: 'black' }}>
                        <Box sx={{ backgroundColor: '#E0E4EB', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                            <Typography color='grey' variant="body2" sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
                            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
                                <SyntaxHighlighter
                                    language="moonscript"
                                    style={a11yDark}
                                    customStyle={{
                                        background: "transparent",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >

                                    {isLoading ? t('loading') : error ? t('error') : script || ''}
                                </SyntaxHighlighter>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </DashboardContent >
    );
}


