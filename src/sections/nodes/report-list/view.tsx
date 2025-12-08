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

type ReportItem = {
    id: string;
    name: string;
    job_at: string;
    last_exec?: number | string;
    desc?: string;
};

export function ReportListView({ nodeId }: Props) {
    const { t } = useTranslate('daily-report-list');
    const router = useRouter();

    const url = endpoints.function.list(nodeId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const rows: ReportItem[] = (data && data.data && data.data.list) || [];

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={nodeId} pages={[{ pageName: t("top.title") }]} />

            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
                {t("top.title")}
            </Typography>

            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{ }</TableCell>
                                <TableCell>{t("table.id")}</TableCell>
                                <TableCell>{t("table.report_name")}</TableCell>
                                <TableCell>{t("table.job_at")}</TableCell>
                                <TableCell>{t("table.last_exec")}</TableCell>
                                <TableCell>{t("table.desc")}</TableCell>
                                <TableCell>{ }</TableCell>
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
                                    <TableCell colSpan={6}>{t("empty") || "No Report Item"}</TableCell>
                                </TableRow>
                            )}

                            {rows.map((row, index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ cursor: 'pointer' }}
                                    tabIndex={0}
                                    onClick={() => router.push(paths.dashboard.nodes.dailyReportDetail(nodeId, String(row.name)))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            router.push(paths.dashboard.nodes.dailyReportDetail(nodeId, String(row.name)));
                                        }
                                    }}
                                >
                                    <TableCell>{ }</TableCell>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.job_at}</TableCell>
                                    <TableCell>{row.last_exec}</TableCell>
                                    <TableCell>{row.desc}</TableCell>
                                    <TableCell>{ }</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </DashboardContent>
    );
}


