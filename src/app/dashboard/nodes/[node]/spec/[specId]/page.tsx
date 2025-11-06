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

// ----------------------------------------------------------------------

type Props = {
    params: {
        node: string;
        specId: string;
    };
};

type IdentifyRow = { id?: number; name: string; refCount: number };

type FragRow = { offset: number; len: number; type: string; desc: string };

export default function Page({ params }: Props) {
    const { node, specId } = params;
    const { t } = useTranslate('spec-detail');

    const url = endpoints.spec.detail(node, decodeURIComponent(specId));
    const { data, error, isLoading } = useSWR(url, fetcher);

    const detail = data?.data || {};
    const identifiers: IdentifyRow[] = detail.identifyList || [];
    const frags: FragRow[] = Array.isArray(detail.frags) ? detail.frags : [];
    const fragsCount = detail.fragsCount ?? frags.length ?? 0;
    const sizeCount = detail.size ?? 0;

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.spec_list'), link: paths.dashboard.nodes.specList(node) },
                    { pageName: decodeURIComponent(specId) },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{detail.specName || decodeURIComponent(specId)}</Typography>

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
                                        <TableRow key={row.name + idx}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.refCount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ ml: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    {t('left.ref_identifier_with_count', { count: identifiers.length })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t('left.frags_sizes', { frags: fragsCount, sizes: sizeCount })}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right side - Fragments table with dark background */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ backgroundColor: '#181A20', color: '#D4DCFA' }}>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#D4DCFA' }}>{t('right.offset')}</TableCell>
                                            <TableCell sx={{ color: '#D4DCFA' }}>{t('right.len')}</TableCell>
                                            <TableCell sx={{ color: '#D4DCFA' }}>{t('right.type')}</TableCell>
                                            <TableCell sx={{ color: '#D4DCFA' }}>{t('right.desc')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading && (
                                            <TableRow>
                                                <TableCell colSpan={4} sx={{ color: '#D4DCFA' }}>
                                                    {t('loading')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {error && (
                                            <TableRow>
                                                <TableCell colSpan={4} sx={{ color: '#D4DCFA' }}>
                                                    {t('error')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {!isLoading && !error && frags.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} sx={{ color: '#D4DCFA' }}>
                                                    {t('empty')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {frags?.map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell sx={{ color: '#AFB7C8' }}>{row.offset}</TableCell>
                                                <TableCell sx={{ color: '#AFB7C8' }}>{row.len}</TableCell>
                                                <TableCell sx={{ color: '#AFB7C8' }}>{row.type}</TableCell>
                                                <TableCell sx={{ color: '#AFB7C8' }}>{row.desc}</TableCell>
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
