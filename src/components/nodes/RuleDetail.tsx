'use client';

import Grid from '@mui/material/Unstable_Grid2';
import { Box, styled, Divider, useTheme, Typography, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { grey, common } from 'src/theme/core';

import { ChartBar } from '../node-dashboard/chart-area-bar';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedRuleId: string;
};

export function RuleDetail({ selectedNodeId, selectedRuleId }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const isLoading = false;

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container>
          <Grid md={9} sx={{ pr: 1.5 }}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: common.white,
                p: 1,
                height: 'calc(100vh - 195px)',
              }}
            >
              <ChartBar />
            </Box>
          </Grid>
          <Grid md={3} sx={{ pl: 1.5 }}>
            <Box sx={{ borderRadius: '12px', backgroundColor: grey[900] }}>
              <Box sx={{ p: 0.5 }}>
                <Box
                  sx={{
                    pt: 1,
                    px: 1,
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: '8px',
                    mb: 0.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                    Head
                  </Typography>
                  <Typography
                    sx={{ color: theme.palette.common.white, fontSize: 20, fontWeight: 500 }}
                  >
                    {selectedRuleId}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    py: 1,
                    px: 1,
                    backgroundColor: theme.palette.grey[600],
                    borderRadius: '8px',
                    mb: 0.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                    Today count
                  </Typography>
                  <Typography
                    sx={{ color: theme.palette.common.white, fontSize: 17, fontWeight: 500 }}
                  >
                    64122
                  </Typography>
                </Box>
                <Box
                  sx={{
                    py: 1,
                    px: 1,
                    backgroundColor: theme.palette.grey[600],
                    borderRadius: '8px',
                    mb: 0.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                    First.Seq
                  </Typography>
                  <Typography
                    sx={{ color: theme.palette.common.white, fontSize: 17, fontWeight: 500 }}
                  >
                    3251
                  </Typography>
                </Box>
                <Box
                  sx={{
                    py: 1,
                    px: 1,
                    backgroundColor: theme.palette.grey[600],
                    borderRadius: '8px',
                    mb: 0.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                    First.HHMMSS
                  </Typography>
                  <Typography
                    sx={{ color: theme.palette.common.white, fontSize: 17, fontWeight: 500 }}
                  >
                    09:30:00
                  </Typography>
                </Box>
                <Box
                  sx={{
                    py: 1,
                    px: 1,
                    backgroundColor: theme.palette.common.white,
                    borderRadius: '8px',
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[500], fontSize: 15, mb: 1 }}>
                    Rule Configurations
                  </Typography>
                  <FadingDivider />
                  <Typography
                    sx={{
                      color: theme.palette.grey[600],
                      fontSize: 15,
                      fontWeight: 400,
                      height: 'calc(100vh - 520px)',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {`-- nxt_master.moon
return {
    desc:               '종목정보(마스터, NXT)'
    keys:               { 'A051S', 'A051Q' }
    issue_select:       { 6 }
    issue_adder:        true
    issue_insert:       true
    specs:              'A0_NXT_MASTER'
    process: {
        lfn:            'lfn_nxt_master'
        param:
            mkt:        2
    }
    distribute: {
        format:         'DST_MASTER'
        lfn_gen:        'gen_master'
        topic:          'UNI_1'
        qos:            'none'
    }
    deferred: {
        fn:            'dfn_krx_master'
    }
    recovery: {
        fn:            'rfn_krx_master'
    }
}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}

const FadingDivider = styled(Divider)(({ theme }) => ({
  height: '1px',
  background: `linear-gradient(to right, transparent, ${theme.palette.grey[300]}, transparent)`,
  border: 'none',
  margin: '0',
  '&:before, &:after': {
    display: 'none',
  },
}));
