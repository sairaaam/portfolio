import { fifaCards, projects, socialLinks } from '../../data/cards'
import { PROJECT_ICONS, FootballIcon } from './icons'

// FUT-style variants — same electric-blue tiers as the desktop card
const VARIANTS = {
  gold: {
    bg: 'linear-gradient(145deg, #1a2744 0%, #243660 40%, #1a2744 100%)',
    bar: 'linear-gradient(90deg, #4fc3f7, #00d4ff, #4fc3f7)',
    rating: '#4fc3f7',
  },
  silver: {
    bg: 'linear-gradient(145deg, #0f1f35 0%, #182d4a 40%, #0f1f35 100%)',
    bar: 'linear-gradient(90deg, #81d4fa, #b3e5fc, #81d4fa)',
    rating: '#81d4fa',
  },
  bronze: {
    bg: 'linear-gradient(145deg, #0a1525 0%, #122035 40%, #0a1525 100%)',
    bar: 'linear-gradient(90deg, #4fc3f766, #4fc3f7aa, #4fc3f766)',
    rating: '#b3e5fc',
  },
}

const TECH_STACK = ['React', 'Three.js', 'FastAPI', 'AWS']

function IndiaFlag({ size = 22 }) {
  return (
    <svg width={size} height={size * 0.67} viewBox="0 0 30 20" style={{ borderRadius: 2 }}>
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.5" />
      <circle cx="15" cy="10" r="0.5" fill="#000080" />
    </svg>
  )
}

function CircuitPattern({ color }) {
  return (
    <div className="relative" style={{ height: '64px', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 200 64"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', opacity: 0.22 }}
        fill="none"
        stroke={color}
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="M10 12 H70 V38 H120" />
        <path d="M190 18 H140 V46 H60" />
        <path d="M30 54 V32 H92 V8" />
        {[[70, 12], [120, 38], [140, 18], [60, 46], [92, 32], [30, 32]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.4" fill={color} stroke="none" />
        ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${color}14 0%, transparent 70%)` }}
      />
    </div>
  )
}

function MobileFIFACard({ card }) {
  const variant = VARIANTS[card.cardType] || VARIANTS.gold

  return (
    <div
      className="overflow-hidden mx-auto"
      style={{
        width: '100%',
        maxWidth: '300px',
        background: variant.bg,
        border: '1px solid rgba(79,195,247,0.4)',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px rgba(79,195,247,0.2), 0 16px 40px rgba(0,0,0,0.7), 0 0 40px rgba(79,195,247,0.08)',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: '3px', width: '100%', background: variant.bar }} />

      <div className="px-3 pt-2.5 pb-2">
        {/* Rating + position / flag + club */}
        <div className="flex items-start justify-between">
          <div>
            <div
              className="leading-none"
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: '48px',
                color: variant.rating,
                textShadow: `0 0 24px ${variant.rating}88`,
              }}
            >
              {card.rating}
            </div>
            <span
              className="inline-block uppercase"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.08em',
                color: '#4fc3f7',
                background: 'rgba(79,195,247,0.12)',
                border: '1px solid rgba(79,195,247,0.3)',
                borderRadius: '3px',
                padding: '3px 8px',
                marginTop: '4px',
              }}
            >
              {card.position}
            </span>
          </div>
          <div className="text-right pt-1">
            <IndiaFlag />
            <div
              className="mt-1.5 uppercase"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '9px',
                letterSpacing: '0.12em',
                color: variant.rating,
                opacity: 0.6,
              }}
            >
              {card.club}
            </div>
          </div>
        </div>

        {/* Circuit texture */}
        <CircuitPattern color={variant.rating} />

        {/* Name with flanking rules */}
        <div className="flex items-center gap-2 my-1">
          <span className="flex-1" style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${variant.rating}66)` }} />
          <span
            className="whitespace-nowrap"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '16px', letterSpacing: '0.06em', color: '#ffffff' }}
          >
            {card.name}
          </span>
          <span className="flex-1" style={{ height: '1px', background: `linear-gradient(90deg, ${variant.rating}66, transparent)` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="px-3 pb-2 space-y-1">
        {card.stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span
              style={{
                width: '48px',
                flexShrink: 0,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: variant.rating,
                opacity: 0.7,
              }}
            >
              {stat.label}
            </span>
            <span
              className="w-6 text-right leading-none"
              style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '17px', color: '#ffffff' }}
            >
              {stat.value}
            </span>
            <div className="overflow-hidden" style={{ width: '36px', height: '2px', background: 'rgba(255,255,255,0.08)' }}>
              <div
                style={{
                  width: `${stat.value}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${variant.rating}, ${variant.rating}cc)`,
                  boxShadow: stat.value >= 90 ? `0 0 6px ${variant.rating}` : 'none',
                }}
              />
            </div>
            <span
              className="flex-1 truncate text-right"
              style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}
            >
              {stat.skill}
            </span>
          </div>
        ))}
      </div>

      {/* Card type label */}
      <div
        className="text-center uppercase pb-2"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.3em',
          color: variant.rating,
          opacity: 0.4,
        }}
      >
        ── {card.label} ──
      </div>
    </div>
  )
}

function MobileProjectCard({ project }) {
  const Icon = PROJECT_ICONS[project.id] || FootballIcon
  const tags = project.tag.split('·').map((t) => t.trim()).filter(Boolean)

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(79,195,247,0.12)',
        borderRadius: '4px',
        padding: '20px',
      }}
    >
      <div className="absolute top-0 left-0" style={{ height: '3px', width: '100%', background: project.color, opacity: 0.7 }} />

      <div className="flex items-center gap-3 mb-3">
        <Icon size={22} style={{ color: project.color, flexShrink: 0 }} />
        <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px', letterSpacing: '0.06em', color: '#ffffff', lineHeight: 1.05 }}>
          {project.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="uppercase"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: project.color,
              background: `${project.color}14`,
              border: `1px solid ${project.color}33`,
              borderRadius: '2px',
              padding: '3px 8px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', lineHeight: 1.6, color: 'rgba(255,255,255,0.4)' }}>
        {project.description}
      </p>
    </div>
  )
}

function ScoreBox({ value }) {
  return (
    <span
      style={{
        fontFamily: '"Bebas Neue", sans-serif',
        fontSize: '40px',
        lineHeight: 1,
        color: '#ffffff',
        background: 'rgba(79,195,247,0.1)',
        border: '1px solid rgba(79,195,247,0.3)',
        borderRadius: '2px',
        padding: '4px 14px',
      }}
    >
      {value}
    </span>
  )
}

export function MobileOverlay() {
  return (
    <div className="w-full min-h-screen text-white" style={{ background: '#000814' }}>
      {/* ── Hero ── */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
        <div
          className="mb-4"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#4fc3f7' }}
        >
          Full Stack Developer · AI Engineer
        </div>
        <h1
          className="hero-scanlines"
          style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(2.6rem, 13vw, 4rem)', lineHeight: 0.92, letterSpacing: '0.04em', color: '#ffffff' }}
        >
          SARAVANA SAIRAM C
        </h1>
        <div className="h-0.5 mt-3" style={{ width: '120px', background: '#4fc3f7', boxShadow: '0 0 12px rgba(79,195,247,0.6)' }} />

        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#4fc3f7',
                padding: '2px 10px',
                border: '1px solid rgba(79,195,247,0.3)',
                background: 'rgba(79,195,247,0.06)',
                borderRadius: '2px',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div
          className="mt-6 flex items-center gap-2"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}
        >
          <FootballIcon size={13} style={{ color: '#4fc3f7' }} />
          Best experienced on desktop
        </div>
      </div>

      {/* ── Experience summary ── */}
      <div className="px-6 mb-12">
        <div
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(79,195,247,0.2)',
            borderRadius: '4px',
            padding: '1.25rem 1.25rem 1.5rem',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#4fc3f7' }}>
              EXPERIENCE
            </span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#4fc3f7' }}>
              PRESENT
            </span>
          </div>

          <div className="text-center" style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '26px', letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1 }}>
            SARAVANA SAIRAM C
          </div>
          <div className="text-center mb-4" style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
            Software Engineer · Full Stack + AI
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <ScoreBox value="2024" />
            <span style={{ width: '18px', height: '2px', background: '#4fc3f7' }} />
            <ScoreBox value="2026" />
          </div>

          <div
            className="text-center"
            style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9.5px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}
          >
            <div>OCT 2024 – JUN 2026 · SOFTWARE ENGINEER</div>
            <div>AUG 2026 – 2028 · <span style={{ color: '#4fc3f7' }}>SCHOLAR @ SAP</span></div>
          </div>
        </div>
      </div>

      {/* ── Skill cards ── */}
      <div className="px-6 mb-12">
        <div
          className="text-center mb-6"
          style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#4fc3f7' }}
        >
          Player Stats
        </div>
        <div className="space-y-6">
          {fifaCards.map((card) => (
            <MobileFIFACard key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* ── Selected works ── */}
      <div className="px-6 mb-10">
        <h2
          className="text-center"
          style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '36px', letterSpacing: '0.1em', color: '#ffffff', lineHeight: 1 }}
        >
          SELECTED WORKS
        </h2>
        <div className="flex items-center justify-center gap-3 mt-3 mb-6">
          <span style={{ width: '60px', height: '1px', background: 'rgba(79,195,247,0.3)' }} />
          <FootballIcon size={14} style={{ color: '#4fc3f7' }} />
          <span style={{ width: '60px', height: '1px', background: 'rgba(79,195,247,0.3)' }} />
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <MobileProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* ── Social stats row ── */}
      <div
        className="grid grid-cols-3 mx-6 mb-10"
        style={{ borderTop: '1px solid rgba(79,195,247,0.15)', borderBottom: '1px solid rgba(79,195,247,0.15)' }}
      >
        {socialLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-4"
            style={{ textDecoration: 'none', borderLeft: i === 0 ? 'none' : '1px solid rgba(79,195,247,0.15)' }}
          >
            <span className="uppercase text-center" style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '16px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)' }}>
              {link.label}
            </span>
            <span className="uppercase" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#4fc3f7' }}>
              {link.sub}
            </span>
          </a>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="text-center px-6 pb-12">
        <p className="uppercase" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.15)' }}>
          Built with Three.js · React · GSAP · Blender · FastAPI
        </p>
        <p className="uppercase mt-2" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(79,195,247,0.4)' }}>
          Available for full-time &amp; freelance opportunities
        </p>
      </div>
    </div>
  )
}
