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
import { T, ACCENT2 } from 'src/theme/tokens';

import { toast } from 'src/components/snackbar';
import { usePopover } from 'src/components/custom-popover';
import { useIsDesktopViewport } from 'src/components/viewport-zoom';

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
  minimized,
  onMinimize,
  onRestore,
}: Omit<TestEnvironmentModalProps, 'open'> & {
  minimized: boolean;
  onMinimize: () => void;
  onRestore: () => void;
}) {
  const { t } = useTranslate('data-flow');

  // View mode & layout state
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
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

  // View-mode popover (opened by the "vertical view" control)
  const viewModePopover = usePopover();

  // Card ref
  const contentRef = useRef<HTMLDivElement>(null);

  // Sidebar offset so the minimized bar stays within the content area (not over
  // the left nav). Mirrors the sidebar's own widths / 1200px breakpoint.
  const isDesktop = useIsDesktopViewport();
  const sidebarWidth = isDesktop ? 268 : 140;

  // Warn before browser-level navigation (refresh / tab close / typed URL) while
  // the sandbox has unsaved edits. (In-app sidebar navigation uses router.push,
  // not links, so it can't be intercepted here — see note to the user.)
  useEffect(() => {
    if (moonCode === layoutDefinition) return undefined;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [moonCode, layoutDefinition]);

  // ---------- Handlers ----------

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      viewModePopover.onClose();
    },
    [viewModePopover]
  );

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
        // Expanded: full viewport (minus 20px insets). Minimized: shift the left
        // edge right of the sidebar so the bar stays inside the layout-detail
        // content area instead of covering the left nav.
        left: minimized ? sidebarWidth + 20 : 20,
        right: 20,
        bottom: 20,
        // Anchored at the bottom: minimized collapses to a 52px bar — animating
        // height + left slides it down into the content region.
        height: minimized ? 52 : 'calc(100% - 40px)',
        pointerEvents: 'auto',
        overflow: 'hidden',
        borderRadius: '14px',
        bgcolor: T.bg,
        boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
        display: 'flex',
        flexDirection: 'column',
        transition:
          'height 0.28s cubic-bezier(0.4, 0, 0.2, 1), left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Minimized bar — collapsed to a bottom bar; click anywhere to restore */}
      {minimized && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={onRestore}
          sx={{
            height: '100%',
            px: 2.5,
            cursor: 'pointer',
            backgroundColor: T.bgPanel,
            transition: 'background 0.12s',
            '&:hover': { backgroundColor: T.bgHover },
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DataFlowIcon color={T.link} size={16} />
          </Box>
          <Typography
            sx={{ fontSize: 15, fontWeight: 400, lineHeight: '22px', color: T.link }}
          >
            {t('sandbox.title')}
          </Typography>
          {/* "작성중..." — only while there are unsaved edits */}
          <Typography
            sx={{ flex: 1, fontSize: 13, fontWeight: 300, lineHeight: '22px', color: T.textDim }}
          >
            {moonCode !== layoutDefinition ? t('sandbox.editing') : ''}
          </Typography>
          {/* Restore chevron (up) */}
          <Box sx={{ display: 'flex', color: ACCENT2, transform: 'rotate(180deg)' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={ACCENT2}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.7344 8.40505C20.0628 8.7006 20.0894 9.20643 19.7939 9.53485L12.5947 17.5349C12.443 17.7034 12.2268 17.7997 12 17.7997C11.7732 17.7997 11.5571 17.7035 11.4054 17.5349L4.20537 9.53489C3.9098 9.20648 3.93643 8.70065 4.26484 8.40508C4.59324 8.10951 5.09908 8.13613 5.39464 8.46454L12 15.8038L18.6046 8.46457C18.9001 8.13615 19.4059 8.1095 19.7344 8.40505Z"
                fill={ACCENT2}
              />
            </svg>
          </Box>
        </Stack>
      )}

      {!minimized && (
        <>
          {/* ========== Modal Header — fixed top toolbar bar ==========
          Pinned at the top (flexShrink: 0) while the body below scrolls; narrower
          internal padding, own panel background + bottom divider. The card's
          overflow:hidden + 14px radius rounds the toolbar's top corners. */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              flexShrink: 0,
              px: 2.5,
              py: 1.5,
              backgroundColor: T.bgPanel,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DataFlowIcon color={T.link} size={16} />
            </Box>

            <Typography
              sx={{
                flex: 1,
                fontSize: 15,
                fontWeight: 400,
                lineHeight: '22px',
                color: T.link,
              }}
            >
              {t('sandbox.title')}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              {/* Zoom label */}
              <Box
                sx={{
                  px: 1.5,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  background: `${ACCENT2}14`,
                  border: `1px solid ${T.border}`,
                  borderRadius: '6px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: '16.8px',
                    color: T.textSec,
                    fontFamily: "'Spoqa Han Sans Neo'",
                  }}
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
                sx={{
                  px: 1.5,
                  height: 26,
                  background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`,
                  border: `1px solid ${T.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  '&:hover': { background: `linear-gradient(to top, ${ACCENT2}77, ${ACCENT2}22)` },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: '22.5px',
                    fontFamily: "'Spoqa Han Sans Neo'",
                    color: ACCENT2,
                  }}
                >
                  {t(isHorizontal ? 'sandbox.horizontal_view' : 'sandbox.vertical_view')}
                </Typography>
                <Box
                  sx={{
                    color: ACCENT2,
                    flexShrink: 0,
                    display: 'inline-flex',
                  }}
                >
                  {isHorizontal ? (
                    <HorizontalViewIcon color={ACCENT2} />
                  ) : (
                    <VerticalViewIcon color={ACCENT2} />
                  )}
                </Box>
              </Stack>

              {/* Minimize button (chevron down) — collapses the modal to a bottom bar */}
              <Box
                onClick={onMinimize}
                sx={{
                  px: 1.5,
                  py: '4px',
                  background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`,
                  border: `1px solid ${T.border}`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { background: `linear-gradient(to top, ${ACCENT2}77, ${ACCENT2}22)` },
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={ACCENT2}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.7344 8.40505C20.0628 8.7006 20.0894 9.20643 19.7939 9.53485L12.5947 17.5349C12.443 17.7034 12.2268 17.7997 12 17.7997C11.7732 17.7997 11.5571 17.7035 11.4054 17.5349L4.20537 9.53489C3.9098 9.20648 3.93643 8.70065 4.26484 8.40508C4.59324 8.10951 5.09908 8.13613 5.39464 8.46454L12 15.8038L18.6046 8.46457C18.9001 8.13615 19.4059 8.1095 19.7344 8.40505Z"
                    fill={ACCENT2}
                  />
                </svg>
              </Box>

              {/* Close button */}
              <Box
                onClick={onClose}
                sx={{
                  px: 1.5,
                  py: '4px',
                  background: `linear-gradient(to top, ${ACCENT2}55, ${ACCENT2}14)`,
                  border: `1px solid ${T.border}`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { background: `linear-gradient(to top, ${ACCENT2}77, ${ACCENT2}22)` },
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={ACCENT2}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.6308 4.2347C18.9432 3.92248 19.4493 3.92236 19.7617 4.2347C20.074 4.54705 20.0739 5.05312 19.7617 5.36556L13.1288 11.9984L19.7656 18.6351C20.078 18.9475 20.078 19.4545 19.7656 19.7669C19.4532 20.0792 18.9471 20.0791 18.6347 19.7669L11.998 13.1292L5.36127 19.7669C5.04885 20.0791 4.54275 20.0792 4.23041 19.7669C3.91798 19.4545 3.918 18.9475 4.23041 18.6351L10.8662 11.9984L4.23431 5.36556C3.92209 5.05312 3.92196 4.54705 4.23431 4.2347C4.54667 3.92236 5.05275 3.92248 5.36517 4.2347L11.998 10.8675L18.6308 4.2347Z"
                    fill={ACCENT2}
                  />
                </svg>
              </Box>
            </Stack>
          </Stack>

          {/* ========== Popovers ========== */}
          <HeaderPopovers
            viewMode={viewMode}
            viewModePopover={viewModePopover}
            onViewModeChange={handleViewModeChange}
          />

          {/* Scrollable body — everything below the fixed toolbar scrolls here.
          Scrollbar deferred to the global hover-reveal rule. */}
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pt: 3, px: 4.5, pb: 6 }}>
            {/* ========== Panels Container ========== */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                gap: 3,
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
          </Box>
        </>
      )}

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
  const [minimized, setMinimized] = useState(false);

  // Always reopen expanded (reset the minimized state whenever the modal opens).
  useEffect(() => {
    if (open) setMinimized(false);
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      // When minimized: hide the backdrop, release the focus/scroll locks, and let
      // pointer events fall through the modal root so the page behind stays usable
      // (only the bottom bar itself is interactive). Expanded: opaque backdrop.
      hideBackdrop={minimized}
      disableEnforceFocus={minimized}
      disableAutoFocus={minimized}
      disableScrollLock={minimized}
      sx={{ pointerEvents: minimized ? 'none' : undefined }}
      slotProps={{ backdrop: { sx: { backgroundColor: '#0B0A10' } } }}
    >
      <ReactFlowProvider>
        <ModalContent
          onClose={onClose}
          definition={definition}
          fileName={fileName}
          layoutDefinition={layoutDefinition}
          node={node}
          layout={layout}
          minimized={minimized}
          onMinimize={() => setMinimized(true)}
          onRestore={() => setMinimized(false)}
        />
      </ReactFlowProvider>
    </Modal>
  );
}
