"use client";

import React from "react";
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";

import { grey } from "src/theme/core";
import { useTranslate } from "src/locales";
import { DashboardContent } from "src/layouts/dashboard";
import useSWR from "swr";
import { Breadcrumb } from "src/components/common/Breadcrumb";
import { fetcher, endpoints } from "src/utils/axios";
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type SpecItem = {
    id: string;
    name: string;
    path: string;
    timestamp: string;
    ref_identifies?: string;
    frags?: number;
    size?: number;
    desc?: string;
};

type Props = { nodeId: string };

export function SpecListView({ nodeId }: Props) {
    const { t } = useTranslate("spec-list");
    const router = useRouter();
    const url = endpoints.spec.list(nodeId);
    const { data, error, isLoading } = useSWR(url, fetcher);
    const rows: SpecItem[] = (data && data.data && data.data.list) || [];
    console.log('rows', rows);

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={nodeId} pages={[{ pageName: t("top.spec_list") }]} />
            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>{t("top.spec_list")}</Typography>
            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("table.id")}</TableCell>
                                <TableCell>{t("table.spec_name")}</TableCell>
                                <TableCell>{t("table.path")}</TableCell>
                                <TableCell>{t("table.timestamp")}</TableCell>
                                <TableCell>{t("table.ref_identifies")}</TableCell>
                                <TableCell>{t("table.frags")}</TableCell>
                                <TableCell>{t("table.size")}</TableCell>
                                <TableCell>{t("table.explanation")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={8}>{t("loading") || "Loading..."}</TableCell>
                                </TableRow>
                            )}
                            {error && (
                                <TableRow>
                                    <TableCell colSpan={8}>{t("error") || "Failed to load"}</TableCell>
                                </TableRow>
                            )}
                            {!isLoading && !error && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8}>{t("empty") || "No specs"}</TableCell>
                                </TableRow>
                            )}
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    tabIndex={0}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => router.push(paths.dashboard.nodes.specDetail(nodeId, String(row.id)))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            router.push(paths.dashboard.nodes.specDetail(nodeId, String(row.id)));
                                        }
                                    }}
                                >
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.path}</TableCell>
                                    <TableCell>{row.timestamp}</TableCell>
                                    <TableCell>{row.ref_identifies}</TableCell>
                                    <TableCell>{row.frags}</TableCell>
                                    <TableCell>{row.size}</TableCell>
                                    <TableCell>{row.desc}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </DashboardContent>
    );
}
