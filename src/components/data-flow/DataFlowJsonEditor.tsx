'use client';

import type { editor } from 'monaco-editor';

import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';


// Lazy load Monaco to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ----------------------------------------------------------------------

type DataFlowJsonEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DataFlowJsonEditor({ value, onChange }: DataFlowJsonEditorProps) {
  const { t } = useTranslate('data-flow');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Push external value changes (e.g. API data) into the editor imperatively
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <Box
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 563,
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: 1.5,
          backgroundColor: '#667085',
          borderBottom: '1px solid #373F4E',
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: 15,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '22.5px',
            color: '#E0E4EB',
          }}
        >
          {t('editor.title')}
        </Typography>
      </Stack>

      {/* Monaco Editor */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#1E1E1E',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          overflow: 'hidden',
          // Match app-wide thin scrollbar style
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
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          defaultValue={value}
          onMount={(ed) => { editorRef.current = ed; }}
          onChange={(v) => onChange(v || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: 'Roboto, monospace',
            lineHeight: 22.5,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              verticalSliderSize: 8,
              horizontalSliderSize: 8,
            },
          }}
        />
      </Box>
    </Box>
  );
}
