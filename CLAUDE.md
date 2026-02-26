# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KQP Control Frontend — an admin/monitoring panel for the Kuanta messaging system. Built with **Next.js 14 (App Router)**, **TypeScript**, and **Material-UI v5**.

## Commands

| Task | Command |
|------|---------|
| Dev server | `yarn dev` (uses `.env.local`) |
| Build | `yarn build` (or `next build`) |
| Production start | `yarn start` (uses `.env`) |
| Lint | `yarn lint` |
| Lint fix | `yarn lint:fix` |
| Format check | `yarn fm:check` |
| Format fix | `yarn fm:fix` |
| Type check | `yarn ts` |
| Type check watch | `yarn ts:watch` |
| Clean reinstall | `yarn re:start` |

No test framework is configured.

## Architecture

### Data Fetching (SWR + Axios)

All API data is fetched via **SWR** hooks in `src/actions/`. Each hook returns a memoized object with `data`, `loading`, `error`, `validating`, and `empty` fields following a consistent naming pattern:

```typescript
const { nodes, nodesLoading, nodesError, nodesValidating, nodesEmpty } = useGetNodes();
```

The SWR `fetcher` in `src/utils/axios.ts` supports a **mock data mode**: set `CONFIG.apiDataType` to `'dummy'` in `src/config-global.ts` to use mock data from `src/mocks/mock-data.json` instead of hitting the real API.

API endpoints are defined as an `endpoints` object in `src/utils/axios.ts`. Most are functions that take a `node` string parameter (e.g., `endpoints.dashboard.processList(node)`). The base URL comes from `NEXT_PUBLIC_SERVER_URL` env var. Backend API paths are prefixed with `/apik/`.

### Routing

Next.js App Router with dynamic segments. Route paths are centralized in `src/routes/paths.ts` — always use `paths.dashboard.nodes.*` helpers rather than hardcoding URL strings. Node-specific pages use `[node]` dynamic segments.

### Component Organization

- **`src/app/`** — Next.js route pages (thin wrappers that render Views)
- **`src/sections/`** — Feature-specific page content (the "View" components, e.g. `DashboardView`)
- **`src/components/`** — Reusable shared components (common UI, hook-form wrappers, animations)
- **`src/layouts/`** — Shell layouts (dashboard sidebar/nav, auth layouts)
- **`src/actions/`** — SWR data-fetching hooks
- **`src/hooks/`** — Generic custom React hooks (`useBoolean`, `useSetState`, `useDebounce`, etc.)
- **`src/types/`** — TypeScript type definitions (`api.ts`, `dashboard.ts`, `node.ts`)
- **`src/utils/`** — Utility functions (axios instance, time formatting, array/object helpers)
- **`src/theme/`** — MUI theme configuration (palette, typography, overrides, light/dark schemes)
- **`src/locales/`** — i18next internationalization setup and language files
- **`src/auth/`** — JWT authentication (context provider, guards, hooks)

### Authentication

JWT-based auth configured in `src/config-global.ts`. The auth context is in `src/auth/context/jwt/`. Protected routes use `AuthGuard` from `src/auth/guard/`. User session is stored in sessionStorage.

### Styling

MUI v5 with Emotion CSS-in-JS. Use the `sx` prop for styling. Theme colors/tokens are in `src/theme/core/`. Supports light/dark mode.

## Code Conventions

### Import Ordering (enforced by eslint-plugin-perfectionist)

Imports are auto-sorted by line length in this group order:
1. Style imports → 2. Type imports → 3. External packages → 4. `@mui/*` → 5. `src/routes/*` → 6. `src/hooks/*` → 7. `src/utils/*` → 8. Other `src/*` internals → 9. `src/components/*` → 10. `src/sections/*` → 11. `src/auth/*` → 12. `src/types/*` → 13. Relative imports

Use `type` keyword for type-only imports (`@typescript-eslint/consistent-type-imports` is enforced).

### Formatting

Prettier: 2-space indent, single quotes, semicolons, 100-char line width, trailing commas (es5), LF line endings.

### API Response Shape

All API responses follow this structure:
```typescript
{ okay: boolean; msg: string; data: T; meta?: { has_previous_page, has_next_page, current_page, total_pages } }
```

### Key Environment Variable

- `NEXT_PUBLIC_SERVER_URL` — Backend API base URL (required)
