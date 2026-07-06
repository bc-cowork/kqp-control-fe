// ----------------------------------------------------------------------
// Icon set ported verbatim from k-control-fe-ui (inline stroke SVGs from its
// `Icon` map + the /icons/*.svg files, recoloured to `currentColor`).
// Colour follows the parent's CSS `color`; `size` sets the height (width keeps
// the icon's native aspect ratio).
// ----------------------------------------------------------------------

export type KIconName =
  | 'home'
  | 'certified'
  | 'arrowRight'
  | 'scrap'
  | 'reset'
  | 'back'
  | 'fwd'
  | 'search'
  | 'monitor'
  | 'clock'
  | 'globe'
  | 'settings'
  | 'bell'
  | 'logout'
  | 'chevronUp'
  | 'chevronDown';

type IconDef = {
  vb: string;
  ratio: number; // width / height
  stroke?: boolean;
  body: React.ReactNode;
};

const ICONS: Record<KIconName, IconDef> = {
  home: {
    vb: '0 0 24 24',
    ratio: 1,
    body: (
      <path
        fill="currentColor"
        d="m3.35 10.397 8-6.844a1 1 0 0 1 1.3 0l8 6.844a1 1 0 0 1 .35.76v9.04a1 1 0 0 1-1 1h-4.75a1 1 0 0 1-1-1v-4.5a.5.5 0 0 0-.5-.5h-3.5a.5.5 0 0 0-.5.5v4.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.04a1 1 0 0 1 .35-.76Z"
      />
    ),
  },
  certified: {
    vb: '0 0 24 24',
    ratio: 1,
    body: (
      <>
        <path
          fill="currentColor"
          d="M13.8 13.8a1.8 1.8 0 0 1-1 1.612V17.2a.8.8 0 0 1-1.6 0v-1.786a1.8 1.8 0 1 1 2.6-1.614Z"
        />
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.784 8c-.045-1.088-.22-2.38-.835-3.489a4.535 4.535 0 0 0-1.817-1.813C14.302 2.245 13.268 2 12 2s-2.303.245-3.133.698A4.536 4.536 0 0 0 7.05 4.51C6.434 5.621 6.26 6.912 6.214 8H4.8A1.8 1.8 0 0 0 3 9.8v9.4A1.8 1.8 0 0 0 4.8 21h14.4a1.8 1.8 0 0 0 1.8-1.8V9.8A1.8 1.8 0 0 0 19.2 8h-1.416ZM7.816 8c.046-.957.198-1.928.633-2.711a2.936 2.936 0 0 1 1.183-1.187C10.178 3.805 10.935 3.6 12 3.6s1.822.205 2.367.502c.54.295.916.704 1.184 1.187.435.783.586 1.754.632 2.711H7.816ZM7 9.6H4.8a.2.2 0 0 0-.2.2v9.4c0 .11.09.2.2.2h14.4a.2.2 0 0 0 .2-.2V9.8a.2.2 0 0 0-.2-.2H7Z"
        />
      </>
    ),
  },
  arrowRight: {
    vb: '0 0 24 24',
    ratio: 1,
    body: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.406 19.735a.8.8 0 0 0 1.13.06l8-7.2a.8.8 0 0 0 0-1.19l-8-7.2a.8.8 0 0 0-1.071 1.19L15.805 12l-7.34 6.605a.8.8 0 0 0-.06 1.13Z"
      />
    ),
  },
  scrap: {
    vb: '0 0 24 24',
    ratio: 1,
    body: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3.8A1.8 1.8 0 0 1 5.8 2h12.4A1.8 1.8 0 0 1 20 3.8v16.242c0 1.533-1.793 2.365-2.963 1.374l-4.814-4.079-5.33 4.071c-1.184.905-2.892.06-2.892-1.43V9.59L4 9.537V3.8Zm1.8-.2a.2.2 0 0 0-.2.2v16.178a.2.2 0 0 0 .322.159l5.841-4.462a.8.8 0 0 1 1.003.025l5.305 4.495a.2.2 0 0 0 .33-.153V3.8a.2.2 0 0 0-.2-.2H5.8Z"
      />
    ),
  },
  reset: {
    vb: '0 0 16 16',
    ratio: 1,
    body: (
      <path
        fill="currentColor"
        d="M8.03027 1.73291C10.2563 1.73291 12.2127 2.88289 13.333 4.61768V2.6665C13.3332 2.37224 13.572 2.13355 13.8662 2.1333C14.1607 2.1333 14.4002 2.37209 14.4004 2.6665V6.00049C14.4002 6.29488 14.1606 6.53369 13.8662 6.53369H10.5332C10.2388 6.53362 10.0002 6.29483 10 6.00049C10 5.70598 10.2387 5.46638 10.5332 5.46631H12.5977C11.7027 3.87649 9.99408 2.80029 8.03027 2.80029C5.13796 2.80049 2.79883 5.13154 2.79883 8.00049C2.79906 10.8692 5.1381 13.1995 8.03027 13.1997C10.6549 13.1997 12.8258 11.2799 13.2041 8.78076C13.2482 8.48954 13.5203 8.28849 13.8115 8.33252C14.1028 8.37658 14.3028 8.6487 14.2588 8.93994C13.8022 11.9574 11.186 14.2671 8.03027 14.2671C4.55463 14.2669 1.73167 11.4639 1.73145 8.00049C1.73145 4.53681 4.55449 1.73311 8.03027 1.73291Z"
      />
    ),
  },
  back: {
    vb: '0 0 7 11',
    ratio: 7 / 11,
    body: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.26298 10.4903C6.06593 10.7092 5.72871 10.7269 5.50978 10.5299L0.176444 5.72976C0.0640657 5.62861 -0.000103237 5.48453 -0.000102753 5.33333C-0.000101316 5.18214 0.06407 5.03806 0.17645 4.93691L5.50978 0.136914C5.72872 -0.0601305 6.06594 -0.042382 6.26299 0.176557C6.46003 0.395495 6.44228 0.732717 6.22335 0.929762L1.33048 5.33334L6.22335 9.73705C6.44229 9.9341 6.46003 10.2713 6.26298 10.4903Z"
      />
    ),
  },
  fwd: {
    vb: '0 0 7 11',
    ratio: 7 / 11,
    body: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.136908 10.4902C0.333948 10.7092 0.671169 10.7269 0.890112 10.5299L6.22345 5.73009C6.33583 5.62895 6.4 5.48487 6.40001 5.33368C6.40001 5.18249 6.33584 5.0384 6.22347 4.93725L0.890133 0.136926C0.671201 -0.0601258 0.333979 -0.0423887 0.136926 0.176543C-0.0601257 0.395475 -0.0423886 0.732697 0.176543 0.929749L5.06943 5.33364L0.176565 9.73704C-0.0423775 9.93408 -0.0601328 10.2713 0.136908 10.4902Z"
      />
    ),
  },
  search: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    body: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </>
    ),
  },
  monitor: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    body: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  clock: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    body: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  globe: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    body: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </>
    ),
  },
  settings: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    body: (
      <>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  bell: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    body: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
  },
  logout: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    body: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
  },
  chevronUp: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    strokeWidth: 3,
    body: <path d="m6 15 6-6 6 6" />,
  } as IconDef & { strokeWidth: number },
  chevronDown: {
    vb: '0 0 24 24',
    ratio: 1,
    stroke: true,
    strokeWidth: 3,
    body: <path d="m6 9 6 6 6-6" />,
  } as IconDef & { strokeWidth: number },
};

type KIconProps = {
  name: KIconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function KIcon({ name, size = 16, className, style }: KIconProps) {
  const ic = ICONS[name] as IconDef & { strokeWidth?: number };
  const width = Math.round(size * ic.ratio);
  return (
    <svg
      width={width}
      height={size}
      viewBox={ic.vb}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      {...(ic.stroke
        ? {
            stroke: 'currentColor',
            strokeWidth: ic.strokeWidth ?? 2,
            strokeLinecap: 'round' as const,
            strokeLinejoin: 'round' as const,
          }
        : {})}
    >
      {ic.body}
    </svg>
  );
}
