'use client';

import React from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslate } from 'src/locales';
import { RrefreshButton } from 'src/components/common/RefreshButton';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';

type Props = { params: { node: string } };

const HeadRow = ({ title }: { title: string }) => (
    <Box sx={{ mb: 0.2, backgroundColor: '#667085', p: 1.2, borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: grey[50] }}>
            {title}
        </Typography>
    </Box>
);

export default function Page({ params }: Props) {
    const { node } = params;
    const { t } = useTranslate('status');
    const url = endpoints.status.list(node);
    const { data, error, isLoading } = useSWR(url, fetcher);


    if (isLoading) {
        return <Typography sx={{ mt: 4 }}>Loading service status...</Typography>;
    }

    if (error) {
        return <Typography color="error" sx={{ mt: 4 }}>Failed to load data: {error.message}</Typography>;
    }

    const serviceSummary = data?.data?.service_status?.summary;
    const traffics = data?.data?.service_status?.traffics;

    const table1Data = serviceSummary ? [
        { key: 'process', Item: t('table_top.process'), data: serviceSummary.process },
        { key: 'queue', Item: t('table_top.que'), data: serviceSummary.queue },
        { key: 'recv_channel', Item: t('table_top.ch_inbound'), data: serviceSummary.recv_channel },
        { key: 'send_channel', Item: t('table_top.ch_outbound'), data: serviceSummary.send_channel },
    ] : [];

    const table2Data = traffics?.inbound || [];
    const table3Data = traffics?.outbound || [];

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={node} pages={[{ pageName: t('top.title') }]} />
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
                    {t('top.title')}
                </Typography>
                <RrefreshButton onRefresh={() => console.log("Refreshed!")} />
            </Stack>

            <Box sx={{ mt: '28px', width: 1 }}>
                <Grid container spacing='4px' rowSpacing='8px'>
                    <Grid item xs={12}>
                        <Grid xs={12} md={8} lg={6}>
                            <TableContainer component={Paper}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('table_top.item')}</TableCell>
                                            <TableCell align='right'>{t('table_top.max')}</TableCell>
                                            <TableCell align='right'>{t('table_top.cur')}</TableCell>
                                            <TableCell align='right'>{t('table_top.odd')}</TableCell>
                                            <TableCell align='right'>{ }</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {table1Data.map((row) => {
                                            const isAbnormal = row.data.odd > 0 || row.data.note;
                                            return (
                                                <TableRow key={row.key} hover>
                                                    <TableCell>{row.Item}</TableCell>
                                                    <TableCell align='right'>{row.data.max}</TableCell>
                                                    <TableCell align='right'>{row.data.cur}</TableCell>
                                                    <TableCell align='right'>
                                                        {row.data.odd > 0 ? row.data.odd : ''}
                                                    </TableCell>
                                                    <TableCell align='right'>
                                                        {isAbnormal && (
                                                            <Chip
                                                                label={row.data.note || "Abnormal"}
                                                                color="error"
                                                                size="small"
                                                                variant="soft"
                                                                sx={{ backgroundColor: '#331B1E' }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <HeadRow title='Channel Inbound' />
                        <TableContainer component={Paper}
                            sx={{
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                            }}
                        >
                            <Table size="small"
                            >
                                <TableHead>
                                    <TableRow
                                    >
                                        <TableCell align='center' />
                                        <TableCell align='center'>{t('table_bottom.time')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.ch_inbound')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.number_inbound')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table2Data.map((row: any, index: any) => (
                                        <TableRow hover key={index}>
                                            <TableCell align='center' />
                                            <TableCell align='center'>{row.time}</TableCell>
                                            <TableCell align='center'>{row.channel}</TableCell>
                                            <TableCell align='center'>{row.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <HeadRow title='Channel Outbound' />
                        <TableContainer component={Paper}
                            sx={{
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                            }}
                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>{ }</TableCell>
                                        <TableCell align='center'>{t('table_bottom.time')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.ch_outbound')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.number_outbound')}</TableCell>
                                        <TableCell align='center'>{ }</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table3Data.map((row: any, index: number | string) => (
                                        <TableRow hover key={index}>
                                            <TableCell align='center'>{ }</TableCell>
                                            <TableCell align='center'>{row.time}</TableCell>
                                            <TableCell align='center'>{row.channel}</TableCell>
                                            <TableCell align='center'>{row.count}</TableCell>
                                            <TableCell align='center' />
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                </Grid>
            </Box>
        </DashboardContent>
    );
}