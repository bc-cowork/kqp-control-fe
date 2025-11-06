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

type IdentifyItem = {
    id: string;
    identityName: string;
    path: string;
    timestamp: string;
    refSpecs?: number | string;
    explanation?: string;
};

export function IdentifyListView({ nodeId }: Props) {
    const { t } = useTranslate("identify-list");
    const router = useRouter();

    const url = endpoints.identify.list(nodeId);
    const { data, error, isLoading } = useSWR(url, fetcher);

    const rows: IdentifyItem[] = (data && data.data && data.data.identifyList) || [];

    return (
        <DashboardContent maxWidth="xl">
            <Breadcrumb node={nodeId} pages={[{ pageName: t("top.identify_list") }]} />

            <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
                {t("top.identify_list")}
            </Typography>

            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("table.id")}</TableCell>
                                <TableCell>{t("table.identity_name")}</TableCell>
                                <TableCell>{t("table.path")}</TableCell>
                                <TableCell>{t("table.timestamp")}</TableCell>
                                <TableCell>{t("table.ref_specs")}</TableCell>
                                <TableCell>{t("table.explanation")}</TableCell>
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

                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    tabIndex={0}
                                    onClick={() => router.push(paths.dashboard.nodes.identifyDetail(nodeId, String(row.id)))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            router.push(paths.dashboard.nodes.identifyDetail(nodeId, String(row.id)));
                                        }
                                    }}
                                >
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.identityName}</TableCell>
                                    <TableCell>{row.path}</TableCell>
                                    <TableCell>{row.timestamp}</TableCell>
                                    <TableCell>{row.refSpecs}</TableCell>
                                    <TableCell>{row.explanation}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </DashboardContent>
    );
}


