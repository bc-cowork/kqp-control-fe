'use client';

import dynamic from 'next/dynamic';

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
        }}
      >
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          value={value}
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
              verticalScrollbarSize: 16,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </Box>
    </Box>
  );
}
