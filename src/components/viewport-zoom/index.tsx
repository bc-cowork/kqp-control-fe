'use client';

import { useEffect } from 'react';

// ----------------------------------------------------------------------
// Replicates k-control-fe-ui's viewport scaler: the design is fixed to a
// 1536×864 desktop baseline, so we zoom the root proportionally to fit smaller
// viewports (never upscaling, floor 0.7). This makes the whole app render at
// the reference's density/scale identically across screen sizes.
// ----------------------------------------------------------------------

const BASE_W = 1536;
const BASE_H = 864;
const MIN = 0.7;

// The root `zoom` factor currently applied to <html>. 1 on the reference-sized
// (or larger) desktop, down to MIN on smaller viewports. Exported so components
// that are incompatible with an ancestor CSS `zoom` (e.g. React Flow, which
// ignores it when measuring handles/edges) can read and counteract it.
export function getViewportScale() {
  if (typeof window === 'undefined') return 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.min(1, Math.max(MIN, Math.min(w / BASE_W, h / BASE_H)));
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
