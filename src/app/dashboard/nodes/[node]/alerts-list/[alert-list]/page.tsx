'use client';

import useSWR from 'swr';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type Props = {
    params: {
        node: string;
        'alert-list': string;
    };
};

export default function Page({ params }: Props) {
    const { node, 'alert-list': alertId } = params;
    const { t } = useTranslate('alert-list');
    const decodedAlertId = decodeURIComponent(alertId);

    const { data, isLoading, error } = useSWR(
        endpoints.alert.detail(node, decodedAlertId),
        fetcher
    );

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

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2, color: (theme) => theme.palette.mode === 'dark' ? grey[50] : '#373F4E' }}>
                {t('alert')} : {decodedAlertId}
            </Typography>

            <TableContainer component={Paper} sx={{ height: 'auto', my: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{t('table.surv_name')}</TableCell>
                            <TableCell align="left">{t('table.start_at')}</TableCell>
                            <TableCell align="left">{t('table.end_at')}</TableCell>
                            <TableCell>{t('table.interval')}</TableCell>
                            <TableCell>{t('table.status')}</TableCell>
                            <TableCell align="left">{t('table.desc')}</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={8}>{t('detail.error')}</TableCell>
                            </TableRow>
                        ) : alertEmpty ? (
                            <TableRow>
                                <TableCell colSpan={8}>{t('detail.empty')}</TableCell>
                            </TableRow>
                        ) : (
                            <TableRow hover>
                                <TableCell />
                                <TableCell>{reportItem.name}</TableCell>
                                <TableCell>{reportItem.start_at}</TableCell>
                                <TableCell>{reportItem.end_at}</TableCell>
                                <TableCell>{reportItem.interval_sec}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={reportItem.status}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1D2F20' : '#E8F5E9',
                                            color: (theme) => theme.palette.mode === 'dark' ? '#7EE081' : '#2E7D32',
                                            borderColor: (theme) => theme.palette.mode === 'dark' ? '#36573C' : '#A5D6A7',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{reportItem.desc}</TableCell>
                                <TableCell />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Paper
                sx={{
                    height: '100%',
                    padding: (theme) => (theme.palette.mode === 'dark' ? '0px' : '4px'),
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'transparent' : 'black',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? '#667085' : '#E0E4EB',
                        p: 1.5,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                    }}
                >
                    <Typography sx={{ fontWeight: 600, color: (theme) => theme.palette.mode === 'dark' ? '#D1D6E0' : '#4E576A' }}>
                        {t('alert')}
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: '#202838', height: 'calc(100vh - 48px)', overflowY: 'auto' }}>
                    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
                        <SyntaxHighlighter
                            language="lua"
                            style={a11yDark}
                            customStyle={{ background: 'transparent', whiteSpace: 'pre-wrap' }}
                        >
                            {alertDefinition}
                        </SyntaxHighlighter>
                    </Box>
                </Box>
            </Paper>
        </DashboardContent>
    );
}
