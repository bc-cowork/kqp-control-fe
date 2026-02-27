'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { HEADER_BG, HEADER_BORDER, TEXT_TERTIARY, TEXT_SECONDARY } from './constants';

// ----------------------------------------------------------------------

type DataFlowToolbarProps = {
  fileName: string;
  onAutoLayout: () => void;
  onFitView: () => void;
  onExport: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
};

export function DataFlowToolbar({
  fileName,
  onAutoLayout,
  onFitView,
  onExport,
  onFullscreen,
  isFullscreen,
}: DataFlowToolbarProps) {
  const { t } = useTranslate('data-flow');

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        p: 1.5,
        backgroundColor: HEADER_BG,
        // Use borderBottom to define the width, then borderImage for the gradient
        borderBottom: '1px solid',
        borderImage: `linear-gradient(to right, rgba(55, 63, 78, 0.00), rgb(170, 170, 170) 50%, rgba(55, 63, 78, 0.00)) 1`,
      }}
    >
      {/* Preview badge */}
      <Box
        sx={{
          px: 1.5,
          pl: 1,
          py: 0,
          backgroundColor: '#1D2F20',
          borderRadius: '100px',
          border: '1px solid #36573C',
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
            backgroundColor: '#4FCB53',
          }}
        />
        <Typography
          sx={{
            fontSize: 15,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '22.5px',
            color: '#7EE081',
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
          color: TEXT_SECONDARY,
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
          color: TEXT_SECONDARY,
        }}
      >
        {fileName}
      </Typography>

      {/* Buttons */}
      <Stack direction="row" width={'240px'}>
        <Button
          size="small"
          onClick={onAutoLayout}
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: '#373F4E',
            borderRadius: '4px',
            color: TEXT_TERTIARY,
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
            backgroundColor: '#373F4E',
            borderRadius: '4px',
            color: TEXT_TERTIARY,
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
            backgroundColor: '#373F4E',
            borderRadius: '4px',
            color: TEXT_TERTIARY,
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
