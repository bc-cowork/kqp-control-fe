'use client';

import React from 'react';
import { ReportListView } from 'src/sections/nodes/report-list/view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    const { node } = params;

    return (
        <ReportListView nodeId={node} />
    );
}
