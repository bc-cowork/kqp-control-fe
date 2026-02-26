'use client';

import Editor from '@monaco-editor/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type JsonEditorPanelProps = {
  jsonValue: string;
  onJsonChange: (value: string) => void;
  onApply: () => void;
  validationErrors: string[];
};

export function JsonEditorPanel({
  jsonValue,
  onJsonChange,
  onApply,
  validationErrors,
}: JsonEditorPanelProps) {
  const theme = useTheme();
  const { t } = useTranslate('flow-editor');
  const isDark = theme.palette.mode === 'dark';
  const hasErrors = validationErrors.length > 0;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: isDark ? '#202838' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A3448' : '#E0E4EB'}`,
        boxShadow: isDark
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header toolbar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${isDark ? '#2A3448' : '#E0E4EB'}`,
          backgroundColor: isDark ? '#1A2235' : '#F9FAFB',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: hasErrors ? theme.palette.error.main : '#22C55E',
              boxShadow: hasErrors
                ? `0 0 6px ${theme.palette.error.main}60`
                : '0 0 6px #22C55E60',
            }}
          />
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? '#AFB7C8' : '#4E576A',
              letterSpacing: '0.02em',
            }}
          >
            {t('panel.json_definition')}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          onClick={onApply}
          size="small"
          startIcon={
            <SvgIcon sx={{ width: 16, height: 16 }}>
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="currentColor"
              />
            </SvgIcon>
          }
          sx={{
            px: 2.5,
            py: 0.5,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: '#4A3BFF',
            boxShadow: '0 2px 8px rgba(74, 59, 255, 0.35)',
            '&:hover': {
              backgroundColor: '#3D30E0',
              boxShadow: '0 4px 12px rgba(74, 59, 255, 0.45)',
            },
          }}
        >
          {t('apply_button')}
        </Button>
      </Stack>

      {/* Editor */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Editor
          language="json"
          theme={isDark ? 'vs-dark' : 'light'}
          value={jsonValue}
          onChange={(val) => onJsonChange(val ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'gutter',
            bracketPairColorization: { enabled: true },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </Box>

      {/* Validation Errors */}
      {hasErrors && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: `1px solid ${isDark ? '#5C2020' : '#FECDCA'}`,
            backgroundColor: isDark ? '#2D1B1B' : '#FEF3F2',
            maxHeight: 100,
            overflow: 'auto',
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: theme.palette.error.main,
              mb: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('errors_title')}
          </Typography>
          {validationErrors.map((error) => (
            <Typography
              key={error}
              sx={{
                fontSize: 12,
                color: isDark ? '#FCA5A5' : '#B42318',
                lineHeight: 1.6,
              }}
            >
              &bull; {error}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
