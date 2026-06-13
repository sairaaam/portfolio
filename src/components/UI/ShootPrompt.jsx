import { useEffect, useState } from 'react'
import { matchState } from '../../state/matchState'

// "PRESS SPACE TO SHOOT" — appears when the player is set on the run-up mark
// and the shot hasn't been taken. Space is handled in App; clicking the badge
// works too (trackpad users).
export function ShootPrompt({ scrollProgress }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(scrollProgress.current >= 0.72 && matchState.shot === 'idle')
    }, 100)
    return () => clearInterval(interval)
  }, [scrollProgress])

  const shoot = () => {
    if (matchState.shot === 'idle') matchState.shot = 'requested'
  }

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
      style={{
        bottom: '12vh',
        zIndex: 15,
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <button
        onClick={shoot}
        className="shoot-prompt-pulse"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          padding: '0.9rem 1.8rem',
          background: 'rgba(5,15,30,0.85)',
          border: '1px solid rgba(79,195,247,0.5)',
          borderRadius: '10px',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(79,195,247,0.25)',
        }}
      >
        <span
          style={{
            padding: '0.3rem 0.9rem',
            border: '1.5px solid rgba(255,255,255,0.85)',
            borderBottomWidth: '3px',
            borderRadius: '6px',
            color: '#ffffff',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
          }}
        >
          SPACE
        </span>
        <span
          style={{
            color: '#4fc3f7',
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '1.5rem',
            letterSpacing: '0.18em',
            lineHeight: 1,
          }}
        >
          SHOOT
        </span>
      </button>
      <div
        className="mt-3 text-xs tracking-[0.3em] uppercase"
        style={{
          color: 'rgba(255,255,255,0.45)',
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        the keeper is waiting
      </div>
    </div>
  )
}
