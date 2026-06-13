import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HeroText({ scrollProgress }) {
  const heroRef = useRef()

  useEffect(() => {
    // Fade out hero text as scroll begins
    const interval = setInterval(() => {
      if (!heroRef.current) return
      const p = scrollProgress.current
      const opacity = Math.max(0, 1 - p / 0.12)
      const y = p * -40
      heroRef.current.style.opacity = opacity
      heroRef.current.style.transform = `translateY(${y}px)`
    }, 16)
    return () => clearInterval(interval)
  }, [scrollProgress])

  return (
    <div
      ref={heroRef}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Eyebrow */}
      <div
        className="text-xs tracking-[0.4em] uppercase mb-4 fade-in-up"
        style={{
          color: '#4fc3f7',
          fontFamily: '"JetBrains Mono", monospace',
          animationDelay: '0.3s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        Full Stack Developer · AI Engineer
      </div>

      {/* Main name with scanline texture */}
      <h1
        className="fade-in-up hero-scanlines"
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          lineHeight: 0.9,
          letterSpacing: '0.05em',
          color: '#ffffff',
          textAlign: 'center',
          animationDelay: '0.5s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        SARAVANA
      </h1>

      {/* Underline draws left → right on load */}
      <div className="hero-underline" />

      {/* Subtitle */}
      <div
        className="mt-4 text-center fade-in-up"
        style={{
          animationDelay: '0.7s',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        <div
          className="text-sm tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          React · Three.js · FastAPI · AWS
        </div>
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
          className="text-xs tracking-[0.3em] uppercase cta-pulse flex items-center gap-2"
          style={{
            color: '#4fc3f7',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <span className="cta-ball">⚽</span>
          Scroll to Kick Off
        </div>
        {/* Animated scroll arrow */}
        <div className="flex flex-col items-center gap-1 opacity-60">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRight: '1.5px solid #4fc3f7',
                borderBottom: '1.5px solid #4fc3f7',
                transform: 'rotate(45deg)',
                animation: `fadeInUp 1s ease ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
