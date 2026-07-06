'use client';

import type { ReactNode } from 'react';

import { useCallback } from 'react';

import { Box, Stack, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';
import { useGetIssueItemInfo, useGetIssueItemQuotes } from 'src/actions/nodes';

import { BtnGhost, PageShell } from 'src/components/v5';

import { MemoryItemInfo } from '../memory-page/MemoryItemInfo';
import { MemoryIssueInfoTable } from '../memory-page/MemoryIssueInfoTable';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  code: string;
};

// Order-book (호가) ladder — distinctive blue (ask) / red (bid) colour coding.
const BLUE = '#7AA2FF';
const RED = '#FF8882';

export function MemoryItem({ selectedNodeId, code }: Props) {
  const { t } = useTranslate('memory');
  const router = useRouter();

  const { issueInfo, issueInfoLoading, issueInfoValidating, onRefresh } = useGetIssueItemInfo(
    selectedNodeId,
    code
  );

  const {
    issueQuotesAsk,
    issueQuotesBid,
    issueQuotesLoading,
    issueQuotesValidating,
    issueQuotesError,
    onRefresh: onRefreshQuote,
  } = useGetIssueItemQuotes(selectedNodeId, code);

  const rowKeysAsk = Object.keys(issueQuotesAsk)
    .filter((key) => key !== 'sum')
    .sort((a, b) => Number(b) - Number(a));
  const sumDataAsk = issueQuotesAsk?.sum || { uni: 0, krx: 0, nxt: 0, price: 0 };

  const rowKeysBid = Object.keys(issueQuotesBid)
    .filter((key) => key !== 'sum')
    .sort((a, b) => Number(a) - Number(b));
  const sumDataBid = issueQuotesBid?.sum || { uni: 0, krx: 0, nxt: 0, price: 0 };

  const handleRefresh = useCallback(() => {
    onRefresh();
    onRefreshQuote();
  }, [onRefresh, onRefreshQuote]);

  const infoLoading = issueInfoLoading || issueInfoValidating;
  const quotesLoading = issueQuotesLoading || issueQuotesValidating;

  const num = (v: number | undefined) => (v || v === 0 ? v.toLocaleString() : '-');

  return (
    <PageShell
      node={selectedNodeId}
      crumbs={[
        {
          label: t('top.memory'),
          onClick: () => router.push(paths.dashboard.nodes.memory(selectedNodeId)),
        },
        { label: issueInfo.name || code },
      ]}
      title={issueInfo.name || '-'}
      scroll={false}
      actions={
        <BtnGhost icon="eva:refresh-fill" onClick={handleRefresh}>
          {t('item.refresh')}
        </BtnGhost>
      }
    >
      <Stack direction="row" spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* LEFT — info card + summary quote table */}
        <Box sx={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {infoLoading ? (
            <Box sx={{ p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              <MemoryItemInfo issueInfo={issueInfo} />
              <MemoryIssueInfoTable issueInfo={issueInfo} />
            </>
          )}
        </Box>

        {/* RIGHT — order-book (호가) ladder */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            bgcolor: T.bgCard,
            overflow: 'auto',
          }}
        >
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box component="thead">
              <Box component="tr">
                {[
                  t('item.table.no'),
                  t('item.table.price'),
                  t('item.table.uni'),
                  t('item.table.krx'),
                  t('item.table.nxt'),
                ].map((label) => (
                  <Box
                    key={label}
                    component="th"
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      bgcolor: T.bgPanel,
                      color: T.textSec,
                      fontWeight: 500,
                      fontSize: 14.5,
                      textAlign: 'right',
                      p: '9px 14px',
                      borderBottom: `1px solid ${T.border}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {quotesLoading ? (
                <LadderPlaceholder text={t('common.loading')} />
              ) : issueQuotesError ? (
                <LadderPlaceholder text={t('common.load_failed')} error />
              ) : (
                <>
                  {/* Ask total (indigo top-total row) */}
                  <TotalRow
                    color={T.accent}
                    bg="#4A3BFF1A"
                    price={num(sumDataAsk.price)}
                    uni={num(sumDataAsk.uni)}
                    krx={num(sumDataAsk.krx)}
                    nxt={num(sumDataAsk.nxt)}
                  />

                  {rowKeysAsk.map((key) => {
                    const q = (issueQuotesAsk as Record<string, any>)[key];
                    return (
                      <LadderRow
                        key={`ask-${key}`}
                        no={key}
                        price={num(q?.price)}
                        priceColor={BLUE}
                        uni={num(q?.uni)}
                        krx={num(q?.krx)}
                        nxt={num(q?.nxt)}
                      />
                    );
                  })}

                  {/* Spacer between ask + bid groups */}
                  <Box component="tr">
                    <Box component="td" colSpan={5} sx={{ height: 6, bgcolor: T.bgPanel, p: 0 }} />
                  </Box>

                  {rowKeysBid.map((key) => {
                    const q = (issueQuotesBid as Record<string, any>)[key];
                    return (
                      <LadderRow
                        key={`bid-${key}`}
                        no={key}
                        price={num(q?.price)}
                        priceColor={RED}
                        uni={num(q?.uni)}
                        krx={num(q?.krx)}
                        nxt={num(q?.nxt)}
                      />
                    );
                  })}

                  {/* Bid total (red bottom-total row) */}
                  <TotalRow
                    color={RED}
                    bg="#331B1E66"
                    price={num(sumDataBid.price)}
                    uni={num(sumDataBid.uni)}
                    krx={num(sumDataBid.krx)}
                    nxt={num(sumDataBid.nxt)}
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
    </PageShell>
  );
}

// ----------------------------------------------------------------------

const bodyCellSx = {
  p: '7px 14px',
  textAlign: 'right' as const,
  fontFamily: FONT_MONO,
  fontSize: 15.5,
  color: T.textPrim,
  whiteSpace: 'nowrap' as const,
};

function LadderRow({
  no,
  price,
  priceColor,
  uni,
  krx,
  nxt,
}: {
  no: string;
  price: ReactNode;
  priceColor: string;
  uni: ReactNode;
  krx: ReactNode;
  nxt: ReactNode;
}) {
  return (
    <Box component="tr" sx={{ borderBottom: `1px solid ${T.borderSub}` }}>
      <Box component="td" sx={bodyCellSx}>
        {no}
      </Box>
      <Box component="td" sx={{ ...bodyCellSx, color: priceColor }}>
        {price}
      </Box>
      <Box component="td" sx={bodyCellSx}>
        {uni}
      </Box>
      <Box component="td" sx={bodyCellSx}>
        {krx}
      </Box>
      <Box component="td" sx={bodyCellSx}>
        {nxt}
      </Box>
    </Box>
  );
}

function TotalRow({
  color,
  bg,
  price,
  uni,
  krx,
  nxt,
}: {
  color: string;
  bg: string;
  price: ReactNode;
  uni: ReactNode;
  krx: ReactNode;
  nxt: ReactNode;
}) {
  const totalCellSx = { ...bodyCellSx, color, fontWeight: 500, bgcolor: bg };
  return (
    <Box component="tr">
      <Box component="td" sx={{ ...bodyCellSx, bgcolor: bg }} />
      <Box component="td" sx={{ ...bodyCellSx, color, bgcolor: bg }}>
        {price}
      </Box>
      <Box component="td" sx={totalCellSx}>
        {uni}
      </Box>
      <Box component="td" sx={totalCellSx}>
        {krx}
      </Box>
      <Box component="td" sx={totalCellSx}>
        {nxt}
      </Box>
    </Box>
  );
}

function LadderPlaceholder({ text, error }: { text: string; error?: boolean }) {
  return (
    <Box component="tr">
      <Box
        component="td"
        colSpan={5}
        sx={{ p: '28px 14px', textAlign: 'center', color: error ? T.off : T.textDim, fontSize: 15 }}
      >
        {text}
      </Box>
    </Box>
  );
}
