import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// FUT-style variants keyed off the card's cardType. Electric-blue brand palette
// stands in for the classic gold/silver/bronze tiers.
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

// Windows renders the 🇮🇳 emoji as the letters "IN" — inline SVG is reliable everywhere
function IndiaFlag({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size * 0.67}
      viewBox="0 0 30 20"
      style={{ borderRadius: 2, display: 'inline-block', boxShadow: '0 0 8px rgba(0,0,0,0.5)' }}
    >
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.5" />
      <circle cx="15" cy="10" r="0.5" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI) / 12
        return (
          <line
            key={i}
            x1={15} y1={10}
            x2={15 + Math.cos(a) * 2.6}
            y2={10 + Math.sin(a) * 2.6}
            stroke="#000080"
            strokeWidth="0.18"
          />
        )
      })}
    </svg>
  )
}

// Stylized running footballer silhouette — decorative, sits behind the name
// at low opacity to give FUT-card energy without a photo.
function PlayerSilhouette({ color }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: '80px', overflow: 'hidden' }}
    >
      <svg
        viewBox="0 0 24 24"
        style={{ height: '92px', width: 'auto', opacity: 0.2, filter: `drop-shadow(0 0 12px ${color})` }}
        fill={color}
        aria-hidden="true"
      >
        <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
      </svg>
      {/* Ball at the running foot */}
      <span
        style={{
          position: 'absolute',
          right: '26%',
          bottom: '8px',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: color,
          opacity: 0.28,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
  )
}

function StatRow({ stat, accentColor, visible, index }) {
  const rowRef = useRef()
  const barRef = useRef()
  const hot = stat.value >= 90

  useEffect(() => {
    if (!rowRef.current || !barRef.current) return
    if (visible) {
      gsap.fromTo(rowRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, delay: 0.3 + index * 0.05, ease: 'power2.out', overwrite: true }
      )
      gsap.fromTo(barRef.current,
        { width: '0%' },
        { width: `${stat.value}%`, duration: 0.8, delay: 0.4 + index * 0.05, ease: 'power2.out', overwrite: true }
      )
    } else {
      gsap.killTweensOf([rowRef.current, barRef.current])
      gsap.set(rowRef.current, { opacity: 0, x: -10 })
      gsap.set(barRef.current, { width: '0%' })
    }
  }, [visible, stat.value, index])

  return (
    <div ref={rowRef} className="flex items-center gap-2" style={{ opacity: 0 }}>
      <span
        className="w-7"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: accentColor,
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
          ref={barRef}
          style={{
            width: '0%',
            height: '100%',
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
            boxShadow: hot ? `0 0 6px ${accentColor}` : 'none',
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
  )
}

export function FIFACard({ card, visible }) {
  const cardRef = useRef()
  const dir = card.slideFrom === 'left' ? -1 : 1
  const variant = VARIANTS[card.cardType] || VARIANTS.gold

  // Local dismiss — the × lets the user slide the card away if it blocks the
  // scene. Resets whenever the card is re-triggered by scroll.
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (visible) setDismissed(false)
  }, [visible])
  const show = visible && !dismissed

  // Smart vertical anchoring: measure the real card height and keep it fully
  // inside the viewport (never clipped top or bottom), recomputed on resize.
  const [safeTop, setSafeTop] = useState(16)
  useLayoutEffect(() => {
    const compute = () => {
      const h = cardRef.current?.offsetHeight || 280
      const vh = window.innerHeight
      const ideal = (vh - h) / 2
      setSafeTop(Math.max(16, Math.min(ideal, vh - h - 16)))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  useEffect(() => {
    if (!cardRef.current) return
    if (show) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, x: dir * 200, rotateY: dir * 20, scale: 0.85 },
        {
          opacity: 1, x: 0, rotateY: 0, scale: 1,
          duration: 0.7, ease: 'back.out(1.4)', overwrite: true,   // overshoot ≈ cubic-bezier(.34,1.56,.64,1)
          transformPerspective: 900,
        }
      )
    } else {
      gsap.to(cardRef.current, {
        opacity: 0, x: dir * 220, rotateY: dir * 16, scale: 0.9,
        duration: 0.4, ease: 'power2.in', overwrite: true,
        transformPerspective: 900,
      })
    }
  }, [show, dir])

  return (
    <div
      ref={cardRef}
      className="pointer-events-auto select-none fifa-card"
      style={{
        opacity: 0,
        width: '200px',
        position: 'absolute',
        top: `${safeTop}px`,
        left: 0,
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="relative overflow-hidden fifa-card-body"
        style={{
          background: variant.bg,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(79,195,247,0.4)',
          borderRadius: '4px',
          boxShadow:
            '0 0 0 1px rgba(79,195,247,0.2), 0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(79,195,247,0.08)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: '3px', width: '100%', background: variant.bar }} />

        {/* Dismiss — slides the card away if it blocks the scene */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss card"
          className="absolute flex items-center justify-center"
          style={{
            top: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            color: 'rgba(255,255,255,0.3)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
            fontSize: '16px',
            zIndex: 2,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          ×
        </button>

        <div className="px-3 pt-2.5 pb-2">
          {/* Rating + position (left) / flag + club (right) */}
          <div className="flex items-start justify-between">
            <div>
              <div
                className="leading-none"
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: '48px',
                  color: variant.rating,
                  textShadow: `0 0 24px ${variant.rating}88, 0 0 60px ${variant.rating}33`,
                }}
              >
                {card.rating}
              </div>
              <div
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: '18px',
                  letterSpacing: '0.1em',
                  color: '#ffffff',
                  marginTop: '2px',
                }}
              >
                {card.position}
              </div>
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

          {/* Player silhouette */}
          <PlayerSilhouette color={variant.rating} />

          {/* Name with flanking rules */}
          <div className="flex items-center gap-2 my-1">
            <span className="flex-1" style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${variant.rating}66)` }} />
            <span
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: '18px',
                letterSpacing: '0.15em',
                color: '#ffffff',
              }}
            >
              {card.name}
            </span>
            <span className="flex-1" style={{ height: '1px', background: `linear-gradient(90deg, ${variant.rating}66, transparent)` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="px-3 pb-2 space-y-1">
          {card.stats.map((stat, i) => (
            <StatRow
              key={stat.label}
              stat={stat}
              accentColor={variant.rating}
              visible={visible}
              index={i}
            />
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

        {/* Hover shimmer sweep */}
        <div className="shimmer-sweep absolute inset-0 pointer-events-none" />

        {/* Inner top glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${variant.rating}0a 0%, transparent 70%)` }}
        />
      </div>
    </div>
  )
}
