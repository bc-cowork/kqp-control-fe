'use client';

import { Typography, Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslate } from 'src/locales';
import { ReportListView } from 'src/sections/nodes/report-list/view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    const { node } = params;

    return (
        <ReportListView nodeId={node} />
    );
}
