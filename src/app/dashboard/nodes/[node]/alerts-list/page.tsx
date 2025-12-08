'use client';

import React from 'react';
import { AlertListView } from 'src/sections/nodes/alert-list/view';


type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    const { node } = params;
    return (
        <AlertListView nodeId={node} />
    );
}
