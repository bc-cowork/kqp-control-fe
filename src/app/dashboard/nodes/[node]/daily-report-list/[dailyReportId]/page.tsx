'use client';

import useSWR from 'swr';
import React from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

import { Panel, PageShell, CodeBlock, SectionLabel } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  params: {
    node: string;
    dailyReportId: string;
  };
};

export default function Page({ params }: Props) {
  const { node, dailyReportId } = params;
  const router = useRouter();
  const { t } = useTranslate('daily-report-list');
  const decodedReport = decodeURIComponent(dailyReportId);

  const url = endpoints.report.detail(node, decodedReport);
  const { data, isLoading, error } = useSWR(url, fetcher);

  const reportItem = data?.data?.report || {};
  const reportEmpty = data?.data?.report == null;
  const reportDefinition: string = data?.data?.contents || '';

  const fields: {
    label: string;
    value: any;
    primary?: boolean;
    mono?: boolean;
    grow?: boolean;
  }[] = [
    { label: t('table.report_name'), value: reportItem?.name, primary: true },
    { label: t('table.job_at'), value: reportItem?.job_at, mono: true },
    { label: t('table.last_exec'), value: reportItem?.last_exec, mono: true },
    { label: t('table.desc'), value: reportItem?.desc, grow: true },
  ];

  const statusText = isLoading
    ? t('loading')
    : error
      ? t('error')
      : reportEmpty
        ? t('empty_detail')
        : null;

  return (
    <PageShell
      node={node}
      crumbs={[
        {
          label: t('top.title'),
          onClick: () => router.push(paths.dashboard.nodes.dailyReportList(node)),
        },
        { label: decodedReport },
      ]}
      title={`${t('report')} : ${decodedReport}`}
    >
      <Panel>
        {statusText ? (
          <Box
            sx={{
              p: '28px 14px',
              textAlign: 'center',
              color: error ? T.off : T.textDim,
              fontSize: 15,
            }}
          >
            {statusText}
          </Box>
        ) : (
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 17 }}>
            <Box component="tbody">
              <Box component="tr">
                {fields.map((f, i) => {
                  const last = i === fields.length - 1;
                  return (
                    <React.Fragment key={f.label}>
                      <Box
                        component="th"
                        sx={{
                          p: '11px 14px',
                          width: 110,
                          color: T.textSec,
                          fontSize: 14.5,
                          fontWeight: 500,
                          textAlign: 'left',
                          borderRight: `1px solid ${T.borderSub}`,
                          bgcolor: T.bgPanel,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {f.label}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: '11px 14px',
                          width: f.grow ? 'auto' : undefined,
                          borderRight: last ? 'none' : `1px solid ${T.borderSub}`,
                          fontFamily: f.mono ? FONT_MONO : 'inherit',
                          color: f.primary ? T.primary : T.textSec,
                          fontWeight: f.primary ? 400 : 350,
                        }}
                      >
                        {f.value ?? '—'}
                      </Box>
                    </React.Fragment>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Panel>

      <SectionLabel>{t('contents_title')}</SectionLabel>
      <CodeBlock theme="default">{isLoading ? '' : error ? '' : reportDefinition}</CodeBlock>
    </PageShell>
  );
}
