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
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';

type Props = {
    params: { node: string; identifyId: string };
};

export default function Page({ params }: Props) {
    const { node, identifyId } = params;
    const { t } = useTranslate('function-list');
    const decodedId = decodeURIComponent(identifyId);
    const router = useRouter();

    const url = endpoints.function.detail(node, decodedId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const detail = data?.data || {};
    const specList: Array<{ name: string; ref_count: number, url: string }> = detail.related_identifies || [];
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

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2, mb: 2 }}>
                FUNCTION: {detail?.function?.name || '-'}
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t("table.function_name")}</TableCell>
                            <TableCell>{t("table.path")}</TableCell>
                            <TableCell>{t("table.timestamp")}</TableCell>
                            <TableCell>{t("table.ref_identifies")}</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t("table.desc")}</TableCell>
                            <TableCell>{ }</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            key={detail?.name}
                            sx={{ cursor: 'pointer' }}
                            tabIndex={0}
                        >
                            <TableCell>{ }</TableCell>
                            <TableCell>{detail?.function?.name}</TableCell>
                            <TableCell>{detail?.function?.path}</TableCell>
                            <TableCell>{detail?.function?.timestamp}</TableCell>
                            <TableCell>{detail?.function?.ref_identifies}</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{detail?.function?.desc}</TableCell>
                            <TableCell>{ }</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={7}>
                    <Grid>
                        <Box >
                            <Paper>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box>
                                            <TableContainer>
                                                <Table size='small'>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align='right'>{ }</TableCell>
                                                            <TableCell align='right'>{t('detail_table.no')}</TableCell>
                                                            <TableCell>{t('detail_table.related_identifier')}</TableCell>
                                                            <TableCell>{t('detail_table.ref_freq')}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {isLoading && (
                                                            <TableRow>
                                                                <TableCell colSpan={5}>{t('loading')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {error && (
                                                            <TableRow>
                                                                <TableCell colSpan={5}>{t('error')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {!isLoading && !error && specList.length === 0 && (
                                                            <TableRow>
                                                                <TableCell colSpan={5}>{t('empty')}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        {specList.map((row, idx) => (
                                                            <TableRow hover key={idx + 1}

                                                            >
                                                                <TableCell align='right'>{ }</TableCell>
                                                                <TableCell
                                                                    align='right'
                                                                >{idx + 1}</TableCell>
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
                    </Grid>
                </Grid>


                <Grid item xs={12} md={5}>
                    <Paper sx={{
                        height: '100%', p: 0.5,
                        padding: (theme) => theme.palette.mode === 'dark' ? '0px' : '4px',
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'transparent' : 'black'
                    }}>
                        <Box sx={{
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#667085' : '#E0E4EB',
                            p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4
                        }}>
                            <Typography variant="body2" sx={{
                                fontWeight: 600,
                                color: (theme) => theme.palette.mode === 'dark' ? grey[300] : '#4E576A'
                            }}>{t('detail_table.script_title')}</Typography>
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


