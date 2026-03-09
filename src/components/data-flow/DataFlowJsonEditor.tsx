'use client';

import type { editor } from 'monaco-editor';

import dynamic from 'next/dynamic';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
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
  const [isActive, setIsActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = editorRef.current?.getValue() || value;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

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
        <IconButton onClick={handleCopy} size="small" sx={{ color: '#E0E4EB', '&:hover': { color: '#fff' } }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.1333 5.33346C4.1333 4.67072 4.67056 4.13346 5.3333 4.13346H12.8C13.4627 4.13346 14 4.67072 14 5.33346V12.8001C14 13.4629 13.4627 14.0001 12.8 14.0001H5.3333C4.67056 14.0001 4.1333 13.4629 4.1333 12.8001V5.33346ZM5.3333 5.20013C5.25966 5.20013 5.19997 5.25983 5.19997 5.33346V12.8001C5.19997 12.8738 5.25966 12.9335 5.3333 12.9335H12.8C12.8736 12.9335 12.9333 12.8738 12.9333 12.8001V5.33346C12.9333 5.25982 12.8736 5.20013 12.8 5.20013H5.3333Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M2.00049 3.2C2.00049 2.53726 2.53775 2 3.20049 2H12.1333C12.4279 2 12.6666 2.23878 12.6666 2.53333C12.6666 2.82789 12.4279 3.06667 12.1333 3.06667H3.20049C3.12685 3.06667 3.06715 3.12636 3.06715 3.2V12.1335C3.06715 12.428 2.82837 12.6668 2.53382 12.6668C2.23927 12.6668 2.00049 12.428 2.00049 12.1335V3.2Z" fill="white" />
          </svg>

        </IconButton>
        {copied && (
          <Typography sx={{ fontSize: 12, color: '#7EE081', ml: 0.5 }}>Copied!</Typography>
        )}
      </Stack>

      {/* Monaco Editor */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
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
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          defaultValue={value}
          onMount={(ed) => {
            editorRef.current = ed;
            ed.onDidBlurEditorText(() => setIsActive(false));
          }}
          onChange={(v) => onChange(v || '')}
          options={{
            minimap: { enabled: false },
            stickyScroll: { enabled: false },
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
