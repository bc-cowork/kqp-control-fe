'use client';

import React from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';

type Props = {
    params: { node: string; identifyId: string };
};

export default function Page({ params }: Props) {
    const { node, identifyId } = params;
    const { t } = useTranslate('identify-list');

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.identify_list'), link: paths.dashboard.nodes.identifyList(node) },
                    { pageName: decodeURIComponent(identifyId) },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>
                IDENTIFY: {decodeURIComponent(identifyId)}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={7}>
                    <Grid >
                        <Box sx={{ backgroundColor: '#E0E4EB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <Typography sx={{ p: 1, py: 0.5 }} variant="body2" color="text.primary">
                                Key
                            </Typography>
                            <Box sx={{ backgroundColor: '#5E66FF', p: 1, py: 1.5 }}>
                                <Typography variant="body2" color="text.light">
                                    {`‘A301S', 'A301Q’`}.
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
                                                            <TableCell>No</TableCell>
                                                            <TableCell>연관 전문</TableCell>
                                                            <TableCell>참조 빈도</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>1</TableCell>
                                                            <TableCell>A301S</TableCell>
                                                            <TableCell>15</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>2</TableCell>
                                                            <TableCell>A301Q</TableCell>
                                                            <TableCell>13</TableCell>
                                                        </TableRow>
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
                    <Paper sx={{ height: '100%' }}>
                        <Box sx={{ backgroundColor: '#E0E4EB', p: 2, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
                            <Typography sx={{ fontWeight: 600 }}>{t('detail_table.script_title')}</Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#202838', height: 'calc(100% - 48px)', overflowY: 'auto' }}>
                            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, color: '#AFB7C8', m: 0 }}>
                                {`-- krx_fill.moon

                                return {
                                    desc:                     '체결 (KRX)'
                                keys:                     {'A301S', 'A301Q'}
                                issue_select:       {6}
                                specs:                   'A3_FILL'
                                skip_spec_cache:        true
                                process: {
                                    lfn:                     'lfn_krx_fill'
                                param:
                                mkt:              1
    }
                                distribute: {
                                    format:             'DST_FILL'
                                lfn_gen:            'gen_fill'
    }
}
                                `}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </DashboardContent >
    );
}


