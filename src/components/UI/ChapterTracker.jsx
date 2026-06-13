import { useEffect, useState } from 'react'

// Maps the raw scroll progress to a named chapter of the match.
const CHAPTERS = [
  { label: 'KICK OFF', end: 0.15 },
  { label: 'DRIBBLE', end: 0.72 },
  { label: 'PENALTY', end: 0.88 },
  { label: 'GOAL', end: 0.92 },
  { label: 'FINAL SCORE', end: 1.01 },
]

export function ChapterTracker({ scrollProgress }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    // Polls the raw scroll ref (read-only) — does not drive the scene.
    const interval = setInterval(() => {
      const p = scrollProgress.current
      const idx = CHAPTERS.findIndex((c) => p < c.end)
      setActive(idx === -1 ? CHAPTERS.length - 1 : idx)
    }, 100)
    return () => clearInterval(interval)
  }, [scrollProgress])

  return (
    <div
      className="hidden md:flex flex-col"
      style={{
        position: 'fixed',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      {CHAPTERS.map((chapter, i) => {
        const isActive = i === active
        return (
          <div key={chapter.label} className="flex flex-col items-start">
            <div className="flex items-center gap-2.5" style={{ height: '14px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: isActive ? '#4fc3f7' : 'rgba(255,255,255,0.2)',
                  boxShadow: isActive ? '0 0 10px #4fc3f7, 0 0 4px #4fc3f7' : 'none',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease',
                }}
              />
              <span
                className="uppercase"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: isActive ? '#4fc3f7' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.3s ease',
                }}
              >
                {chapter.label}
              </span>
            </div>
            {/* Connecting line between dots */}
            {i < CHAPTERS.length - 1 && (
              <span
                style={{
                  width: '1px',
                  height: '20px',
                  marginLeft: '2.5px',
                  background: 'rgba(255,255,255,0.12)',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
