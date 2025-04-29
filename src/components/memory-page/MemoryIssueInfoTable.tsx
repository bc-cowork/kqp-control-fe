'use client';

import { styled } from '@mui/material/styles';
import { Box, Stack, SvgIcon, Typography } from '@mui/material';

import { grey } from 'src/theme/core';

// Styled components for custom styling
const LabelBox = styled(Box)(({ theme }) => ({
  width: '25%',
  color: theme.palette.grey[400],
  fontSize: 15,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0 12px',
}));

const ValueBox = styled(Box)(({ theme }) => ({
  width: '25%',
  color: theme.palette.grey[600],
  fontSize: 15,
  fontWeight: 400,
  padding: '0 12px',
  textAlign: 'right',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  width: '25%',
  color: theme.palette.grey[50],
  fontSize: 15,
  fontWeight: 400,
  padding: '0 12px',
  textAlign: 'right',
}));

const RowStack = styled(Stack)(({ theme }) => ({
  height: 'calc(((100vh - 458px) / 2) / 4)',
  alignItems: 'center',
}));

const RowStackWide = styled(Stack)(({ theme }) => ({
  height: 'calc(((100vh - 458px) / 2) / 3)',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

type Props = {
  issueInfo: any;
};

export function MemoryIssueInfoTable({ issueInfo }: Props) {
  const tableData = {
    lastPrice: {
      uni: issueInfo.last_price?.uni?.toLocaleString() || '-',
      krx: issueInfo.last_price?.krx?.toLocaleString() || '-',
      nxt: issueInfo.last_price?.nxt?.toLocaleString() || '-',
    },
    lastVol: {
      uni: issueInfo.last_vol?.uni?.toLocaleString() || '-',
      krx: issueInfo.last_vol?.krx?.toLocaleString() || '-',
      nxt: issueInfo.last_vol?.nxt?.toLocaleString() || '-',
    },
    volAccum: {
      uni: issueInfo.vol_accum?.uni?.toLocaleString() || '-',
      krx: issueInfo.vol_accum?.krx?.toLocaleString() || '-',
      nxt: issueInfo.vol_accum?.nxt?.toLocaleString() || '-',
    },
    amtAccum: {
      uni: issueInfo.amt_accum?.uni?.toLocaleString() || '-',
      krx: issueInfo.amt_accum?.krx?.toLocaleString() || '-',
      nxt: issueInfo.amt_accum?.nxt?.toLocaleString() || '-',
    },
    open: {
      uni: issueInfo.open?.uni?.toLocaleString() || '-',
      krx: issueInfo.open?.krx?.toLocaleString() || '-',
      nxt: issueInfo.open?.nxt?.toLocaleString() || '-',
    },
    high: {
      uni: issueInfo.high?.uni?.toLocaleString() || '-',
      krx: issueInfo.high?.krx?.toLocaleString() || '-',
      nxt: issueInfo.high?.nxt?.toLocaleString() || '-',
    },
    low: {
      uni: issueInfo.low?.uni?.toLocaleString() || '-',
      krx: issueInfo.low?.krx?.toLocaleString() || '-',
      nxt: issueInfo.low?.nxt?.toLocaleString() || '-',
    },
  };

  const tableFill1 = '#FFFFFF';
  const tableFill2 = '#F9FAFB';

  return (
    <Box sx={{ mt: 0.5 }}>
      {/* Header Row */}
      <RowStack
        direction="row"
        sx={{ height: '32px', backgroundColor: grey[400], borderRadius: '8px' }}
      >
        <HeaderBox />
        <HeaderBox>UNI</HeaderBox>
        <HeaderBox>KRX</HeaderBox>
        <HeaderBox>NXT</HeaderBox>
      </RowStack>

      {/* Data Rows */}
      <Stack direction="column">
        {/* Last.Price Row */}
        <RowStack
          direction="row"
          sx={{
            backgroundColor: tableFill1,
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        >
          <LabelBox>Last.Price</LabelBox>
          <ValueBox>{tableData.lastPrice.uni}</ValueBox>
          <ValueBox>{tableData.lastPrice.krx}</ValueBox>
          <ValueBox>{tableData.lastPrice.nxt}</ValueBox>
        </RowStack>

        {/* Last.Vol Row */}
        <RowStack direction="row" sx={{ backgroundColor: tableFill2 }}>
          <LabelBox>Last.Vol</LabelBox>
          <ValueBox>{tableData.lastVol.uni}</ValueBox>
          <ValueBox>{tableData.lastVol.krx}</ValueBox>
          <ValueBox>{tableData.lastVol.nxt}</ValueBox>
        </RowStack>

        {/* Vol.Accum Row */}
        <RowStack direction="row" sx={{ backgroundColor: tableFill1 }}>
          <LabelBox>Vol.Accum</LabelBox>
          <ValueBox>{tableData.volAccum.uni}</ValueBox>
          <ValueBox>{tableData.volAccum.krx}</ValueBox>
          <ValueBox>{tableData.volAccum.nxt}</ValueBox>
        </RowStack>

        {/* Amt.Accum Row */}
        <RowStack direction="row" sx={{ backgroundColor: tableFill2 }}>
          <LabelBox>Amt.Accum</LabelBox>
          <ValueBox>{tableData.amtAccum.uni}</ValueBox>
          <ValueBox>{tableData.amtAccum.krx}</ValueBox>
          <ValueBox>{tableData.amtAccum.nxt}</ValueBox>
        </RowStack>

        <Box sx={{ backgroundColor: grey[100], height: '8px' }} />

        {/* Open Row */}
        <RowStackWide direction="row" sx={{ backgroundColor: tableFill1 }}>
          <LabelBox>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="16" height="16" rx="4" fill="#DDF4DA" />
                  <circle cx="8" cy="8" r="3" fill="#00A41E" />
                </svg>
              </SvgIcon>
              <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[400] }}>
                Open
              </Typography>
            </Box>
          </LabelBox>
          <ValueBox>{tableData.open.uni}</ValueBox>
          <ValueBox>{tableData.open.krx}</ValueBox>
          <ValueBox>{tableData.open.nxt}</ValueBox>
        </RowStackWide>

        {/* High Row */}
        <RowStackWide direction="row" sx={{ backgroundColor: tableFill2 }}>
          <LabelBox>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="16" height="16" rx="4" fill="#C7DBFF" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.64645 11.8536C1.45118 11.6583 1.45118 11.3417 1.64645 11.1464L6.64645 6.14645C6.84171 5.95118 7.15829 5.95118 7.35355 6.14645L9.5 8.29289L13.1464 4.64645C13.3417 4.45118 13.6583 4.45118 13.8536 4.64645C14.0488 4.84171 14.0488 5.15829 13.8536 5.35355L9.85355 9.35355C9.65829 9.54882 9.34171 9.54882 9.14645 9.35355L7 7.20711L2.35355 11.8536C2.15829 12.0488 1.84171 12.0488 1.64645 11.8536Z"
                    fill="#5E66FF"
                  />
                </svg>
              </SvgIcon>
              <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[400] }}>
                High
              </Typography>
            </Box>
          </LabelBox>
          <HighValueBox value={tableData.high.uni} />
          <HighValueBox value={tableData.high.krx} />
          <HighValueBox value={tableData.high.nxt} />
        </RowStackWide>

        {/* Low Row */}
        <RowStackWide
          direction="row"
          sx={{
            backgroundColor: tableFill1,
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
          }}
        >
          <LabelBox>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="16" height="16" rx="4" fill="#FFD8D8" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.64645 4.64645C1.45118 4.84171 1.45118 5.15829 1.64645 5.35355L6.64645 10.3536C6.84171 10.5488 7.15829 10.5488 7.35355 10.3536L9.5 8.20711L13.1464 11.8536C13.3417 12.0488 13.6583 12.0488 13.8536 11.8536C14.0488 11.6583 14.0488 11.3417 13.8536 11.1464L9.85355 7.14645C9.65829 6.95118 9.34171 6.95118 9.14645 7.14645L7 9.29289L2.35355 4.64645C2.15829 4.45118 1.84171 4.45118 1.64645 4.64645Z"
                    fill="#F01B3E"
                  />
                </svg>
              </SvgIcon>
              <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[400] }}>
                Low
              </Typography>
            </Box>
          </LabelBox>
          <LowValueBox value={tableData.low.uni} />
          <LowValueBox value={tableData.low.krx} />
          <LowValueBox value={tableData.low.nxt} />
        </RowStackWide>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

type LowValueBoxProps = {
  value: string | number;
};

const LowValueBox = ({ value }: LowValueBoxProps) => (
  <ValueBox sx={{ display: 'flex', direction: 'row', justifyContent: 'end', alignItems: 'center' }}>
    <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.74747 11.7068L2.74043 5.88466C2.55457 5.66855 2.70812 5.33398 2.99316 5.33398H13.0082C13.2932 5.33398 13.4467 5.66858 13.2609 5.88469L8.25291 11.7068C8.1199 11.8615 7.88046 11.8614 7.74747 11.7068Z"
          fill="#FF3D4A"
        />
      </svg>
    </SvgIcon>
    {value}
  </ValueBox>
);

// ----------------------------------------------------------------------

type HighValueBoxProps = {
  value: string | number;
};

const HighValueBox = ({ value }: HighValueBoxProps) => (
  <ValueBox sx={{ display: 'flex', direction: 'row', justifyContent: 'end', alignItems: 'center' }}>
    <SvgIcon sx={{ mr: 0.5, height: 16, width: 16 }}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.25384 4.29372L13.2609 10.1159C13.4467 10.332 13.2932 10.6665 13.0082 10.6665L2.99316 10.6665C2.7081 10.6665 2.55456 10.332 2.74045 10.1158L7.7484 4.2937C7.88141 4.13907 8.12085 4.13908 8.25384 4.29372Z"
          fill="#5E66FF"
        />
      </svg>
    </SvgIcon>
    {value}
  </ValueBox>
);
