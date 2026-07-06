import 'src/global.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';

import { SWRConfig } from 'swr';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/theme/core/palette';
import { detectLanguage } from 'src/locales/server';
import { schemeConfig } from 'src/theme/scheme-config';
import { ThemeProvider } from 'src/theme/theme-provider';
import { I18nProvider, LocalizationProvider } from 'src/locales';

import { ProgressBar } from 'src/components/progress-bar';
import { ViewportZoom } from 'src/components/viewport-zoom';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  icons: [
    // Default (also used for dark mode and browsers with no color-scheme preference).
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon-light.ico`,
      media: '(prefers-color-scheme: light)',
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const lang = CONFIG.isStaticExport ? 'en' : await detectLanguage();
  return (
    <html lang={lang ?? 'en'} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={schemeConfig.defaultMode}
          modeStorageKey={schemeConfig.modeStorageKey}
        />
        <SWRConfig value={{ shouldRetryOnError: false }}>
          <I18nProvider lang={CONFIG.isStaticExport ? undefined : lang}>
            <LocalizationProvider>
              <AuthProvider>
                <SettingsProvider settings={defaultSettings}>
                  <ThemeProvider>
                    <MotionLazy>
                      <ViewportZoom />
                      <ProgressBar />
                      <SettingsDrawer hideColorScheme />
                      {children}
                    </MotionLazy>
                  </ThemeProvider>
                </SettingsProvider>
              </AuthProvider>
            </LocalizationProvider>
          </I18nProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
