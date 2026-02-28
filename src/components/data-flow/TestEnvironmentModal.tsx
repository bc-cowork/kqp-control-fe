'use client';

import '@xyflow/react/dist/style.css';

import { ReactFlowProvider } from '@xyflow/react';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

import { TEXT_TERTIARY } from './constants';
import { HeaderPopovers } from './test-environment/HeaderPopovers';
import { SaveConfirmDialog } from './test-environment/SaveConfirmDialog';
import { DataFlowPreviewPanel } from './test-environment/DataFlowPreviewPanel';
import { MoonScriptEditorPanel } from './test-environment/MoonScriptEditorPanel';
import { DataFlowIcon, VerticalViewIcon, HorizontalViewIcon } from './test-environment/icons';

import type { DataFlowDefinition } from './types';

// ----------------------------------------------------------------------

type ViewMode = 'horizontal' | 'vertical';

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

  // View mode & layout state
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
  const [interfaceScale, setInterfaceScale] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Editable MoonScript code
  const [moonCode, setMoonCode] = useState(layoutDefinition);

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

  // ---------- Handlers ----------

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      viewModePopover.onClose();
      setViewScreenAnchor(null);
      optionsPopover.onClose();
    },
    [viewModePopover, optionsPopover]
  );

  const handleScaleChange = useCallback(
    (value: number) => {
      setInterfaceScale(value);
      setScaleAnchor(null);
      optionsPopover.onClose();
    },
    [optionsPopover]
  );

  const handleToggleFullscreen = useCallback(() => {
    optionsPopover.onClose();
    if (!document.fullscreenElement) {
      contentRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [optionsPopover]);

  const handleOptionsClose = useCallback(() => {
    optionsPopover.onClose();
    setViewScreenAnchor(null);
    setScaleAnchor(null);
  }, [optionsPopover]);

  const handleExit = useCallback(() => {
    optionsPopover.onClose();
    onClose();
  }, [optionsPopover, onClose]);

  // Sync fullscreen state with browser
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Preview handler
  const handlePreview = useCallback(async () => {
    setIsPreviewing(true);
    try {
      const response = await axiosInstance.post(endpoints.layouts.preview(node), {
        layout_definition: moonCode,
      });
      if (response.data?.okay) {
        setCurrentDefinition(response.data.data.data_flow_definition as DataFlowDefinition);
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

  // Save handler
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
        <Box sx={{ width: 24, height: 24, position: 'relative' }}>
          <DataFlowIcon />
        </Box>

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
              sx={{
                color: 'white',
                flexShrink: 0,
                display: 'inline-flex',
                marginBottom: '-4px',
              }}
            >
              {isHorizontal ? (
                <HorizontalViewIcon color="white" />
              ) : (
                <VerticalViewIcon color="white" />
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

      {/* ========== Popovers ========== */}
      <HeaderPopovers
        viewMode={viewMode}
        interfaceScale={interfaceScale}
        isFullscreen={isFullscreen}
        viewModePopover={viewModePopover}
        optionsPopover={optionsPopover}
        viewScreenAnchor={viewScreenAnchor}
        scaleAnchor={scaleAnchor}
        onViewModeChange={handleViewModeChange}
        onScaleChange={handleScaleChange}
        onToggleFullscreen={handleToggleFullscreen}
        onOptionsClose={handleOptionsClose}
        onExit={handleExit}
        onViewScreenAnchorChange={setViewScreenAnchor}
        onScaleAnchorChange={setScaleAnchor}
      />

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
        <DataFlowPreviewPanel
          currentDefinition={currentDefinition}
          fileName={fileName}
          isHorizontal={isHorizontal}
          isSaving={isSaving}
          onSaveClick={() => setSaveDialogOpen(true)}
          onZoomChange={setZoom}
        />

        <MoonScriptEditorPanel
          layoutDefinition={layoutDefinition}
          isHorizontal={isHorizontal}
          isPreviewing={isPreviewing}
          onCodeChange={setMoonCode}
          onPreview={handlePreview}
        />
      </Box>

      {/* ========== Save Confirmation Dialog ========== */}
      <SaveConfirmDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onConfirm={handleSaveConfirm}
        isSaving={isSaving}
      />
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
