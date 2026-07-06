'use client';

import type { Theme, SxProps, CSSObject } from '@mui/material/styles';

import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { layoutClasses } from '../classes';

// ----------------------------------------------------------------------

export type LayoutSectionProps = {
  sx?: SxProps<Theme>;
  cssVars?: CSSObject;
  children?: React.ReactNode;
  footerSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  sidebarSection?: React.ReactNode;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
}: LayoutSectionProps) {
  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          '--layout-nav-zIndex': 1101,
          '--layout-nav-mobile-width': '320px',
          '--layout-header-blur': '8px',
          '--layout-header-zIndex': 1100,
          '--layout-header-mobile-height': '64px',
          '--layout-header-desktop-height': '72px',
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box id="root__layout" className={layoutClasses.root} sx={sx}>
        {sidebarSection ? (
          <>
            {/* Full-width top bar spanning the whole shell, with the sidebar and
                content sitting in a row beneath it (matches the reference). */}
            {headerSection}
            <Box
              display="flex"
              flex="1 1 auto"
              // minHeight:0 lets this row shrink to the bounded (100vh) shell
              // instead of growing to its content, so Main and every PageShell
              // below it get a definite height and scroll={false} pages scroll.
              minHeight={0}
              className={layoutClasses.hasSidebar}
            >
              {sidebarSection}
              <Box
                display="flex"
                flex="1 1 auto"
                flexDirection="column"
                minWidth={0}
                minHeight={0}
              >
                {children}
                {footerSection}
              </Box>
            </Box>
          </>
        ) : (
          <>
            {headerSection}
            {children}
            {footerSection}
          </>
        )}
      </Box>
    </>
  );
}
