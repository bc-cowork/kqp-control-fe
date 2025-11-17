'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useSWR from 'swr';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { fetcher, endpoints } from 'src/utils/axios';
import Chip from '@mui/material/Chip';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

type Props = {
    params: {
        node: string;
        specId: string;
    };
};

type IdentifyRow = { id?: number; name: string; ref_count: number, url: string };

type FragRow = { order: number, offset: number; length: number; type: string; desc: string };

export default function Page({ params }: Props) {
    const { node, specId } = params;
    const { t } = useTranslate('spec-detail');
    const router = useRouter();

    const url = endpoints.spec.detail(node, decodeURIComponent(specId));
    const { data, error, isLoading } = useSWR(url, fetcher);


    const specItem = data?.data?.detail || {};
    const detail = data?.data?.detail || {};
    const specName = data?.data?.detail?.name;
    const identifiers: IdentifyRow[] = detail.related_identifies || [];
    const frags: FragRow[] = Array.isArray(detail.spec_definition) ? detail.spec_definition : [];


    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.spec_list'), link: paths.dashboard.nodes.specList(node) },
                    { pageName: specName },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{"SPEC: "}{specName}</Typography>
            <TableContainer
                component={Paper}
                sx={{ height: 'auto', my: 2 }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ }</TableCell>
                            <TableCell>{t('table.spec_name')}</TableCell>
                            <TableCell>{t('table.path')}</TableCell>
                            <TableCell align="left">{t('table.timestamp')}</TableCell>
                            <TableCell align="left">{t('table.ref_identifies')}</TableCell>
                            <TableCell>{t('table.frags')}</TableCell>
                            <TableCell>{t('table.size')}</TableCell>
                            <TableCell align="left">{t('table.explanation')}</TableCell>
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
                        ) : specItem == null ? (
                            <TableRow>
                                <TableCell colSpan={10}>No Action Rule</TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={10}>Error Fetching Rule</TableCell>
                            </TableRow>
                        ) : (
                            <TableRow
                                key={specItem.name}
                                hover
                            >
                                <TableCell align="left">{ }</TableCell>
                                <TableCell align="left">{specItem.name}</TableCell>
                                <TableCell>{specItem.path}</TableCell>
                                <TableCell align='left'>{specItem.timestamp}</TableCell>
                                <TableCell align="left">{specItem.ref_identifies}</TableCell>
                                <TableCell align="left">{specItem.frags}</TableCell>
                                <TableCell align="left">{specItem.size}</TableCell>
                                <TableCell align="left">{specItem?.desc}</TableCell>
                                <TableCell align="left">{ }</TableCell>

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    {/* Left side - Identifiers table */}
                    <Grid item xs={12} md={5}>
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('left.no')}</TableCell>
                                        <TableCell>{t('left.identifier')}</TableCell>
                                        <TableCell>{t('left.ref_count')}</TableCell>
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
                                    {!isLoading && !error && identifiers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3}>{t('empty')}</TableCell>
                                        </TableRow>
                                    )}
                                    {identifiers.map((row, idx) => (
                                        <TableRow
                                            hover
                                            key={row.name + idx}

                                        >
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell
                                                onClick={() =>
                                                    router.push(`${paths.dashboard.nodes.identifyDetail(node, row.url.split('/')[row.url.split('/').length - 1])}`)
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
                    </Grid>

                    {/* Right side - Fragments table with dark background */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ backgroundColor: '#202838', p: 0.5, color: '#D4DCFA', }}>
                            <Box sx={{ backgroundColor: (theme) => theme.palette.grey[400], p: 1, mb: 2, borderTopLeftRadius: 8, borderTopRightRadius: 8, position: 'sticky' }}>
                                <Typography sx={{ fontWeight: 600 }}>{t('top.prof_definition')}</Typography>
                            </Box>
                            <TableContainer sx={{ p: 0.5, overflowY: 'auto', maxHeight: 'calc(64vh)' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('right.order')}</TableCell>
                                            <TableCell>{t('right.offset')}</TableCell>
                                            <TableCell>{t('right.len')}</TableCell>
                                            <TableCell>{t('right.type')}</TableCell>
                                            <TableCell>{t('right.desc')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading && (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    {t('loading')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {error && (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    {t('error')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {!isLoading && !error && frags.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    {t('empty')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {frags?.map((row, idx) => (
                                            <TableRow sx={{ '&:nth-child(odd)': { backgroundColor: '#202838' }, '&:nth-child(even)': { backgroundColor: '#141C2A' } }} key={idx}>
                                                <TableCell>{row.order}</TableCell>
                                                <TableCell>
                                                    <Chip label={row.offset} sx={{
                                                        backgroundColor: '#1D2F20',
                                                        color: '#7EE081'
                                                    }} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={row.length} sx={{
                                                        backgroundColor: '#1D2654',
                                                        color: '#7AA2FF'
                                                    }} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell >
                                                    <Chip label={row.type}
                                                        sx={{
                                                            backgroundColor: '#31291D',
                                                            color: '#FFC711'
                                                        }}
                                                        size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>{row.desc}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </DashboardContent>
    );
}
