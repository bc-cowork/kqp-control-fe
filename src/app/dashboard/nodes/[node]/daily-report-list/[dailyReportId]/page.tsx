'use client';

import useSWR from 'swr';
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

  const fields: { label: string; value: any; primary?: boolean; mono?: boolean }[] = [
    { label: t('table.report_name'), value: reportItem?.name, primary: true },
    { label: t('table.job_at'), value: reportItem?.job_at, mono: true },
    { label: t('table.last_exec'), value: reportItem?.last_exec, mono: true },
    { label: t('table.desc'), value: reportItem?.desc },
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
              {fields.map((f) => (
                <Box
                  component="tr"
                  key={f.label}
                  sx={{ '&:not(:last-of-type)': { borderBottom: `1px solid ${T.borderSub}` } }}
                >
                  <Box
                    component="td"
                    sx={{
                      p: '11px 16px',
                      width: 200,
                      color: T.textSec,
                      fontWeight: 500,
                      borderRight: `1px solid ${T.borderSub}`,
                      bgcolor: T.bgPanel,
                      whiteSpace: 'nowrap',
                      verticalAlign: 'top',
                    }}
                  >
                    {f.label}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      p: '11px 16px',
                      fontFamily: f.mono ? FONT_MONO : 'inherit',
                      color: f.primary ? T.primary : T.textPrim,
                      fontWeight: f.primary ? 500 : 400,
                    }}
                  >
                    {f.value ?? '—'}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Panel>

      <SectionLabel>{t('contents_title')}</SectionLabel>
      <CodeBlock theme="default">{isLoading ? '' : error ? '' : reportDefinition}</CodeBlock>
    </PageShell>
  );
}
