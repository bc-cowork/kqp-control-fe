'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { HEADER_BG, TEXT_TERTIARY, TEXT_SECONDARY } from './constants';

// ----------------------------------------------------------------------

type DataFlowToolbarProps = {
  fileName: string;
  onAutoLayout: () => void;
  onFitView: () => void;
  onExport: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  onTestEnvClick?: () => void;
};

export function DataFlowToolbar({
  fileName,
  onAutoLayout,
  onFitView,
  onExport,
  onFullscreen,
  isFullscreen,
  onTestEnvClick,
}: DataFlowToolbarProps) {
  const { t } = useTranslate('data-flow');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const titleColor = isDark ? TEXT_SECONDARY : '#373F4E';

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        p: 1.5,
        // White header bar in light mode (the diagram below stays dark in both themes).
        backgroundColor: isDark ? HEADER_BG : '#FFFFFF',
        ...(isDark
          ? {
              borderBottom: '1px solid',
              borderImage: `linear-gradient(to right, rgba(55, 63, 78, 0.00), rgb(170, 170, 170) 50%, rgba(55, 63, 78, 0.00)) 1`,
            }
          : { borderBottom: '1px solid #D1D6E0' }),
      }}
    >
      {/* Preview badge */}
      <Box
        sx={{
          px: 1.5,
          pl: 1,
          py: 0,
          backgroundColor: isDark ? '#1D2F20' : '#EBFBE9',
          borderRadius: '100px',
          border: `1px solid ${isDark ? '#36573C' : '#DDF4DA'}`,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isDark ? '#4FCB53' : '#00A41E',
          }}
        />
        <Typography
          sx={{
            fontSize: 15,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '22.5px',
            color: isDark ? '#7EE081' : '#05811B',
          }}
        >
          {t('toolbar.preview')}
        </Typography>
      </Box>

      {/* Title */}
      <Typography
        sx={{
          flex: 1,
          fontSize: 15,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          lineHeight: '22.5px',
          color: titleColor,
        }}
      >
        {t('toolbar.title')}
      </Typography>

      {/* Filename */}
      <Typography
        sx={{
          flex: 1,
          fontSize: 15,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          lineHeight: '22.5px',
          color: titleColor,
        }}
      >
        {fileName}
      </Typography>

      {/* Buttons */}
      <Stack direction="row" width="240px" style={{
        justifyContent: 'flex-end'
      }}>
        <Button
          size="small"
          onClick={onTestEnvClick}
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: '#5E66FF',
            borderRadius: '4px',
            color: 'white',
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            justifySelf: 'flex-end',
            '&:hover': { backgroundColor: '#4A3BFF' },
          }}
        >
          테스트 환경 접속
        </Button>
        <Button
          size="small"
          onClick={onAutoLayout}
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: isDark ? '#373F4E' : '#F4F4F8',
            borderRadius: '4px',
            color: isDark ? TEXT_TERTIARY : '#667085',
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            '&:hover': { backgroundColor: '#4E576A' },
            display: 'none'
          }}
        >
          {t('toolbar.auto_layout')}
        </Button>

        <Button
          size="small"
          onClick={onFitView}
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: isDark ? '#373F4E' : '#F4F4F8',
            borderRadius: '4px',
            color: isDark ? TEXT_TERTIARY : '#667085',
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            '&:hover': { backgroundColor: '#4E576A' },
            display: 'none'
          }}
        >
          {t('toolbar.fit_view')}
        </Button>

        <Button
          size="small"
          onClick={onExport}
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: isDark ? '#373F4E' : '#F4F4F8',
            borderRadius: '4px',
            color: isDark ? TEXT_TERTIARY : '#667085',
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            '&:hover': { backgroundColor: '#4E576A' },
            display: 'none'

          }}
        >
          {t('toolbar.export')}
        </Button>

        <Button
          size="small"
          onClick={onFullscreen}
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: '#5E66FF',
            borderRadius: '4px',
            color: 'white',
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            '&:hover': { backgroundColor: '#4A3BFF' },
            display: 'none'

          }}
        >
          {isFullscreen ? t('toolbar.exit_fullscreen') : t('toolbar.fullscreen')}
        </Button>
      </Stack>
    </Stack>
  );
}
