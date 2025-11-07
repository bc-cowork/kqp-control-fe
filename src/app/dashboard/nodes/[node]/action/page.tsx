'use client';

import React from 'react';
import { ActionListView } from 'src/sections/nodes/action-list/view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    return <ActionListView nodeId={params.node} />;
}
