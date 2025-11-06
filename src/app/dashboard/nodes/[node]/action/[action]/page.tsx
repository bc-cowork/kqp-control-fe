"use client";

import React from 'react';
import { Typography, Box } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';

type Props = {
    params: {
        node: string;
        action: string;
    };
};

export default function Page({ params }: Props) {
    const { node, action } = params;
    const { t } = useTranslate('action-list');

    const decodedAction = decodeURIComponent(action);

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb
                node={node}
                pages={[
                    { pageName: t('top.action_list'), link: paths.dashboard.nodes.actionList(node) },
                    { pageName: decodedAction },
                ]}
            />

            <Typography sx={{ fontSize: 28, fontWeight: 500, mt: 2 }}>{decodedAction}</Typography>

            <Box sx={{ mt: 3 }}>
                <Typography variant="body1">{t('detail.placeholder') || 'Action details will appear here.'}</Typography>
            </Box>
        </DashboardContent>
    );
}
