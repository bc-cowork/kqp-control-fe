'use client';

import NextLink from 'next/link';

import { Box, Link, Typography } from '@mui/material'; // Import Next.js Link for routing

// ----------------------------------------------------------------------

type Page = {
  pageName: string;
  link?: string; // Optional link property
};

type Props = {
  node: string;
  pages: Page[];
};

export function Breadcrumb({ node, pages }: Props) {
  return (
    <Box>
      {/* "Nodes" - No link */}
      <Typography variant="h3" display="inline" sx={{ color: (theme) => theme.palette.grey[400] }}>
        Nodes
      </Typography>

      {/* Node value - No link, styled with background */}
      <Typography variant="h3" display="inline" sx={{ color: (theme) => theme.palette.grey[400] }}>
        {` > `}
      </Typography>
      <Typography
        variant="h3"
        display="inline"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[200],
          px: 1,
          py: 0.5,
          border: 1,
          borderRadius: 1,
          borderColor: (theme) => theme.palette.grey[300],
          color: (theme) => theme.palette.grey[400],
        }}
      >
        {node}
      </Typography>

      {/* Pages array */}
      {pages.map((page, index) => {
        const isLast = index === pages.length - 1;
        const hasLink = !isLast && page.link; // Link only if not last and link exists

        return (
          <Box component="span" key={index}>
            <Typography
              variant="h3"
              display="inline"
              sx={{ color: (theme) => theme.palette.grey[400] }}
            >
              {` > `}
            </Typography>
            {hasLink ? (
              <Link
                component={NextLink}
                href={page.link}
                variant="h3"
                sx={{
                  color: (theme) => theme.palette.grey[400],
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {page.pageName}
              </Link>
            ) : (
              <Typography
                variant={isLast ? 'h2' : 'h3'} // Larger variant for last item
                display="inline"
                sx={{
                  color: (theme) => (isLast ? theme.palette.common.black : theme.palette.grey[400]),
                }}
              >
                {page.pageName}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
