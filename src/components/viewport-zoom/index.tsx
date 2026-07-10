'use client';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------
// Replicates k-control-fe-ui's viewport scaler: the design is fixed to a
// 1536×864 desktop baseline, so we zoom the root proportionally to fit smaller
// viewports (never upscaling, floor 0.8). The zoom is continuous across ALL
// widths — including below the sidebar breakpoint — so shrinking the window
// scales the whole app smoothly instead of snapping back to 1:1 at 1200px.
// ----------------------------------------------------------------------

const BASE_W = 1536;
const BASE_H = 864;
const MIN = 0.8;

// Viewport width (px) at/above which the sidebar uses its full desktop layout;
// below it, the sidebar swaps to the compact 140px rail. This only drives the
// sidebar swap — the root zoom keeps scaling continuously on both sides.
export const DESKTOP_MIN_WIDTH = 1200;

// The root `zoom` factor applied to <html> — scaled to the reference baseline
// (down to MIN), continuous across all widths. Exported so components
// incompatible with an ancestor CSS `zoom` (e.g. React Flow, which ignores it
// when measuring handles/edges) can read and counteract it.
export function getViewportScale() {
  if (typeof window === 'undefined') return 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.min(1, Math.max(MIN, Math.min(w / BASE_W, h / BASE_H)));
}

// True while the viewport is at/above the sidebar breakpoint. Drives the
// desktop⇄compact sidebar swap. Uses window.innerWidth (unaffected by the root
// CSS `zoom`) rather than a media query, so it agrees exactly with the
// DESKTOP_MIN_WIDTH boundary.
export function useIsDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= DESKTOP_MIN_WIDTH);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isDesktop;
}

export function ViewportZoom() {
  useEffect(() => {
    const apply = () => {
      // `zoom` (not transform) so fixed/sticky positioning still works.
      (document.documentElement.style as any).zoom = String(getViewportScale());
    };
    apply();
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('resize', apply);
      (document.documentElement.style as any).zoom = '';
    };
  }, []);

  return null;
}
