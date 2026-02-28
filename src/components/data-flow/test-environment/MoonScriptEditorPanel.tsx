import type { editor } from 'monaco-editor';

import { useRef } from 'react';
import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';

import { CANVAS_BG, HEADER_BG, HEADER_BORDER, TEXT_SECONDARY } from '../constants';

// Lazy load Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ----------------------------------------------------------------------

type MoonScriptEditorPanelProps = {
  layoutDefinition: string;
  isHorizontal: boolean;
  isPreviewing: boolean;
  onCodeChange: (code: string) => void;
  onPreview: () => void;
};

export function MoonScriptEditorPanel({
  layoutDefinition,
  isHorizontal,
  isPreviewing,
  onCodeChange,
  onPreview,
}: MoonScriptEditorPanelProps) {
  const { t } = useTranslate('data-flow');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  return (
    <Box
      sx={{
        maxHeight: isHorizontal ? 600 : 837,
        width: isHorizontal ? '50%' : '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.2px solid #667085',
        backgroundColor: CANVAS_BG,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          p: 1.5,
          backgroundColor: HEADER_BG,
          borderBottom: `1px solid ${HEADER_BORDER}`,
        }}
      >
        {/* MOON DSL badge */}
        <Box
          sx={{
            px: 1.5,
            pl: 1,
            py: 0,
            backgroundColor: '#212447',
            borderRadius: '100px',
            border: '1px solid #1D2654',
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
              backgroundColor: '#7AA2FF',
            }}
          />
          <Typography
            sx={{
              fontSize: 15,
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              lineHeight: '22.5px',
              color: '#7AA2FF',
            }}
          >
            MOON DSL
          </Typography>
        </Box>

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
          {t('sandbox.layout_definition')}
        </Typography>

        {/* Preview button */}
        <Button
          size="small"
          onClick={onPreview}
          disabled={isPreviewing}
          startIcon={isPreviewing ? <CircularProgress size={14} color="inherit" /> : undefined}
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: '#4A3BFF',
            borderRadius: '4px',
            color: '#F0F1F5',
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            '&:hover': { backgroundColor: '#3A2BE0' },
            '&.Mui-disabled': { color: '#9BA3B5', backgroundColor: '#3A2BE0' },
          }}
        >
          {t('sandbox.preview_btn')}
        </Button>
      </Stack>

      {/* Monaco MoonScript Editor */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          backgroundColor: CANVAS_BG,
          '& .monaco-scrollable-element > .scrollbar > .slider': {
            backgroundColor: 'rgba(255, 255, 255, 0.2) !important',
            borderRadius: '4px !important',
          },
          '& .monaco-scrollable-element > .scrollbar > .slider:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.35) !important',
          },
          '& .monaco-scrollable-element > .scrollbar > .slider.active': {
            backgroundColor: 'rgba(255, 255, 255, 0.4) !important',
          },
        }}
      >
        <MonacoEditor
          height="100%"
          language="lua"
          theme="vs-dark"
          defaultValue={layoutDefinition}
          onMount={(ed) => {
            editorRef.current = ed;
          }}
          onChange={(v) => onCodeChange(v || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: 'Roboto, monospace',
            lineHeight: 22.5,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              verticalSliderSize: 8,
              horizontalSliderSize: 8,
            },
            lineNumbers: 'off',
            glyphMargin: false,
            guides: {
              bracketPairs: false,
              indentation: false,
              highlightActiveBracketPair: false,
            },
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
          }}
        />
      </Box>
    </Box>
  );
}
