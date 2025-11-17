"use client";

import React from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import useSWR from 'swr';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { fetcher, endpoints } from 'src/utils/axios';


import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';

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

    const actionItem = data?.data || {};
    const actionEmpty = actionItem === null;
    const layoutList = data?.data?.layouts || [];
    const processList = data?.data?.processes || [];
    const script = data?.data?.definition || '';

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
            <TableContainer
                component={Paper}
                sx={{ height: 'auto', my: 2 }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t('table.action_name')}</TableCell>
                            <TableCell>{t('table.path')}</TableCell>
                            <TableCell align="left">{t('table.timestamp')}</TableCell>
                            <TableCell align="left">{t('table.ref_layout')}</TableCell>
                            <TableCell>{t('table.ref_process')}</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell align="left">{t('table.desc')}</TableCell>
                            <TableCell>{ }</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : actionEmpty ? (
                            <TableRow>
                                <TableCell colSpan={10}>No Process Found</TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={10}>Error Fetching Process</TableCell>
                            </TableRow>
                        ) : (
                            <TableRow
                                key={actionItem.name}
                                hover
                            >
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{actionItem.name}</TableCell>
                                <TableCell>{actionItem.path}</TableCell>
                                <TableCell align='left'>{actionItem.timestamp}</TableCell>
                                <TableCell align="left">{actionItem.ref_layout}</TableCell>
                                <TableCell align="left">{actionItem.ref_process}</TableCell>
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{actionItem?.desc}</TableCell>
                                <TableCell align="left">{ }</TableCell>

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <StackOfTables
                            layoutList={layoutList}
                            processList={processList}
                            t={t}
                            loading={isLoading}
                            error={error}
                            node={node}
                        />
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper sx={{ height: '100%', }} >
                            <Box sx={{ backgroundColor: '#667085', p: 1.5, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                                <Typography sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
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
                                        {script}
                                    </SyntaxHighlighter>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </DashboardContent >
    );
}

function StackOfTables({ layoutList, processList, t, loading, error, node }: any) {
    const router = useRouter();

    return (
        <Box>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell align='right'>{t('detail_table.layout_no')}</TableCell>
                            <TableCell>{t('detail_table.layout_name')}</TableCell>
                            <TableCell>{t('detail_table.layout_ref_freq')}</TableCell>
                            <TableCell>{ }</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5}>{t('loading')}</TableCell>
                            </TableRow>
                        )}
                        {error && (
                            <TableRow>
                                <TableCell colSpan={5}>{t('error')}</TableCell>
                            </TableRow>
                        )}
                        {!loading && !error && layoutList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5}>{t('empty')}</TableCell>
                            </TableRow>
                        )}
                        {layoutList.map((item: any, idx: number) => (
                            <TableRow hover key={idx}
                            >
                                <TableCell>{ }</TableCell>
                                <TableCell align='right'>{idx + 1}</TableCell>
                                <TableCell
                                    onClick={() =>
                                        router.push(`${paths.dashboard.nodes.layoutDetail(node, item.url.split('/')[item.url.split('/').length - 1])}`)
                                    }
                                    sx={{
                                        color: '#4A3BFF',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }}
                                >{item.name}</TableCell>
                                <TableCell>{item.ref_count}</TableCell>
                                <TableCell>{ }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ my: 4 }} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell align='right'>{t('detail_table.process_no')}</TableCell>
                            <TableCell>{t('detail_table.process_name')}</TableCell>
                            <TableCell>{t('detail_table.process_usage_freq')}</TableCell>
                            <TableCell>{ }</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5}>{t('loading')}</TableCell>
                            </TableRow>
                        )}
                        {error && (
                            <TableRow>
                                <TableCell colSpan={5}>{t('error')}</TableCell>
                            </TableRow>
                        )}
                        {!loading && !error && processList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5}>{t('empty')}</TableCell>
                            </TableRow>
                        )}
                        {processList.map((item: any, idx: number) => (
                            <TableRow
                                hover
                                key={idx}

                            >
                                <TableCell>{ }</TableCell>
                                <TableCell align='right'>{idx + 1}</TableCell>
                                <TableCell
                                    onClick={() =>
                                        router.push(`${paths.dashboard.nodes.processDetail(node, item.url.split('/')[item.url.split('/').length - 1])}`)
                                    }
                                    sx={{
                                        color: '#4A3BFF',
                                        textDecoration: 'underline'
                                    }}
                                >{item.name}</TableCell>
                                <TableCell>{item.ref_count}</TableCell>
                                <TableCell>{ }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );
}
