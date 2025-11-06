'use client';

import React from 'react';

type Props = { params: { node: string } };

export default function Page({ params }: Props) {
    return (
        <div style={{ padding: 24 }}>
            <h1>Identify List — Node: {params.node}</h1>
            <p>Placeholder page for Identify List. Add UI here.</p>
        </div>
    );
}
