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
        pb: 6,
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
              py: '4px',
              backgroundColor: '#373F4E',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#4E576A' },
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={TEXT_TERTIARY} xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.7344 8.40505C20.0628 8.7006 20.0894 9.20643 19.7939 9.53485L12.5947 17.5349C12.443 17.7034 12.2268 17.7997 12 17.7997C11.7732 17.7997 11.5571 17.7035 11.4054 17.5349L4.20537 9.53489C3.9098 9.20648 3.93643 8.70065 4.26484 8.40508C4.59324 8.10951 5.09908 8.13613 5.39464 8.46454L12 15.8038L18.6046 8.46457C18.9001 8.13615 19.4059 8.1095 19.7344 8.40505Z" fill={TEXT_TERTIARY} />
            </svg>
          </Box>

          {/* Close button */}
          <Box
            onClick={onClose}
            sx={{
              px: 1.5,
              py: '4px',
              backgroundColor: '#373F4E',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#4E576A' },
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={TEXT_TERTIARY} xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M18.6308 4.2347C18.9432 3.92248 19.4493 3.92236 19.7617 4.2347C20.074 4.54705 20.0739 5.05312 19.7617 5.36556L13.1288 11.9984L19.7656 18.6351C20.078 18.9475 20.078 19.4545 19.7656 19.7669C19.4532 20.0792 18.9471 20.0791 18.6347 19.7669L11.998 13.1292L5.36127 19.7669C5.04885 20.0791 4.54275 20.0792 4.23041 19.7669C3.91798 19.4545 3.918 18.9475 4.23041 18.6351L10.8662 11.9984L4.23431 5.36556C3.92209 5.05312 3.92196 4.54705 4.23431 4.2347C4.54667 3.92236 5.05275 3.92248 5.36517 4.2347L11.998 10.8675L18.6308 4.2347Z" fill={TEXT_TERTIARY} />
            </svg>
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
