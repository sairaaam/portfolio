// Premium line icons (Lucide-style, MIT paths) — replaces the WhatsApp-style
// emoji glyphs throughout the UI. All inherit `currentColor` so callers tint
// them via the `color` style.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 24, style = {}, className = '', children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...base}
      style={style}
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// Stylized soccer ball — used everywhere a ⚽ appeared
export function FootballIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7 L14.85 9.07 L13.76 12.43 L10.24 12.43 L9.15 9.07 Z" />
      <path d="M12 7 V2.5 M14.85 9.07 L19 7.2 M13.76 12.43 L16.5 16 M10.24 12.43 L7.5 16 M9.15 9.07 L5 7.2" />
    </Svg>
  )
}

// AI / computer vision — MedAR
function CpuIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
    </Svg>
  )
}

// Algorithmic trading / finance — ARIA
function TrendingUpIcon(props) {
  return (
    <Svg {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </Svg>
  )
}

// Education / LMS
function BookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Svg>
  )
}

// Globe / website — GD College
function GlobeIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  )
}


// Maps project id → icon component
export const PROJECT_ICONS = {
  1: CpuIcon,        // MedAR — AI / CV
  2: TrendingUpIcon, // ARIA — algorithmic trading
  3: BookIcon,       // GD LMS — education
  4: GlobeIcon,      // GD College Website
}
