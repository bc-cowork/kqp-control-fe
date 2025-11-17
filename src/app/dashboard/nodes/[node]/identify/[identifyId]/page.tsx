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
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';

type Props = {
    params: { node: string; identifyId: string };
};

export default function Page({ params }: Props) {
    const { node, identifyId } = params;
    const { t } = useTranslate('identify-list');
    const decodedId = decodeURIComponent(identifyId);
    const router = useRouter();

    const url = endpoints.identify.detail(node, decodedId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const detail = data?.data?.item || {};
    const keys: string[] = Array.isArray(detail.keys) ? detail.keys : [];
    const specList: Array<{ name: string; ref_count: number, url: string }> = detail.related_specs || [];
    const script: string = detail.spec_def || '';


    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.identify_list'), link: paths.dashboard.nodes.identifyList(node) },
                    { pageName: detail?.name || '-' },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2, mb: 2 }}>
                IDENTIFY: {detail?.name || '-'}
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t("table.identity_name")}</TableCell>
                            <TableCell>{t("table.path")}</TableCell>
                            <TableCell>{t("table.timestamp")}</TableCell>
                            <TableCell>{t("table.ref_specs")}</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t("table.explanation")}</TableCell>
                            <TableCell>{ }</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            <TableRow
                                key={detail.name}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{ }</TableCell>
                                <TableCell>{detail.name}</TableCell>
                                <TableCell>{detail.path}</TableCell>
                                <TableCell>{detail.timestamp}</TableCell>
                                <TableCell>{detail.ref_specs}</TableCell>
                                <TableCell>{ }</TableCell>
                                <TableCell>{ }</TableCell>
                                <TableCell>{ }</TableCell>
                                <TableCell>{ }</TableCell>
                                <TableCell>{detail.desc}</TableCell>
                                <TableCell>{ }</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={7}>
                    <Grid >
                        <Box sx={{ backgroundColor: '#E0E4EB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <Typography sx={{ p: 1, py: 0.5, color: grey[800] }} variant="body2">
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

                                                            <TableCell align='right'>{t('detail_table.no')}</TableCell>
                                                            <TableCell>{t('detail_table.related_spec')}</TableCell>
                                                            <TableCell>{t('detail_table.ref_freq')}</TableCell>
                                                            <TableCell>{ }</TableCell>

                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {isLoading && (
                                                            <TableRow>
                                                                <TableCell colSpan={4}>{t('loading')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {error && (
                                                            <TableRow>
                                                                <TableCell colSpan={4}>{t('error')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {!isLoading && !error && specList.length === 0 && (
                                                            <TableRow>
                                                                <TableCell colSpan={4}>{t('empty')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {specList.map((row, idx) => (
                                                            <TableRow hover key={idx + 1}

                                                            >
                                                                <TableCell align='right'>{idx + 1}</TableCell>
                                                                <TableCell
                                                                    onClick={() =>
                                                                        router.push(`${paths.dashboard.nodes.specDetail(node, row.url.split('/')[row.url.split('/').length - 1])}`)
                                                                    }
                                                                    sx={{
                                                                        color: '#4A3BFF',
                                                                        textDecoration: 'underline',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >{row.name}</TableCell>
                                                                <TableCell>{row.ref_count}</TableCell>
                                                                <TableCell>{ }</TableCell>
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
                        <Box
                            sx={{
                                borderRadius: '8px',
                                height: '264px',
                                color: 'red',
                                backgroundColor: '#202838',
                                mt: 2
                            }}
                        >
                            <ChartBar />
                        </Box>
                    </Grid>
                </Grid>


                <Grid item xs={12} md={5}>
                    <Paper sx={{ height: '100%', p: 0.5, backgroundColor: 'black' }}>
                        <Box sx={{ backgroundColor: '#667085', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
                        </Box>

                        <Box sx={{ bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
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


