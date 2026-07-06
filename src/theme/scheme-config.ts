import { defaultSettings } from 'src/components/settings';

// ----------------------------------------------------------------------

export const schemeConfig = {
  // Bumped key so any previously-persisted 'light' preference is ignored — the
  // app is dark-only (v5 design). Default mode is always dark.
  modeStorageKey: 'theme-mode-v5',
  defaultMode: defaultSettings.colorScheme,
};
