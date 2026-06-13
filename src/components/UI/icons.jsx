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

// AI / computer vision
function CpuIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
    </Svg>
  )
}

// EdTech / study platform
function BookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Svg>
  )
}

// SaaS / dashboards
function DashboardIcon(props) {
  return (
    <Svg {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </Svg>
  )
}

// 3D / Three.js portfolio
function CubeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </Svg>
  )
}

// Crowd audio on
export function VolumeOnIcon(props) {
  return (
    <Svg {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </Svg>
  )
}

// Crowd audio muted
export function VolumeOffIcon(props) {
  return (
    <Svg {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </Svg>
  )
}

// Maps project id → icon component
export const PROJECT_ICONS = {
  1: CpuIcon,
  2: BookIcon,
  3: DashboardIcon,
  4: CubeIcon,
}
