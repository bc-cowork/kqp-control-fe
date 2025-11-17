'use client';


import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { endpoints, fetcher } from 'src/utils/axios';
import useSWR from 'swr';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function RuleList({ selectedNodeId }: Props) {
  const { t } = useTranslate('rule-list');
  const router = useRouter();
  const url = endpoints.rules.list(selectedNodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);
  const processes: any[] = (data && data.data && data.data.list) || [];
  const processLoading = isLoading;
  const processError = error;
  const processesEmpty = !processLoading && processes.length === 0;


  return (
    <TableContainer component={Paper} sx={{ height: 'calc(100vh - 380px)' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="left">{t('table_header.id')}</TableCell>
            <TableCell>{t('table_header.name')}</TableCell>
            <TableCell>{t('table_header.path')}</TableCell>
            <TableCell align="left">{t('table_header.timestamp')}</TableCell>
            <TableCell align="left">{t('table_header.ref_layout')}</TableCell>
            <TableCell align="left">{t('table_header.ref_process')}</TableCell>
            <TableCell align="left">{t('table_header.ref_actions')}</TableCell>
            <TableCell>{t('table_header.desc')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processLoading ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : processesEmpty ? (
            <TableRow>
              <TableCell colSpan={9}>No Processes Found</TableCell>
            </TableRow>
          ) : processError ? (
            <TableRow>
              <TableCell colSpan={9}>Error Fetching Process List</TableCell>
            </TableRow>
          ) : (
            processes.map((process: any, index: number) => (
              <TableRow
                key={process.name}
                onClick={() => router.push(`/dashboard/nodes/${selectedNodeId}/rules/${process.name}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell align="left"></TableCell>
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell>{process.name}</TableCell>
                <TableCell>{process.path}</TableCell>
                <TableCell align="left">{process.timestamp}</TableCell>
                <TableCell align="left">{process.ref_layout}</TableCell>
                <TableCell align="left">{Number(process?.ref_process)?.toLocaleString()}</TableCell>
                <TableCell align="left">{process.ref_actions}</TableCell>
                <TableCell>{process.desc}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
