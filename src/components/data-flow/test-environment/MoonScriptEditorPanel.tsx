import type { editor } from 'monaco-editor';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';
import { T, FONT_CODE } from 'src/theme/tokens';

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
  const [isActive, setIsActive] = useState(false);

  return (
    <Box
      sx={{
        minHeight: isHorizontal ? 600 : 837,
        width: isHorizontal ? '50%' : '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${T.border}`,
        backgroundColor: T.bgPanel,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          position: 'relative',
          gap: '11px',
          px: '14px',
          py: '10px',
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.textSec }}>
          {t('sandbox.layout_definition')}
        </Typography>

        {/* Centered MOON DSL chip */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              fontSize: 14,
              fontWeight: 500,
              px: '10px',
              py: '3px',
              borderRadius: '6px',
              backgroundColor: T.bgHover,
              border: `1px solid ${T.border}`,
              color: T.textSec,
            }}
          >
            MOON DSL
          </Box>
        </Box>

        {/* Preview button */}
        <Button
          size="small"
          disableRipple
          onClick={onPreview}
          disabled={isPreviewing}
          startIcon={isPreviewing ? <CircularProgress size={14} color="inherit" /> : undefined}
          sx={{
            ml: 'auto',
            height: 32,
            px: '14px',
            minWidth: 0,
            backgroundColor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.textSec,
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.bgHover, color: T.textPrim },
            '&.Mui-disabled': { color: T.textDim, backgroundColor: T.bgCard },
          }}
        >
          {t('sandbox.preview_btn')}
        </Button>
      </Stack>

      {/* Monaco MoonScript Editor */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: T.bgPanel,
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
        {/* Click-to-activate overlay — blocks scroll capture until user clicks in */}
        {!isActive && (
          <Box
            onClick={() => {
              setIsActive(true);
              editorRef.current?.focus();
            }}
            sx={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'text' }}
          />
        )}
        <MonacoEditor
          height="100%"
          language="lua"
          theme="moon-dark"
          defaultValue={layoutDefinition}
          beforeMount={(monaco) => {
            // .moon (Monokai-family) theme on the app surface (T.bgPanel)
            // (text #f8f8f2 / str #abe338 / num #f5ab35 / key #ffa07a).
            monaco.editor.defineTheme('moon-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: '', foreground: 'f8f8f2' },
                { token: 'string', foreground: 'abe338' },
                { token: 'number', foreground: 'f5ab35' },
                { token: 'keyword', foreground: 'ffa07a' },
                { token: 'type', foreground: 'ffa07a' },
                { token: 'identifier', foreground: 'f8f8f2' },
              ],
              colors: { 'editor.background': T.bgPanel },
            });
          }}
          onMount={(ed) => {
            editorRef.current = ed;
            ed.onDidBlurEditorText(() => setIsActive(false));
          }}
          onChange={(v) => onCodeChange(v || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15.5,
            fontFamily: FONT_CODE,
            lineHeight: 23,
            padding: { top: 12 },
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
