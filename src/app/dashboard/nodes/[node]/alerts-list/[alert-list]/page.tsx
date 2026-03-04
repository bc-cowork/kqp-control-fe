"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import useSWR from 'swr';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { fetcher, endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { grey } from '@mui/material/colors';

type Props = {
    params: {
        node: string;
        alertId: string;
    };
};

export default function Page({ params }: Props) {
    const { node, alertId } = params;
    const { t } = useTranslate('alert-list');
    const decodedAlertId = decodeURIComponent(alertId);


    const url = endpoints.alert.detail(node, decodedAlertId);
    const { data, isLoading, error } = useSWR(url, fetcher);

    const reportItem = data?.data?.detail || {};
    const alertEmpty = data?.data?.detail == null;
    const alertDefinition = data?.data?.detail?.alert_def?.code || '';

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.title'), link: paths.dashboard.nodes.alertsList(node) },
                    { pageName: decodedAlertId },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{t('alert')}{" : "}{decodedAlertId}</Typography>
            <TableContainer
                component={Paper}
                sx={{ height: 'auto', my: 2 }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t('table.surv_name')}</TableCell>
                            <TableCell align="left">{t('table.start_at')}</TableCell>
                            <TableCell align="left">{t('table.end_at')}</TableCell>
                            <TableCell>{t('table.interval')}</TableCell>
                            <TableCell>{t('table.status')}</TableCell>
                            <TableCell align="left">{t('table.desc')}</TableCell>
                            <TableCell>{ }</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : alertEmpty ? (
                            <TableRow>
                                <TableCell colSpan={8}>No Process Found</TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={8}>Error Fetching Process</TableCell>
                            </TableRow>
                        ) : (
                            <TableRow
                                key={reportItem.name}
                                hover
                            >
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{reportItem.name}</TableCell>
                                <TableCell align='left'>{reportItem.start_at}</TableCell>
                                <TableCell align="left">{reportItem.end_at}</TableCell>
                                <TableCell align="left">{reportItem.interval_sec}</TableCell>
                                <TableCell align="left">
                                    <Chip label={reportItem.status} sx={{
                                        backgroundColor: '#1D2F20',
                                        color: '#7EE081'
                                    }} size="small" variant="outlined" />

                                </TableCell>
                                <TableCell align="left">{reportItem?.desc}</TableCell>
                                <TableCell align="left">{ }</TableCell>

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paper sx={{
                height: '100%',
                padding: (theme) => theme.palette.mode === 'dark' ? '0px' : '4px',
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'transparent' : 'black'
            }} >

                <Box sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#667085' : '#E0E4EB', p: 1.5, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                    <Typography sx={{
                        fontWeight: 600,
                        color: (theme) => theme.palette.mode === 'dark' ? grey[300] : '#4E576A'
                    }}>{t('alert')}</Typography>
                </Box>

                <Box sx={{ bgcolor: '#202838', height: 'calc(100vh - 48px)', overflowY: 'auto' }}>
                    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
                        <SyntaxHighlighter
                            language="moonscript"
                            style={a11yDark}
                            customStyle={{
                                background: "transparent",
                                whiteSpace: "pre-wrap",

                            }}
                        >
                            {alertDefinition}
                        </SyntaxHighlighter>
                    </Box>
                </Box>
            </Paper>
        </DashboardContent>
    );
}


