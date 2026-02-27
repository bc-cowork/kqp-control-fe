'use client';

import '@xyflow/react/dist/style.css';

import type { Edge } from '@xyflow/react';
import type { editor } from 'monaco-editor';

import dynamic from 'next/dynamic';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import {
  Panel,
  ReactFlow,
  Background,
  useReactFlow,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ReactFlowProvider,
} from '@xyflow/react';

import {
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { DataFlowNode } from './nodes/DataFlowNode';
import { buildDataFlowGraph } from './graph-builder';
import { computeDataFlowLayout } from './layout-algorithm';
import {
  CANVAS_BG,
  HEADER_BG,
  HEADER_BORDER,
  TEXT_TERTIARY,
  TEXT_SECONDARY,
  GRID_LINE_COLOR,
} from './constants';

import type { DataFlowDefinition, DataFlowNodeInstance } from './types';

// Lazy load Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ----------------------------------------------------------------------

type ViewMode = 'horizontal' | 'vertical';

const SCALE_OPTIONS = [
  { key: 'current', value: 100 },
  { key: 'scale_reset', value: 50 },
  { key: 'scale_larger', value: 125 },
  { key: 'scale_smaller', value: 50 },
] as const;

const DARK_POPOVER_PAPER_SX = {
  bgcolor: '#1A2030',
  border: '1px solid #373F4E',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  '& .MuiMenuItem-root': { color: '#E0E4EB' },
  '& .MuiMenuItem-root:hover': { bgcolor: '#2A3344' },
  '& .MuiListItemIcon-root': { color: '#AFB7C8', minWidth: 28 },
  '& .MuiListItemText-primary': { fontSize: 12 },
};

// ----------------------------------------------------------------------

type TestEnvironmentModalProps = {
  open: boolean;
  onClose: () => void;
  definition: DataFlowDefinition;
  fileName: string;
  layoutDefinition: string;
  node: string;
  layout: string;
};

// ----------------------------------------------------------------------

function ModalContent({
  onClose,
  definition,
  fileName,
  layoutDefinition,
  node,
  layout,
}: Omit<TestEnvironmentModalProps, 'open'>) {
  const { t } = useTranslate('data-flow');
  const { zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoom, setZoom] = useState(100);

  // View mode & layout state
  const [viewMode, setViewMode] = useState<ViewMode>('horizontal');
  const [interfaceScale, setInterfaceScale] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Editable MoonScript code
  const [moonCode, setMoonCode] = useState(layoutDefinition);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Loading states
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Confirmation dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Current data flow definition (starts from prop, updated on preview)
  const [currentDefinition, setCurrentDefinition] = useState<DataFlowDefinition>(definition);

  // Popover instances
  const viewModePopover = usePopover();
  const optionsPopover = usePopover();

  // Submenu anchors
  const [viewScreenAnchor, setViewScreenAnchor] = useState<HTMLElement | null>(null);
  const [scaleAnchor, setScaleAnchor] = useState<HTMLElement | null>(null);

  // Fullscreen ref
  const contentRef = useRef<HTMLDivElement>(null);

  const nodeTypes = useMemo(() => ({ dataFlow_node: DataFlowNode }), []);

  const initialGraph = useMemo(() => {
    const { nodes: builtNodes, edges: builtEdges } = buildDataFlowGraph(currentDefinition);
    const laidOut = computeDataFlowLayout(builtNodes, builtEdges);
    return { nodes: laidOut, edges: builtEdges };
  }, [currentDefinition]);

  const [nodes, setNodes, onNodesChange] = useNodesState<DataFlowNodeInstance>(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialGraph.edges);

  // Sync graph when currentDefinition changes (via preview)
  useEffect(() => {
    setNodes(initialGraph.nodes);
    setEdges(initialGraph.edges);
  }, [initialGraph, setNodes, setEdges]);

  const handleViewportChange = useCallback(() => {
    setZoom(Math.round(getZoom() * 100));
  }, [getZoom]);

  // View mode handler
  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      viewModePopover.onClose();
      setViewScreenAnchor(null);
      optionsPopover.onClose();
    },
    [viewModePopover, optionsPopover]
  );

  // Interface scale handler
  const handleScaleChange = useCallback(
    (value: number) => {
      setInterfaceScale(value);
      setScaleAnchor(null);
      optionsPopover.onClose();
    },
    [optionsPopover]
  );

  // Fullscreen handler
  const handleToggleFullscreen = useCallback(() => {
    optionsPopover.onClose();
    if (!document.fullscreenElement) {
      contentRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [optionsPopover]);

  // Sync fullscreen state with browser
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Close submenus when options popover closes
  const handleOptionsClose = useCallback(() => {
    optionsPopover.onClose();
    setViewScreenAnchor(null);
    setScaleAnchor(null);
  }, [optionsPopover]);

  // Exit handler
  const handleExit = useCallback(() => {
    optionsPopover.onClose();
    onClose();
  }, [optionsPopover, onClose]);

  // Preview handler — POST MoonScript code to API, update graph
  const handlePreview = useCallback(async () => {
    setIsPreviewing(true);
    try {
      const response = await axiosInstance.post(endpoints.layouts.preview(node), {
        layout_definition: moonCode,
      });

      if (response.data?.okay) {
        const newDef = response.data.data.data_flow_definition as DataFlowDefinition;
        setCurrentDefinition(newDef);
        toast.success(t('sandbox.preview_success'));
      } else {
        toast.error(response.data?.msg || t('sandbox.preview_error'));
      }
    } catch (error) {
      console.error('Preview failed:', error);
      toast.error(t('sandbox.preview_error'));
    } finally {
      setIsPreviewing(false);
    }
  }, [node, moonCode, t]);

  // Save handler — PUT MoonScript code to API
  const handleSaveConfirm = useCallback(async () => {
    setSaveDialogOpen(false);
    setIsSaving(true);
    try {
      const response = await axiosInstance.put(endpoints.layouts.detail(node, layout), {
        layout_definition: moonCode,
      });

      if (response.data?.okay) {
        toast.success(t('sandbox.save_success'));
      } else {
        toast.error(response.data?.msg || t('sandbox.save_error'));
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(t('sandbox.save_error'));
    } finally {
      setIsSaving(false);
    }
  }, [node, layout, moonCode, t]);

  const isHorizontal = viewMode === 'horizontal';

  return (
    <Box
      ref={contentRef}
      sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
        maxHeight: 'calc(100vh)',
        overflowY: 'auto',
        bgcolor: '#0A0E15',
        borderRadius: '16px',
        outline: '5px solid #373F4E',
        outlineOffset: '-5px',
        pt: 3,
        px: 4.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        scrollbarWidth: 'thin',
        scrollbarColor: '#4E576A #202838',
        pb: 50,
      }}
    >
      {/* ========== Modal Header ========== */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ pb: 2 }}>
        {/* File icon */}
        <Box sx={{ width: 24, height: 24, position: 'relative' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.125 16.667C6.90756 16.667 5.91699 17.6585 5.91699 18.876C5.91714 20.0933 6.90765 21.084 8.125 21.084C9.34235 21.084 10.3329 20.0933 10.333 18.876C10.333 17.6585 9.34244 16.667 8.125 16.667ZM16.875 6.66699C15.6577 6.66699 14.6671 7.65767 14.667 8.875C14.667 10.0925 15.6576 11.084 16.875 11.084C18.0924 11.084 19.083 10.0925 19.083 8.875C19.0829 7.65767 18.0923 6.66699 16.875 6.66699ZM8.125 2.91699C6.9076 2.91699 5.91706 3.9076 5.91699 5.125C5.91699 6.34246 6.90756 7.33398 8.125 7.33398C9.34244 7.33398 10.333 6.34246 10.333 5.125C10.3329 3.9076 9.3424 2.91699 8.125 2.91699ZM7.83301 7.91406L7.56738 7.85938C6.93733 7.73019 6.37076 7.38776 5.96387 6.88965C5.55702 6.39151 5.33384 5.76818 5.33301 5.125L5.34766 4.84961C5.41154 4.21061 5.69332 3.60943 6.15137 3.15137C6.60943 2.69329 7.21061 2.41152 7.84961 2.34766L8.125 2.33301C8.86518 2.33367 9.57524 2.62795 10.0986 3.15137C10.622 3.67476 10.9163 4.38482 10.917 5.125C10.917 6.4723 9.95665 7.60025 8.68359 7.85938L8.41699 7.91406V14.5596L8.95117 14.1562C9.42283 13.8001 9.99746 13.584 10.625 13.584H14.377C14.8507 13.5815 15.3114 13.4267 15.6904 13.1426C16.0694 12.8584 16.3472 12.4598 16.4824 12.0059L16.583 11.667L16.2383 11.5859C15.6264 11.4426 15.0805 11.0965 14.6895 10.6045C14.2988 10.1129 14.0849 9.50392 14.083 8.87598C14.0836 8.13584 14.3782 7.42579 14.9014 6.90234C15.3594 6.44425 15.9606 6.16151 16.5996 6.09766L16.875 6.08301C17.6152 6.08367 18.3252 6.37892 18.8486 6.90234C19.3064 7.36032 19.5885 7.96085 19.6523 8.59961L19.667 8.87598C19.6652 9.52682 19.4355 10.1564 19.0186 10.6562C18.6013 11.1564 18.0223 11.495 17.3818 11.6133L17.1562 11.6553L17.1143 11.8809C16.9961 12.5217 16.6577 13.1012 16.1572 13.5186C15.6567 13.936 15.0257 14.1648 14.374 14.166H10.623C10.1493 14.1685 9.6886 14.3233 9.30957 14.6074C8.93052 14.8916 8.65275 15.291 8.51758 15.7451L8.41699 16.084L8.76172 16.1641C9.37366 16.3074 9.91945 16.6535 10.3105 17.1455C10.6526 17.5759 10.8589 18.0963 10.9062 18.6406L10.917 18.876C10.916 19.6158 10.6218 20.3255 10.0986 20.8486C9.57523 21.372 8.86518 21.6663 8.125 21.667L7.84961 21.6523C7.21061 21.5885 6.60943 21.3067 6.15137 20.8486C5.628 20.3252 5.3337 19.6152 5.33301 18.875C5.33301 17.5276 6.29344 16.3987 7.56641 16.1396L7.83301 16.085V7.91406Z" stroke="#D1D6E0" stroke-width="0.666667" />
          </svg>

        </Box>

        {/* Title */}
        <Typography
          sx={{
            flex: 1,
            fontSize: 19,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '28.5px',
            color: '#F0F1F5',
          }}
        >
          {t('sandbox.title')}
        </Typography>

        {/* Right-side controls */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Zoom label */}
          <Box sx={{ px: 1.5, py: 0.5, borderRadius: '4px' }}>
            <Typography
              sx={{ fontSize: 12, fontWeight: 400, lineHeight: '16.8px', color: 'white' }}
            >
              {zoom}%
            </Typography>
          </Box>

          {/* View mode button */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            onClick={viewModePopover.onOpen}
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
          >
            <Typography
              sx={{ fontSize: 15, fontWeight: 400, lineHeight: '22.5px', color: TEXT_TERTIARY }}
            >
              {t(isHorizontal ? 'sandbox.horizontal_view' : 'sandbox.vertical_view')}
            </Typography>
            <Box
              component="svg"
              width={16}
              height={16}
              viewBox={isHorizontal ? "0 0 20 18" : "0 0 18 20"}
              fill="none"
              sx={{ color: 'white', flexShrink: 0, display: 'inline-flex', justifySelf: 'center', marginBottom: '-4px' }}
            >
              {isHorizontal ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M1.2 11C0.537258 11 0 10.4627 0 9.8V1.8C0 1.13726 0.537259 0.599999 1.2 0.599999H11.8667C12.5294 0.599999 13.0667 1.13726 13.0667 1.8V9.8C13.0667 10.4627 12.5294 11 11.8667 11H1.2ZM1.06667 9.8C1.06667 9.87364 1.12636 9.93333 1.2 9.93333H6.1332V1.66667H1.2C1.12636 1.66667 1.06667 1.72636 1.06667 1.8V9.8ZM7.19987 1.66667V9.93333H11.8667C11.9403 9.93333 12 9.87364 12 9.8V1.8C12 1.72636 11.9403 1.66667 11.8667 1.66667H7.19987Z" fill="white" />
              ) : (
                <path fillRule="evenodd" clipRule="evenodd" d="M11 1.2C11 0.537258 10.4627 0 9.8 0H1.8C1.13726 0 0.599999 0.537259 0.599999 1.2V11.8667C0.599999 12.5294 1.13726 13.0667 1.8 13.0667H9.8C10.4627 13.0667 11 12.5294 11 11.8667V1.2ZM9.8 1.06667C9.87364 1.06667 9.93333 1.12636 9.93333 1.2V6.1332H1.66667V1.2C1.66667 1.12636 1.72636 1.06667 1.8 1.06667H9.8ZM1.66667 7.19987V11.8667C1.66667 11.9403 1.72636 12 1.8 12H9.8C9.87364 12 9.93333 11.9403 9.93333 11.8667V7.19987L1.66667 7.19987Z" fill="white" />
              )}
            </Box>
          </Stack>

          {/* Options chevron button */}
          <Box
            onClick={optionsPopover.onOpen}
            sx={{
              px: 1.5,
              py: '2px',
              backgroundColor: '#373F4E',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#4E576A' },
            }}
          >
            <Iconify icon="eva:chevron-down-fill" width={22.5} sx={{ color: TEXT_TERTIARY }} />
          </Box>

          {/* Close button */}
          <Box
            onClick={onClose}
            sx={{
              px: 1.5,
              py: '2px',
              backgroundColor: '#373F4E',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#4E576A' },
            }}
          >
            <Typography
              sx={{ fontSize: 15, fontWeight: 400, color: TEXT_TERTIARY, lineHeight: '22.5px' }}
            >
              ✕
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* ========== View Mode Popover ========== */}
      <CustomPopover
        open={viewModePopover.open}
        anchorEl={viewModePopover.anchorEl}
        onClose={viewModePopover.onClose}
        slotProps={{ arrow: { hide: true }, paper: { sx: DARK_POPOVER_PAPER_SX } }}
      >
        <MenuList>
          <MenuItem
            selected={isHorizontal}
            onClick={() => handleViewModeChange('horizontal')}
            sx={{
              backgroundColor: 'transparent'
            }}
          >
            <ListItemText>{t('sandbox.horizontal')}</ListItemText>

            <ListItemIcon>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.2 1C0.537258 1 0 1.53726 0 2.2V10.2C0 10.8627 0.537259 11.4 1.2 11.4H11.8667C12.5294 11.4 13.0667 10.8627 13.0667 10.2V2.2C13.0667 1.53726 12.5294 1 11.8667 1H1.2ZM1.06667 2.2C1.06667 2.12636 1.12636 2.06667 1.2 2.06667H6.1332V10.3333H1.2C1.12636 10.3333 1.06667 10.2736 1.06667 10.2V2.2ZM7.19987 10.3333H11.8667C11.9403 10.3333 12 10.2736 12 10.2V2.2C12 2.12636 11.9403 2.06667 11.8667 2.06667H7.19987V10.3333Z" fill="currentColor" />
              </svg>
            </ListItemIcon>

          </MenuItem>
          <MenuItem
            selected={!isHorizontal}
            onClick={() => handleViewModeChange('vertical')}
            sx={{
              backgroundColor: 'transparent'
            }}
          >
            <ListItemText>{t('sandbox.vertical')}</ListItemText>

            <ListItemIcon>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11 1.2C11 0.537258 10.4627 0 9.8 0H1.8C1.13726 0 0.599999 0.537259 0.599999 1.2V11.8667C0.599999 12.5294 1.13726 13.0667 1.8 13.0667H9.8C10.4627 13.0667 11 12.5294 11 11.8667V1.2ZM9.8 1.06667C9.87364 1.06667 9.93333 1.12636 9.93333 1.2V6.1332H1.66667V1.2C1.66667 1.12636 1.72636 1.06667 1.8 1.06667H9.8ZM1.66667 7.19987V11.8667C1.66667 11.9403 1.72636 12 1.8 12H9.8C9.87364 12 9.93333 11.9403 9.93333 11.8667V7.19987L1.66667 7.19987Z" fill="currentColor" />
              </svg>
            </ListItemIcon>

          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* ========== Options Popover ========== */}
      <CustomPopover
        open={optionsPopover.open}
        anchorEl={optionsPopover.anchorEl}
        onClose={handleOptionsClose}
        slotProps={{ arrow: { hide: true }, paper: { sx: DARK_POPOVER_PAPER_SX } }}
      >
        <MenuList>
          {/* View Screen submenu */}
          <MenuItem
            onClick={(e) => {
              setViewScreenAnchor(e.currentTarget);
              setScaleAnchor(null);
            }}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemIcon>
              <Iconify icon="solar:monitor-outline" width={18} />
            </ListItemIcon>
            <ListItemText sx={{ flex: 'none' }}>{t('sandbox.view_screen')}</ListItemText>
            <Iconify icon="eva:chevron-right-fill" width={16} sx={{ ml: 'auto', color: '#AFB7C8' }} />
          </MenuItem>

          {/* Interface Scale submenu */}
          <MenuItem
            onClick={(e) => {
              setScaleAnchor(e.currentTarget);
              setViewScreenAnchor(null);
            }}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemIcon>
              <Iconify icon="solar:magnifer-outline" width={18} />
            </ListItemIcon>
            <ListItemText sx={{ flex: 'none' }}>{t('sandbox.interface_scale')}</ListItemText>
            <Iconify icon="eva:chevron-right-fill" width={16} sx={{ ml: 'auto', color: '#AFB7C8' }} />
          </MenuItem>

          {/* Enter/Exit Full Screen */}
          <MenuItem
            onClick={handleToggleFullscreen}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemIcon>
              <Iconify
                icon={
                  isFullscreen
                    ? 'solar:quit-full-screen-square-outline'
                    : 'solar:full-screen-square-outline'
                }
                width={18}
              />
            </ListItemIcon>
            <ListItemText>
              {t(isFullscreen ? 'sandbox.exit_fullscreen' : 'sandbox.enter_fullscreen')}
            </ListItemText>
          </MenuItem>

          {/* Exit */}
          <MenuItem
            onClick={handleExit}
            sx={{ backgroundColor: 'transparent' }}
          >
            <ListItemIcon>
              <Iconify icon="solar:logout-2-outline" width={18} />
            </ListItemIcon>
            <ListItemText>{t('sandbox.exit')}</ListItemText>
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* ========== View Screen Submenu ========== */}
      <CustomPopover
        open={!!viewScreenAnchor}
        anchorEl={viewScreenAnchor}
        onClose={() => setViewScreenAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ arrow: { hide: true }, paper: { sx: { ...DARK_POPOVER_PAPER_SX, marginLeft: '-6px' } } }}
      >
        <MenuList >
          <MenuItem
            selected={isHorizontal}
            onClick={() => handleViewModeChange('horizontal')}
            sx={{
              display: 'flex',
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <ListItemText>{t('sandbox.horizontal')}</ListItemText>
            <ListItemIcon sx={{
              position: 'relative',
              right: -24,
              top: 0
            }}>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.2 1C0.537258 1 0 1.53726 0 2.2V10.2C0 10.8627 0.537259 11.4 1.2 11.4H11.8667C12.5294 11.4 13.0667 10.8627 13.0667 10.2V2.2C13.0667 1.53726 12.5294 1 11.8667 1H1.2ZM1.06667 2.2C1.06667 2.12636 1.12636 2.06667 1.2 2.06667H6.1332V10.3333H1.2C1.12636 10.3333 1.06667 10.2736 1.06667 10.2V2.2ZM7.19987 10.3333H11.8667C11.9403 10.3333 12 10.2736 12 10.2V2.2C12 2.12636 11.9403 2.06667 11.8667 2.06667H7.19987V10.3333Z" fill="currentColor" />
              </svg>
            </ListItemIcon>
          </MenuItem>
          <MenuItem
            selected={!isHorizontal}
            onClick={() => handleViewModeChange('vertical')}
            sx={{
              display: 'flex',
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <ListItemText>{t('sandbox.vertical')}</ListItemText>
            <ListItemIcon
              sx={{
                position: 'relative',
                right: -24,
                top: 0
              }}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1.2C11 0.537258 10.4627 0 9.8 0H1.8C1.13726 0 0.599999 0.537259 0.599999 1.2V11.8667C0.599999 12.5294 1.13726 13.0667 1.8 13.0667H9.8C10.4627 13.0667 11 12.5294 11 11.8667V1.2ZM9.8 1.06667C9.87364 1.06667 9.93333 1.12636 9.93333 1.2V6.1332H1.66667V1.2C1.66667 1.12636 1.72636 1.06667 1.8 1.06667H9.8ZM1.66667 7.19987V11.8667C1.66667 11.9403 1.72636 12 1.8 12H9.8C9.87364 12 9.93333 11.9403 9.93333 11.8667V7.19987L1.66667 7.19987Z" fill="currentColor" />
              </svg>
            </ListItemIcon>
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* ========== Interface Scale Submenu ========== */}
      <CustomPopover
        open={!!scaleAnchor}
        anchorEl={scaleAnchor}
        onClose={() => setScaleAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ arrow: { hide: true }, paper: { sx: { ...DARK_POPOVER_PAPER_SX, marginLeft: '-6px' } } }}
      >
        <MenuList>
          {SCALE_OPTIONS.map((option) => (
            <MenuItem
              key={option.key}
              selected={interfaceScale === option.value}
              onClick={() => handleScaleChange(option.value)}
              sx={{
                backgroundColor: 'transparent'
              }}
            >
              <ListItemText>
                {option.key === 'current' ? `${option.value}%` : t(`sandbox.${option.key}`)}
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      {/* ========== Panels Container ========== */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          gap: 3,
          ...(interfaceScale !== 100 && {
            transform: `scale(${interfaceScale / 100})`,
            transformOrigin: 'top left',
            width: `${10000 / interfaceScale}%`,
          }),
        }}
      >
        {/* ========== Data Flow Canvas Preview ========== */}
        <Box
          sx={{
            minHeight: isHorizontal ? 600 : 832,
            width: isHorizontal ? '50%' : '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1.2px solid #667085',
            backgroundColor: CANVAS_BG,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Preview toolbar */}
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
            {/* PREVIEW badge (danger/red) */}
            <Box
              sx={{
                px: 1.5,
                pl: 1,
                py: 0,
                backgroundColor: '#331B1E',
                borderRadius: '100px',
                border: '1px solid #4A2C31',
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
                  backgroundColor: '#FF5B5B',
                }}
              />
              <Typography
                sx={{
                  fontSize: 15,
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  lineHeight: '22.5px',
                  color: '#FF8882',
                }}
              >
                PREVIEW
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
              Data Flow
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

            {/* Revert button */}
            <Button
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                backgroundColor: '#4A3BFF',
                borderRadius: '4px',
                color: TEXT_TERTIARY,
                gap: 0.75,
                fontSize: 15,
                fontWeight: 400,
                textTransform: 'none',
                lineHeight: '22.5px',
                '&:hover': { backgroundColor: '#3A2BE0' },
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.03027 1.73291C10.2563 1.73291 12.2127 2.88289 13.333 4.61768V2.6665C13.3332 2.37224 13.572 2.13355 13.8662 2.1333C14.1607 2.1333 14.4002 2.37209 14.4004 2.6665V6.00049C14.4002 6.29488 14.1606 6.53369 13.8662 6.53369H10.5332C10.2388 6.53362 10.0002 6.29483 10 6.00049C10 5.70598 10.2387 5.46638 10.5332 5.46631H12.5977C11.7027 3.87649 9.99408 2.80029 8.03027 2.80029C5.13796 2.80049 2.79883 5.13154 2.79883 8.00049C2.79906 10.8692 5.1381 13.1995 8.03027 13.1997C10.6549 13.1997 12.8258 11.2799 13.2041 8.78076C13.2482 8.48954 13.5203 8.28849 13.8115 8.33252C14.1028 8.37658 14.3028 8.6487 14.2588 8.93994C13.8022 11.9574 11.186 14.2671 8.03027 14.2671C4.55463 14.2669 1.73167 11.4639 1.73145 8.00049C1.73145 4.53681 4.55449 1.73311 8.03027 1.73291Z" fill="white" />
              </svg>

              {t('sandbox.revert')}
            </Button>

            {/* Save button */}
            <Button
              size="small"
              onClick={() => setSaveDialogOpen(true)}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : undefined}
              sx={{
                px: 1.5,
                py: '15px',
                backgroundColor: '#373F4E',
                borderRadius: '4px',
                color: TEXT_TERTIARY,
                fontSize: 15,
                fontWeight: 400,
                textTransform: 'none',
                lineHeight: '22.5px',
                '&:hover': { backgroundColor: '#4A3BFF' },
                '&.Mui-disabled': { color: '#6B7280', backgroundColor: '#2A3344' },
              }}
            >
              {isSaving ? t('sandbox.saving') : t('sandbox.save')}
            </Button>


          </Stack>

          {/* Canvas */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              proOptions={{ hideAttribution: true }}
              nodesDraggable
              nodesConnectable={false}
              elementsSelectable={false}
              onMoveEnd={handleViewportChange}
              defaultEdgeOptions={{ type: 'smoothstep' }}
            >
              <Background
                variant={BackgroundVariant.Lines}
                gap={50}
                lineWidth={0.5}
                color={GRID_LINE_COLOR}
              />

              {/* Zoom Controls */}
              <Panel position="bottom-right">
                <Stack spacing={0.5} alignItems="center">
                  <Box
                    onClick={() => zoomIn({ duration: 200 })}
                    sx={{
                      width: 40,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#373F4E',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#4E576A' },
                    }}
                  >
                    <Typography sx={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
                      +
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: 'white', fontWeight: 400 }}>
                    {zoom}%
                  </Typography>
                  <Box
                    onClick={() => zoomOut({ duration: 200 })}
                    sx={{
                      width: 40,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#373F4E',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#4E576A' },
                    }}
                  >
                    <Typography sx={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
                      -
                    </Typography>
                  </Box>
                </Stack>
              </Panel>
            </ReactFlow>
          </Box>
        </Box>

        {/* ========== Layout Definition Panel ========== */}
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
            {/* MOON DSL badge (info/blue) */}
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
              {t('sandbox.layout_definition')}
            </Typography>

            {/* Preview button */}
            <Button
              size="small"
              onClick={handlePreview}
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
              onChange={(v) => setMoonCode(v || '')}
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
                lineNumbers: 'off',     // This hides the line numbers
                glyphMargin: false,      // Optional: hide the margin to the left of line numbers
                guides: {
                  bracketPairs: false,      // Removes the lines connecting brackets
                  indentation: false,       // Removes the vertical indentation lines
                  highlightActiveBracketPair: false, // Optional: stops the bracket highlighting
                },
                folding: false,          // Optional: hide code folding icons
                lineDecorationsWidth: 0, // Optional: reduce the width of the left margin
                lineNumbersMinChars: 0,  // Optional: minimize the space reserved for numbers
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ========== Save Confirmation Dialog ========== */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#0A0E15',
            borderRadius: '8px',
            border: '1px solid #4E576A',
            color: '#F0F1F5',
            width: '100%',
            maxWidth: 400,
            p: '12px',
            boxShadow: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
            m: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: 32,
          }}
        >
          <ErrorOutlineIcon />
          <Typography
            variant="body1"
            sx={{
              color: '#F0F1F5',
              fontSize: 15,
              fontWeight: 400,
              lineHeight: '22.50px',
            }}
          >
            {t('sandbox.save_confirm_title')}
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 0,
            mt: '8px',
            minHeight: 108,
            backgroundColor: '#161C25',
            borderRadius: '8px',
            border: '1px solid #4E576A',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: '12px',
            py: 0,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#F0F1F5',
              fontSize: 15,
              fontWeight: 400,
              lineHeight: '22.50px',
              textAlign: 'center',
            }}
          >
            {t('sandbox.save_confirm_message')}
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            p: 0,
            mt: '8px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
            pt: '20px',
            pb: '20px',
          }}
        >
          <Button
            onClick={handleSaveConfirm}
            disabled={isSaving}
            sx={{
              padding: '4px 12px',
              backgroundColor: '#5E66FF',
              borderRadius: '4px',
              color: 'white',
              fontSize: 15,
              fontWeight: 400,
              lineHeight: '22.50px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#4E57E5' },
            }}
          >
            {isSaving ? t('sandbox.saving') : t('sandbox.save_confirm_btn')}
          </Button>
          <Button
            onClick={() => setSaveDialogOpen(false)}
            sx={{
              padding: '4px 12px',
              backgroundColor: '#EFF6FF',
              borderRadius: '4px',
              border: '1px solid #DFEAFF',
              color: '#6B89FF',
              fontSize: 15,
              fontWeight: 400,
              lineHeight: '22.50px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#E0E8FF' },
            }}
          >
            {t('sandbox.save_cancel_btn')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function TestEnvironmentModal({
  open,
  onClose,
  definition,
  fileName,
  layoutDefinition,
  node,
  layout,
}: TestEnvironmentModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      disablePortal
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      slotProps={{
        backdrop: {
          sx: { position: 'absolute' },
        },
      }}
    >
      <ReactFlowProvider>
        <ModalContent
          onClose={onClose}
          definition={definition}
          fileName={fileName}
          layoutDefinition={layoutDefinition}
          node={node}
          layout={layout}
        />
      </ReactFlowProvider>
    </Modal>
  );
}
