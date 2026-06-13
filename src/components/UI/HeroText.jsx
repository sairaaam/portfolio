import { useEffect, useRef } from 'react'
import { FootballIcon } from './icons'

const TECH_STACK = ['React', 'Three.js', 'FastAPI', 'AWS']

export function HeroText({ scrollProgress }) {
  const heroRef = useRef()

  useEffect(() => {
    // Hero exits upward as the player starts moving (progress > 0.05).
    // Reads the raw scroll value only — does not drive any scene animation.
    const interval = setInterval(() => {
      if (!heroRef.current) return
      const p = scrollProgress.current
      const t = Math.min(1, Math.max(0, (p - 0.02) / 0.1))   // 0 → 1 across the exit window
      heroRef.current.style.opacity = String(1 - t)
      heroRef.current.style.transform = `translateY(${-80 * t}px)`
    }, 16)
    return () => clearInterval(interval)
  }, [scrollProgress])

  return (
    <div
      ref={heroRef}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ zIndex: 10, willChange: 'transform, opacity' }}
    >
      {/* Eyebrow */}
      <div
        className="fade-in-up"
        style={{
          fontSize: '12px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
          color: '#4fc3f7',
          fontFamily: '"JetBrains Mono", monospace',
          animationDelay: '0.3s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        Full Stack Developer · AI Engineer
      </div>

      {/* Main name — laid onto the pitch with a subtle ground-plane tilt */}
      <div
        className="fade-in-up"
        style={{
          perspective: '800px',
          animationDelay: '0.5s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        <h1
          className="hero-scanlines"
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 0.9,
            letterSpacing: '0.05em',
            color: '#ffffff',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            transform: 'rotateX(2deg)',
            willChange: 'transform',
          }}
        >
          SARAVANA SAIRAM C
        </h1>
      </div>

      {/* Underline draws left → right on load */}
      <div className="hero-underline" />

      {/* Tech stack pills */}
      <div
        className="mt-6 flex flex-wrap items-center justify-center gap-2 fade-in-up"
        style={{
          animationDelay: '0.7s',
          opacity: 0,
          animationFillMode: 'forwards',
          maxWidth: '90vw',
        }}
      >
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

      {/* Scroll CTA */}
      <div
        className="absolute bottom-12 flex flex-col items-center gap-3 fade-in-up"
        style={{
          animationDelay: '1s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        <div
          className="cta-pulse flex items-center gap-2"
          style={{
            fontSize: '12px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#4fc3f7',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <span className="flex items-center"><FootballIcon size={14} /></span>
          Scroll to Kick Off
        </div>
        {/* Three stacked chevrons fading in sequence */}
        <div className="flex flex-col items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRight: '1.5px solid #4fc3f7',
                borderBottom: '1.5px solid #4fc3f7',
                transform: 'rotate(45deg)',
                animation: `chevron-fade 1.5s ease ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
