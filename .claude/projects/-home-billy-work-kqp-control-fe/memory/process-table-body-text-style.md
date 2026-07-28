---
name: process-table-body-text-style
description: Process (프로세스) table body-text style values used as the reference for other tables
metadata:
  type: reference
---

The 프로세스 (Process) table body text style — the canonical/reference body style the user asks other tables to match:

- **fontWeight:** 400 (DataTable default `bodyWeight`)
- **fontSize:** 16px (DataTable default from the `<table>` Box)
- **color:** `T.textSec` = `#A8AABA` (the dominant body color; most process columns set `color: T.textSec` or `dim`)

Source: `src/components/nodes/ProcessDetail.tsx`. Shared table component is `DataTable` in `src/components/v5/index.tsx`.

Light indigo = `ACCENT2` (`#9384FF`) from `src/theme/tokens.ts` — the user excludes these cells when restyling body text.
