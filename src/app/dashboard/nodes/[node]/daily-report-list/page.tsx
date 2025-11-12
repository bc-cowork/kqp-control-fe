'use client';

import { Typography, Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslate } from 'src/locales';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    const { node } = params;
    const { t } = useTranslate('daily-report-list');
    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={node} pages={[{ pageName: t('top.title') }]} />
            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
                {t('top.title')}
            </Typography>
            <Box
                sx={{
                    mt: '28px',
                    width: 1,
                }}
            />
        </DashboardContent >
    );
}
