'use client';

import React from 'react';
import { FunctionListView } from 'src/sections/nodes/function-list/view';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    return <FunctionListView nodeId={params.node} />;
}
