'use client';

import React from 'react';
import { IdentifyListView } from 'src/sections/nodes/identify-list/view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    return <IdentifyListView nodeId={params.node} />;
}
