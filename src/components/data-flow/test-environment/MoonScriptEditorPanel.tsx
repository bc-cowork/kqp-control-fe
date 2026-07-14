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

import { CANVAS_BG } from '../constants';

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
        minHeight: isHorizontal ? 780 : 837,
        width: isHorizontal ? '50%' : '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${T.link}`,
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
        <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.link }}>
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
              color: T.textDim,
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
          startIcon={
            isPreviewing ? (
              <CircularProgress size={14} thickness={5} color="inherit" />
            ) : (
              <svg
                width="14.7"
                height="18"
                viewBox="-1 -1 18 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0, overflow: 'visible' }}
              >
                <path
                  d="M16 6.87529C15.9993 6.04665 15.6699 5.25215 15.084 4.66622C14.4981 4.08028 13.7036 3.75082 12.875 3.75016C12.0464 3.75082 11.2519 4.08028 10.666 4.66622C10.0801 5.25215 9.75066 6.04665 9.75 6.87529C9.75173 7.57893 9.99087 8.2614 10.4287 8.81222C10.8665 9.36304 11.4774 9.74998 12.1625 9.91041C12.0477 10.296 11.812 10.6344 11.4901 10.8757C11.1682 11.117 10.7773 11.2484 10.375 11.2505H6.625C5.91833 11.2505 5.27417 11.4946 4.75 11.8905V6.18609C6.175 5.89608 7.25 4.63436 7.25 3.12513C7.24934 2.2965 6.91988 1.50199 6.33398 0.916061C5.74807 0.330129 4.9536 0.000662112 4.125 0C3.2964 0.000662112 2.50193 0.330129 1.91602 0.916061C1.33011 1.50199 1.00066 2.2965 1 3.12513C1.00086 3.84512 1.25003 4.54277 1.70546 5.10039C2.16089 5.65802 2.79472 6.04148 3.5 6.18609V13.8131C2.075 14.1031 1 15.3656 1 16.8749C1.00066 17.7035 1.33011 18.498 1.91602 19.0839C2.50193 19.6699 3.2964 19.9993 4.125 20C4.9536 19.9993 5.74807 19.6699 6.33398 19.0839C6.91988 18.498 7.24934 17.7035 7.25 16.8749C7.24827 16.1712 7.00913 15.4888 6.57131 14.9379C6.13348 14.3871 5.52258 14.0002 4.8375 13.8397C4.95228 13.4542 5.18802 13.1157 5.5099 12.8744C5.83177 12.6331 6.22272 12.5017 6.625 12.4997H10.375C11.1045 12.4984 11.8106 12.2418 12.3708 11.7746C12.9311 11.3073 13.3102 10.6587 13.4425 9.94125C14.1595 9.80884 14.8076 9.42987 15.2747 8.86996C15.7417 8.31004 15.9983 7.60444 16 6.87529ZM2.25 3.12513C2.25 2.09175 3.09167 1.25005 4.125 1.25005C5.15833 1.25005 6 2.09175 6 3.12513C6 4.15851 5.15833 5.00021 4.125 5.00021C3.09167 5.00021 2.25 4.15851 2.25 3.12513ZM6 16.8757C6 17.9091 5.15833 18.7508 4.125 18.7508C3.09167 18.7508 2.25 17.9091 2.25 16.8757C2.25 15.8423 3.09167 15.0006 4.125 15.0006C5.15833 15.0006 6 15.8423 6 16.8757ZM12.875 8.75036C11.8417 8.75036 11 7.90866 11 6.87529C11 5.84191 11.8417 5.00021 12.875 5.00021C13.9083 5.00021 14.75 5.84191 14.75 6.87529C14.75 7.90866 13.9083 8.75036 12.875 8.75036Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={0.5}
                  strokeLinejoin="round"
                />
              </svg>
            )
          }
          sx={{
            ml: 'auto',
            height: 32,
            px: '14px',
            minWidth: 0,
            backgroundColor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.link,
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.bgHover, color: T.link },
            '&.Mui-disabled': { color: T.link, backgroundColor: T.bgCard },
          }}
        >
          {t('sandbox.preview_btn')}
        </Button>
      </Stack>

      {/* Monaco MoonScript Editor */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
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
        <Box sx={{ position: 'absolute', inset: 0 }}>
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
    </Box>
  );
}
