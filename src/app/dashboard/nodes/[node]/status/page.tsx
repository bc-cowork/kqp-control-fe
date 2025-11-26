'use client';

import React from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslate } from 'src/locales';
import { RrefreshButton } from 'src/components/common/RefreshButton';

type Props = { params: { node: string } };


const table2 = [
    { time: '8:05:23', channelInbound: 126, numberInbound: 408 },
    { time: '8:05:23', channelInbound: 127, numberInbound: 409 },
    { time: '8:05:23', channelInbound: 128, numberInbound: 410 },
    { time: '8:05:23', channelInbound: 129, numberInbound: 411 },
    { time: '8:05:23', channelInbound: 130, numberInbound: 412 },
    { time: '8:05:23', channelInbound: 130, numberInbound: 412 },
    { time: '8:05:23', channelInbound: 130, numberInbound: 412 },
    { time: '8:05:23', channelInbound: 130, numberInbound: 412 },
];

const table3 = [
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
    { time: '8:05:23', channelOutbound: 804, numberOutbound: 80523 },
];

export default function Page({ params }: Props) {
    const { node } = params;
    const { t } = useTranslate('status');


    const table1 = [
        { Item: t('table_top.process'), Max: 49, Cur: 49, Odd: '', abnormal: false },
        { Item: t('table_top.que'), Max: 49, Cur: 48, Odd: '', abnormal: false },
        { Item: t('table_top.ch_inbound'), Max: 408, Cur: 108, Odd: 1, abnormal: true },
        { Item: t('table_top.ch_outbound'), Max: 127, Cur: 127, Odd: '', abnormal: false },
    ]
    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={node} pages={[{ pageName: t('top.title') }]} />
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
                    {t('top.title')}
                </Typography>
                <RrefreshButton onRefresh={() => console.log("lol")} />
            </Stack>

            <Box sx={{ mt: '28px', width: 1 }}>
                <Grid container spacing={3}>

                    {/* Top: single wide table for table1 */}
                    <Grid item xs={12}>
                        <Grid xs={12} md={8} lg={6}>
                            <TableContainer component={Paper}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('table_top.item')}</TableCell>
                                            <TableCell>{t('table_top.max')}</TableCell>
                                            <TableCell>{t('table_top.cur')}</TableCell>
                                            <TableCell>{t('table_top.odd')}</TableCell>
                                            <TableCell>{ }</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {table1.map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{row.Item}</TableCell>
                                                <TableCell>{row.Max}</TableCell>
                                                <TableCell>{row.Cur}</TableCell>
                                                <TableCell>{row.Odd}</TableCell>

                                                <TableCell>
                                                    {row.abnormal && (
                                                        <Chip label="Abnormal" color="error" size="small" variant="soft" sx={{
                                                            backgroundColor: '#331B1E'
                                                        }} />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    {/* Bottom: two tables side-by-side for table2 and table3 */}
                    <Grid item xs={12} md={6}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>{t('table_bottom.time')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.ch_inbound')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.number_inbound')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table2.map((row, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell align='center'>{row.time}</TableCell>
                                            <TableCell align='center'>{row.channelInbound}</TableCell>
                                            <TableCell align='center'>{row.numberInbound}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>{t('table_bottom.ch_outbound')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.number_outbound')}</TableCell>
                                        <TableCell align='center'>{t('table_bottom.time')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table3.map((row, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell align='center'>{row.channelOutbound}</TableCell>
                                            <TableCell align='center'>{row.numberOutbound}</TableCell>
                                            <TableCell align='center'>{row.time}</TableCell>
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
