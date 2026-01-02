'use client';

import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslate } from 'src/locales';
import { DisplaySettings } from 'src/sections/settings/DisplaySettings';


export default function Page() {
    const { t } = useTranslate('settings');


    return <div>
        <DashboardContent maxWidth="xl">
            <Breadcrumb />

            <Typography sx={{ fontSize: 28, fontWeight: 600, color: (theme) => theme.palette.mode === 'dark' ? grey[50] : '#373F4E', mt: 2 }}>
                {t('title')}
            </Typography>
            <DisplaySettings />
        </DashboardContent>
    </div>;
}
