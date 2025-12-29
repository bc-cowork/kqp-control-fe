"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

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
        process: string;
    };
};

export default function Page({ params }: Props) {
    const { node, process } = params;
    const { t } = useTranslate('process');
    const decodedProcess = decodeURIComponent(process);


    const url = endpoints.dashboard.processDetail(node, decodedProcess);
    const { data, isLoading, error } = useSWR(url, fetcher);


    const processItem = data?.data?.item;
    const processEmpty = !isLoading && process === null;
    const layoutDefinition = data?.data?.item?.layout_def || '';

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.process'), link: paths.dashboard.nodes.process(node) },
                    { pageName: decodedProcess },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{t('top.process')}{" : "}{decodedProcess}</Typography>
            <TableContainer
                component={Paper}
                sx={{ height: 'auto', my: 2 }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t('process_detail.process_name')}</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t('process_detail.timestamp')}</TableCell>
                            <TableCell align="right">{t('process_detail.cpu')}</TableCell>
                            <TableCell align="right">{t('process_detail.mem')}</TableCell>
                            <TableCell>{ }</TableCell>
                            <TableCell align="right">{t('process_detail.desc')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : processEmpty ? (
                            <TableRow>
                                <TableCell colSpan={8}>No Process Found</TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={8}>Error Fetching Process</TableCell>
                            </TableRow>
                        ) : (
                            <TableRow
                                key={processItem.name}
                                hover
                            >
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{processItem.name}</TableCell>
                                <TableCell align="left">{ }</TableCell>
                                <TableCell>{processItem.timestamp}</TableCell>
                                <TableCell align='right'>{processItem.cpu}</TableCell>
                                <TableCell align="right">{processItem.mem}</TableCell>
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="right">{processItem?.desc}</TableCell>
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
                    <Typography sx={{ fontWeight: 600, color: (theme) => theme.palette.mode === 'dark' ? grey[300] : '#4E576A' }}>{t('detail_table.script_title')}</Typography>
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
                            {layoutDefinition}
                        </SyntaxHighlighter>
                    </Box>
                </Box>
            </Paper>
        </DashboardContent>
    );
}


