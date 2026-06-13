import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Windows renders the 🇮🇳 emoji as the letters "IN" — inline SVG is reliable everywhere
function IndiaFlag({ size = 24 }) {
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

function StatRow({ stat, accentColor, visible, index }) {
  const rowRef = useRef()
  const barRef = useRef()

  useEffect(() => {
    if (!rowRef.current || !barRef.current) return
    if (visible) {
      gsap.fromTo(rowRef.current,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.4, delay: 0.2 + index * 0.05, ease: 'power2.out', overwrite: true }
      )
      gsap.fromTo(barRef.current,
        { width: '0%' },
        { width: `${stat.value}%`, duration: 0.8, delay: 0.4 + index * 0.05, ease: 'power2.out', overwrite: true }
      )
    } else {
      gsap.killTweensOf([rowRef.current, barRef.current])
      gsap.set(rowRef.current, { opacity: 0, x: -12 })
      gsap.set(barRef.current, { width: '0%' })
    }
  }, [visible, stat.value, index])

  return (
    <div ref={rowRef} className="flex items-center gap-2" style={{ opacity: 0 }}>
      <span
        className="text-[10px] font-bold w-7 tracking-wider"
        style={{ color: accentColor, opacity: 0.7, fontFamily: '"JetBrains Mono", monospace' }}
      >
        {stat.label}
      </span>
      <span className="text-base font-bold text-white w-7 text-right leading-none">
        {stat.value}
      </span>
      <span
        className="text-[11px] flex-1 truncate"
        style={{ color: 'rgba(255,255,255,0.45)', fontFamily: '"Inter", sans-serif' }}
      >
        {stat.skill}
      </span>
      <div className="w-10 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            width: '0%',
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
            boxShadow: `0 0 6px ${accentColor}99`,
          }}
        />
      </div>
    </div>
  )
}

export function FIFACard({ card, visible }) {
  const cardRef = useRef()
  const dir = card.slideFrom === 'left' ? -1 : 1

  useEffect(() => {
    if (!cardRef.current) return

    if (visible) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, x: dir * 160, rotateY: dir * 25, scale: 0.85 },
        {
          opacity: 1, x: 0, rotateY: 0, scale: 1,
          duration: 0.7, ease: 'expo.out', overwrite: true,
          transformPerspective: 900,
        }
      )
    } else {
      gsap.to(cardRef.current, {
        opacity: 0, x: dir * 80, rotateY: dir * 15, scale: 0.92,
        duration: 0.4, ease: 'power2.in', overwrite: true,
        transformPerspective: 900,
      })
    }
  }, [visible, dir])

  return (
    <div
      ref={cardRef}
      className="pointer-events-auto select-none fifa-card"
      style={{
        opacity: 0,
        width: 'clamp(204px, 17vw, 240px)',
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden fifa-card-body"
        style={{
          background: 'linear-gradient(145deg, rgba(5,15,30,0.95), rgba(10,25,50,0.9))',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(79,195,247,0.25)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${card.accentColor}, ${card.accentColor}44)` }}
        />

        <div className="px-4 pt-3 pb-2">
          {/* Rating / position / flag */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <div
                className="leading-none"
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: '64px',
                  color: card.accentColor,
                  textShadow: `0 0 24px ${card.accentColor}88, 0 0 60px ${card.accentColor}33`,
                }}
              >
                {card.rating}
              </div>
              <span
                className="inline-block text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full mt-1"
                style={{ background: card.accentColor, color: '#04101e' }}
              >
                {card.position}
              </span>
            </div>
            <div className="text-right pt-1">
              <IndiaFlag />
              <div
                className="text-[9px] tracking-widest mt-1.5 uppercase"
                style={{ color: card.accentColor, opacity: 0.6, fontFamily: '"JetBrains Mono", monospace' }}
              >
                {card.club}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full my-2"
            style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor}55, transparent)` }}
          />

          {/* Name */}
          <div
            className="text-center mb-2"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '16px',
              letterSpacing: '0.2em',
              color: '#ffffff',
            }}
          >
            {card.name}
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 pb-3 space-y-1.5">
          {card.stats.map((stat, i) => (
            <StatRow
              key={stat.label}
              stat={stat}
              accentColor={card.accentColor}
              visible={visible}
              index={i}
            />
          ))}
        </div>

        {/* Card type label */}
        <div
          className="text-center text-[9px] tracking-[0.3em] uppercase pb-2 opacity-30"
          style={{ color: card.accentColor, fontFamily: '"JetBrains Mono", monospace' }}
        >
          {card.label}
        </div>

        {/* Hover shimmer sweep */}
        <div className="shimmer-sweep absolute inset-0 pointer-events-none" />

        {/* Inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${card.accentColor}0a 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  )
}
