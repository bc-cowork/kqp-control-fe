'use client';

import React from 'react';
import { SpecListView } from 'src/sections/nodes/spec-list/view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    return (
        <SpecListView nodeId={params.node} />
    );
}
