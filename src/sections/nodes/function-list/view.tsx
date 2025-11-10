"use client";

import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
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

type Props = { nodeId: string };

type FunctionItem = {
    id: string;
    name: string;
    path: string;
    timestamp: string;
    ref_identifies?: number | string;
    desc?: string;
};

export function FunctionListView({ nodeId }: Props) {
    const { t } = useTranslate("function-list");
    const router = useRouter();

    const url = endpoints.function.list(nodeId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const rows: FunctionItem[] = (data && data.data && data.data.list) || [];

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={nodeId} pages={[{ pageName: t("top.function_list") }]} />

            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
                {t("top.function_list")}
            </Typography>

            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("table.id")}</TableCell>
                                <TableCell>{t("table.function_name")}</TableCell>
                                <TableCell>{t("table.path")}</TableCell>
                                <TableCell>{t("table.timestamp")}</TableCell>
                                <TableCell>{t("table.ref_identifies")}</TableCell>
                                <TableCell>{t("table.desc")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={6}>{t("loading") || "Loading..."}</TableCell>
                                </TableRow>
                            )}

                            {error && (
                                <TableRow>
                                    <TableCell colSpan={6}>{t("error") || "Failed to load"}</TableCell>
                                </TableRow>
                            )}

                            {!isLoading && !error && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>{t("empty") || "No identities"}</TableCell>
                                </TableRow>
                            )}

                            {rows.map((row, index) => (
                                <TableRow
                                    key={row.name}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    tabIndex={0}
                                    onClick={() => router.push(paths.dashboard.nodes.functionDetail(nodeId, String(row.name)))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            router.push(paths.dashboard.nodes.functionDetail(nodeId, String(row.name)));
                                        }
                                    }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.path}</TableCell>
                                    <TableCell>{row.timestamp}</TableCell>
                                    <TableCell>{row.ref_identifies}</TableCell>
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


